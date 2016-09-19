// по образцу sandhi/test/gita/dict2clean
// читает db gita, пропускает через sandhi.outer, sandhi.del,
// раскладывает sandhi (имеющие dicts) на padas, считает варианты цепочек,
// реальная расшифровка должна быть обнаружена среди всех вариантов
//

var salita = require('salita-component');
var _ = require('underscore');
// var util = require('util');
var path = require('path');
var fs = require('fs');
var s = require('sandhi');
var u = s.u;
var c = s.const;
var sandhi = s.sandhi;
// var outer = s.outer;
var outer = require('../lib/outer');
var log = u.log;
var p = u.p;
var inc = u.include;
var series = require("async/eachSeries");

var Relax = require('relax-component');
// var relax = new Relax('http://admin:kjre4317@localhost:5984');
var relax = new Relax('http://localhost:5984');
relax.dbname('gita');

// var rasper = require('../index');
// var rasper = require('../weak_add'); // слабый вариант, требующий add в рекурсии
var morpheus = require('../index');

var supCachePath = path.join(__dirname, '../node_modules/subanta/lib/sup_cache.txt');
var supCaches = fs.readFileSync(supCachePath).toString().split('\n');
var sups = {};
var term, size, gend, dict, svar, json;
// term, term.length, s.gend, s.dict, s.var, JSON.stringify(s.sups)
supCaches.forEach(function(cache) {
    if (cache == '') return;
    if (cache[0] == '#') return;
    [term, size, json] = cache.split('-');
    let morphs = JSON.parse(json);
    // sups.push({term: term, size: size, gend: gend, dict: dict, var: svar, sups: JSON.parse(json)});
    // sups.push({term: term, size: size, morphs: morphs });
    sups[term] = morphs;
});



// var lat = process.argv.slice(2)[0] || false;

var tests = [];
runGitaTests();


// IDX 648 sutra: 8.18 _ID 832c9e1251e472391e59084ffdb8973d
// NO existing key - samasa: tatrEvAvyaktasaMjYake - तत्रैवाव्यक्तसंज्ञके dicts: [ 'तत्र', 'एव', 'अव्यक्त', 'सञ्ज्ञके' ] cleans: [ 'तत्र', 'एव', 'अव्यक्त', 'सञ्ज्ञके' ]
// संज्ञके != सञ्ज्ञके - changed in a middle of a pada

// Error: NO EXISTING KEY

function runGitaTests() {
    getDocs(function(docs) {
        // var cleans = cleaner(docs)
        // docs = docs.slice(460);
        docs.forEach(function(doc, idx) {
            // log('IDX', idx, 'sutra:', doc.num, '_ID', doc._id);
            // if (idx < 50) return;
            // if (idx > 3) return;
            doc.lines.forEach(function(line, idy) {
                if (line.form == '।') return;
                if (!line.dicts) return;
                // if (doc.num != '1.20') return;
                var samasa = line.form;
                if (samasa == 'तत्रैवाव्यक्तसंज्ञके') return;
                // log('LINE', idx, idy, line);
                if (samasa.indexOf('ऽ') > -1) return; // потому что аваграха обрабатывается иначе - деление всегда сразу по ней
                if (samasa.length > 22) {
                    log('LONG:', samasa, 'size:', samasa.length);
                    return;
                }

                var nextline = doc.lines[idy+1];
                var next;
                if (nextline) next = nextline.form;
                var clean = outer.simple(samasa, next);
                // log('CLEAN samasa:', samasa, 'clean:', clean, 'next:', next);

                // долгая А заменяется на visarga только если такая замена есть в резутьтате - last of dicts
                // по сути, я подглядываю ответ
                // может быть, можно просмотреть все такие случаи и увидеть закономеность? Например, слова на -r?
                var last = clean[clean.length-1];
                if (last == c.H) {
                    // log('HHHXS', line)
                    var lastdict = line.dicts[line.dicts.length-1];
                    var lastform = lastdict.form;
                    var fin = lastform[lastform.length-1];
                    if (fin == c.A) clean = samasa;
                    if (fin == 'ो') clean = samasa;
                    if (fin == 'े') clean = [samasa, c.e].join(''); // это верно, только если samasa на -a
                    if (u.isConsonant(fin)) clean = samasa;
                }
                // конечно, нужно будет отменить "второе простое правило" про -А в outer-sandhi
                // log('CLEAN FIXED - samasa:', samasa, 'clean:', clean);

                var dicts = line.dicts.map(function(dict) { return dict.form; });
                var cleans = dicts.map(function(dict, idz) {
                    var next = dicts[idz+1];
                    next = (next) ? next.form : '';
                    return outer.correctM(dict, next); // simple outer, only M
                });

                var key = cleans.join('-');
                var test = {idx: idx, idy: idy, samasa: samasa, clean: clean, next: next, key: key};
                tests.push(test);
                return;


            });
        });

        // =============== TESTS ================
        log('Ts', tests.length);
        tests = tests.slice(57, 100);
        series(tests, asyncTest, function(err){
            // if any of the saves produced an error, err would equal that error
            log('async ERR:', err);
        });


    });
}

function asyncTest(test, cb) {
    // log('T', test);
    if (inc([23, 26], test.idx) && inc([7, 11], test.idy)) {
        cb();
        return;
    }
    // if (test.clean != 'हन्तुमिच्छामि') return;
    let clean = test.clean;
    let next = test.next;
    let samasa = test.samasa;
    morpheus.run(clean, next, sups, function(morph) {
        // log('MORPH', clean, next, morph);
        var exists = false;
        var rkey;
        // log('TEST-KEY-dicts', dicts);
        // log('TEST-KEY-cleans', cleans);
        // log('TEST', key);
        if (!morph || !morph.chains) log('NO MORPH sms:', test.idx, test.idy, test.samasa, 'clean:', test.clean, 'next:', next, 'key:', test.key);

        morph.chains.forEach(function(pdch) {
            rkey = pdch.chain.join('-');
            // log('TEST-KEY', key);
            if (rkey == test.key) {
                // log('TRUE');
                exists = true;
                return;
            }
        });
        if (exists) log('GITA TEST OK', test.idx, test.idy, 'sms:', test.samasa, 'clean:', test.clean, 'next:', test.next, 'key:', test.key);
        else {
            // p(flakes);
            var salat = salita.sa2slp(samasa);
            // var clelat = salita.sa2slp(clean);
            log('NO existing key - samasa:', test.idx, test.idy, salat, '-', samasa, 'key:', test.key, 'res-key:', rkey);
            throw new Error('NO EXISTING KEY');
        }
        cb();
    });
}




// line.clean сам нуждается в исправлении, в частности, анусвара - на m
// a.k.a outer-light, только для составных внутренних line.clean, последняя требует outer
// function correct(str, next) {
//     var clean = str;
//     var fin = u.last(str);
//     if (!next) next = '';
//     // if (!next.form) next = ''; // откуда тут объект? д.б. строка только
//     var beg = next[0];
//     var n = 'म';
//     // здесь изображение правила: doubled palatal - var dental = u.palatal2dental(mark.fin);
//     if (beg == 'च') n = 'न';
//     if (fin == c.anusvara) clean = [u.wolast(str), n, c.virama].join('');
//     // три простые правила, как в outer ?
//     // else if (fin == 'ो' && inc(c.soft, beg)) clean = [u.wolast(str), c.visarga].join('');
//     // else if (fin == 'ो' && inc(c.soft, beg)) log('OOO', str, 'beg', beg, 222) // परयाो
//     // else if (fin == 'ा' && (inc(c.allvowels, beg) || inc(c.soft, beg))) clean = [samasa, c.visarga].join('');
//     return clean;
// }


function getDocs(cb) {
    var view = 'gita/byDocs';
    relax
        .view(view)
    // .query(query)
        .query({include_docs: true})
        .query({limit: 10000})
        .end(function(err, res) {
            if (err) cb(err);
            var rows = JSON.parse(res.text.trim()).rows;
            var docs = _.map(rows, function(row) { return row.doc; });
            cb(docs);
        });
    // cb([]);
}
