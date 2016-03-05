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
relax.dbname('gita-add');

var morph = require('../index');

runGitaTests();

function runGitaTests() {
    getDocs(function(docs) {
        docs = docs.slice(-20);
        docs.forEach(function(doc, idx) {
            //
        });
        log('DOCS', docs);
    });
}


function getDocs(cb) {
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
