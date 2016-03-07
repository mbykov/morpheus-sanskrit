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
var outer = s.outer;
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
        docs = docs.slice(1, 3);
        var ok;
        var tests = [];
        var form, next, nextLine, trn, pdch;
        var dicts;
        docs.forEach(function(doc, idx) {
            // log('D', idx, doc);
            doc.lines.forEach(function(line, idy) {
                if (line.trn) return;
                form = line.form;
                nextLine = doc.lines[idy+1];
                next = (nextLine) ? nextLine.form : null;
                if (next == '।') next = null;
                if (form == '।') return;
                // var samasa = outer(form, next);
                // if (form != samasa) log('L', idy, form, 'next:', next, 'clean', samasa);
                pdch = line.dicts.map(function(dict) { return dict.form});
                var test = {sutra: doc.num, form: form, next: next, pdch: pdch};
                tests.push(test);
            });
        });
        log('TESTS SIZE', tests.length);
        async.mapSeries(tests, checkTest, function(res) {
            log('====================', res);
        });
    });
}

function checkTest(test, cb) {
    var samasa = test.form;
    morph.run(samasa, test.next, function(dicts) {
        var salat = salita.sa2slp(samasa)
        log('SALAT', salat)
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
            log('ABSENT', test);
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
