// тесты rasper для morph-0.3 на основе словаря gita-add
// читает записи gita-add, если samasa - раскладывает, проверяет наличие всех padas в gita-add
// подобно flakes/test/gita.js, но там проверяются жестко цепочки padas, а здесь просто наличие flakes в словаре

var salita = require('salita-component');
var _ = require('underscore');
var async = require('async');
// var fs = require('fs');
// var util = require('util');
var s = require('sandhi');
var u = s.u;
var c = s.const;
var sandhi = s.sandhi;
// var outer = s.outer;
var log = u.log;
var p = u.p;
var inc = u.include;
// var outer = require('../lib/outer');

var Relax = require('relax-component');
var relax = new Relax('http://admin:kjre4317@localhost:5984');
relax.dbname('gita');

var morph = require('../index');

runGitaTests();

function runGitaTests() {
    getDocs(function(docs) {
        docs = docs.slice(10);
        var tests = [];
        var form, next, nextLine, trn, pdch;
        var dicts;
        docs.forEach(function(doc, idx) {
            // log('D', idx, doc);
            if (!doc.lines) return;
            doc.lines.forEach(function(line, idy) {
                if (line.trn) return;
                form = line.form;
                if (form == 'शक्नोतीहैव') return; // FIXME: FIXME: FIXME: इहैव не достается из базы, 5.23 // slice(226, 238) // आत्मैव
                if (form == 'वर्तेतात्मैव') return; // FIXME: FIXME: FIXME: इहैव не достается из базы, 6.6 // slice(238) // आत्मैव
                if (form == 'यावान्यश्चास्मि') return; // тоже нет второй пады, चास्मि - но тут нет aiva
                if (form == 'त्वात्मैव') return; // тоже нет второй пады, आत्मैव

                if (form.indexOf('ऽ') > -1) return; // потому что avagraha обрабатывается иначе - деление всегда сразу по ней
                if (form.length > 19) return;
                nextLine = doc.lines[idy+1];
                next = (nextLine) ? nextLine.form : null;
                // if (next == '।') next = null;
                if (form == '।') return;
                pdch = line.dicts.map(function(dict) { return correctM(dict.form) });
                var test = {idx: idx, sutra: doc.num, form: form, next: next, pdch: pdch};
                tests.push(test);
            });
        });
        log('TESTS SIZE', tests.length);
        async.mapSeries(tests, checkTest);
    });
}

// не определяется из-за недоделки обработки формы глагола в MW, это не нужно в gita-add
// var gitaVerb = ['kimakurvata', 'saYjanayanharzaM'];

function checkTest(test, cb) {
    var samasa = test.form;
    var ok;
    morph.run(samasa, test.next, function(res) {
        var salat = salita.sa2slp(samasa);
        // if (inc(gitaVerb, salat)) {
        //     cb(null, true);
        //     return;
        // }
        // log('TEST SALAT', salat, test.pdch)
        if (!res || !res.pdchs || res.pdchs.length == 0) {
            log('NO PDCHS', test.idx, test.sutra, 'salat:', salat, 'samasa', samasa);
            // log('holeys:', res.holeys)
            log('test:', test);

            throw new Error('no pdchs')
            cb(null, true);
            return;
        }
        var pdchs = res.pdchs;
        var testpdch = outerCheck(test)
        // выходит, лучше здесь исправлять outer.sandhi, потому что в morph-03 -e и -H будут обрезаны в результатах все равно?
        // а реальное окончание - флексия -e - останется в результате pdchs, поскольку будет в samasa

        ok = false;
        var testpdch = JSON.stringify(test.pdch);
        pdchs.forEach(function(pdch) {
            if (JSON.stringify(pdch.chain) == testpdch) ok = true;
        })
        if (!ok) {
            log('ABSENT:', salat);
            p('pdchs:', pdchs.slice(0,9)); // उपसंगम्
            p('test:', test);
            throw new Error();
            cb(null, true);
        } else {
            log('OK', test.idx, test.sutra, salat, samasa);
            return cb(null, salat);
        }
    }); // morph
}

function getDocs(cb) {
    relax
        .all()
    // .query(query)
        .query({include_docs: true})
        // .query({limit: 10000})
        .end(function(err, res) {
            if (err) cb(err);
            // log('DDD', res.text.trim())
            var rows = JSON.parse(res.text.trim()).rows;
            var docs = _.map(rows, function(row) { return row.doc });
            cb(docs);
        });
}

function getDocs_(cb) {
    var view = 'gita-add/byPdch';
    relax
        .view(view)
    // .query(query)
    // .query({include_docs: true})
        .query({limit: 10000})
        .end(function(err, res) {
            if (err) cb(err);
            var rows = JSON.parse(res.text.trim()).rows;
            var docs = _.map(rows, function(row) { return {samasa: row.key, pdchs: row.value}; });
            cb(docs);
        });
}

function correctM(str) {
    var clean = str;
    var fin = u.last(str);
    if (fin == c.anusvara) clean = [u.wolast(str), c.m, c.virama].join('');
    return clean;
}

// исправляет влияние outer-sandhi на последнюю pada в padaccheda, для совпадения с тестом - samasa
function outerCheck(test) {
    var pdch = test.pdch;
    var lastPada = u.last(pdch)[0];
    var lastPadaFin = u.last(lastPada);
    var fin = u.last(test.form);
    var beg = u.first(test.next);

    var pada;
    if (lastPadaFin == c.e && u.isConsonant(fin)) {
        pada = u.wolast(lastPada);
        pdch.pop();
        pdch.push(pada);
    } else if (lastPadaFin == c.H && fin == c.A && (inc(c.soft, beg) || inc(c.allvowels, beg))) {
        pada = u.wolast(lastPada);
        pdch.pop();
        pdch.push(pada);
    }

    return pdch;

    // это убить после прогона всех тестов

    var odds = [];
    var odd;
    // по-моему, далее я опять воспроизвожу аккуратно outer.js:
    if (u.isConsonant(opt.fin) && (u.isConsonant(opt.beg) || u.isSimple(opt.beg))) {
        terms.forEach(function(term) {
            if (inc(['स', 'एष'], term)) {
                odd = [term, c.visarga].join('');
                odds.push(odd);
                // FIXME: где объект ?
                // log('SA - ESHA', odd);
                throw new Error('SA:-ESHA: OUTER');
            }
        });
    }
    // log('=========', opt.fin, u.isConsonant(opt.fin), opt.beg, u.isSimple(opt.beg), c.allexa)
    if (u.isConsonant(opt.fin) && u.isVowExA(opt.beg)) {
        var terms_e = terms.map(function(term) { return {query: [term, c.e].join(''), flake: term, var: 'e'} });
        var terms_H = terms.map(function(term) { return {query: [term, c.visarga].join(''), flake: term, var: 'H'} });
        odds = odds.concat(terms_e, terms_H);
        // log('OOOO', terms_H)
    }
    // log('FIN', opt.fin, 'BEG', opt.beg);
    else if (opt.fin == c.o && inc(c.soft, opt.beg)) {
        var terms_o = terms.map(function(term) { return {query: [u.wolast(term), c.visarga].join(''), flake: term, var: 'o'}  });
        // log('OOOO', terms_o)
        odds = odds.concat(terms_o);
    }
    else if (opt.fin == c.A && (inc(c.soft, opt.beg) || inc(c.allvowels, opt.beg))) {
        var terms_A = terms.map(function(term) { return  {query: [term, c.visarga].join(''), flake: term, var: 'A'}   });
        // log('OOOO', terms_o)
        odds = odds.concat(terms_A);
    }
    else if (opt.fin == c.virama && inc(c.onlysoft, opt.penult) && inc(c.soft, opt.beg)) {
        var terms_hard = terms.map(function(term) {
            var hard_fin = u.class1(opt.penult);
            var hard = term.slice(0, -2);
            return {query: [hard, hard_fin, c.virama].join(''), flake: term, var: 'hard'} ;
        });
        // log('SOFT TO HARD', terms)
        odds = odds.concat(terms_hard);
    }
    return odds;
}

function options(samasa, next) {
    var opt = {};
    opt.fin = u.last(samasa);
    opt.penult = u.penult(samasa);
    opt.beg = u.first(next);
    return opt;
}
