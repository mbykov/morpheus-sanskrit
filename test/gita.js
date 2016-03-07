// тесты rasper для morph-0.3 на основе словаря gita-add
// читает записи gita-add, если samasa - раскладывает, проверяет наличие всех padas в gita-add
// подобно flakes/test/gita.js, но там проверяются жестко цепочки padas, а здесь просто наличие flakes в словаре

var salita = require('salita-component');
var _ = require('underscore');
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
        docs = docs.slice(3,7);
        // var ok;
        var form, next, nextLine, samasa, trn, pdch;
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
                samasa = outer(form, next);
                if (form != samasa) log('L', idy, form, 'next:', next, 'clean', samasa);
                pdch = line.dicts.map(function(dict) { return dict.form});

                var salat = salita.sa2slp(samasa)
                // log('PDCH', salat, samasa, 'pdch:', pdch);
                // morph забирает dicts из gita-add
                morph.run(samasa, next, function(dicts) {
                    log('idx', idx, salat, samasa);
                    if (!dicts || dicts.length == 0) {
                        log('NO DICTS idx:', idx, 'salat', salat, 'samasa', samasa);
                    }
                    var stems = dicts.map(function(dict) { return dict.stem});
                    log('PDCH', salat, samasa, 'pdch:', pdch, 'stems:', stems);
                    pdch.forEach(function(pada) {
                        if (inc(stems, pada)) ok = true;
                        else ok = false;
                    });
                    if (!ok) {
                        log('ABSENT', line);
                        throw new Error();
                    } else {
                        log('OK')
                    }
                }); // morph

            });
        //     if (doc.trns) return;
        //     var samasa = doc.form;
        //     var nextDoc = docs[idx+1];
        //     var next = (nextDoc) ? nextDoc.form : '';
        //     log('SAMASA', samasa, 'NEXT', next);
        //     if (samasa.length > 19) return;
        //     var pdchs = doc.pdchs.map(function(pdch) { return pdch.split('-')});
        });
        // log('DOCS', docs);
    });
}


// нельзя забирать через .all, потому что next не тот.
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
