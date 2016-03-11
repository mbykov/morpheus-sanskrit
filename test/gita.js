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

var Relax = require('relax-component');
var relax = new Relax('http://admin:kjre4317@localhost:5984');
relax.dbname('gita');

var morph = require('../index');

runGitaTests();

function runGitaTests() {
    getDocs(function(docs) {
        // docs = docs.slice(600);
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

                if (form.length > 19) return;
                nextLine = doc.lines[idy+1];
                next = (nextLine) ? nextLine.form : null;
                if (next == '।') next = null;
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

function checkTest(test, cb) {
    var samasa = test.form;
    var ok;
    morph.run(samasa, test.next, function(dicts) {
        var salat = salita.sa2slp(samasa)
        // log('SALAT', salat)
        if (!dicts || dicts.length == 0) {
            log('NO DICTS', 'salat:', salat, 'samasa', samasa);
        }
        var stems = dicts.map(function(dict) { return dict.stem});
        // log('PDCH', idx, salat, samasa, 'pdch:', pdch, 'stems:', stems);
        test.pdch.forEach(function(pada) {
            if (inc(stems, pada)) ok = true;
            else ok = false;
        });
        if (!ok) {
            log('ABSENT:', salat);
            log('stems:', stems);
            log('test:', test);
            throw new Error();
        } else {
            log('OK', salat, samasa);
            return cb(null, salat);
        }
    }); // morph
}

function getDocs(cb) {
    relax
        .all([])
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
