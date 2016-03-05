// morpheus v.0.3.0

var _ = require('underscore');
var sandhi = require('sandhi');
var c = sandhi.const;
var u = sandhi.u;
var s = sandhi.sandhi;
var log = u.log;
var p = u.p;
var rasper = require('flakes');

dbpath = 'http://localhost:5984';
var Relax = require('relax-component');
var relax = new Relax(dbpath);
relax.dbname('gita-add');

module.exports = morpheus();

function morpheus() {
    if (!(this instanceof morpheus)) return new morpheus();
    this.queries = [];
}

// main
morpheus.prototype.run = function(samasa, cb) {
    var clean = correctM(samasa);
    var flakes = rasper.cut(clean);
    // p(flakes);
    var stems = _.uniq(_.flatten(flakes));
    // log(stems);
    getDicts(stems, function(err, dbdicts) {
        log('DBD', dbdicts);
        // TODO: теперь установить соответствие между flakes и dbdicts
        // с учетом того, что в словаре Гиты dicts повторяются
    });
    cb('ok');
    return;
}


// забрать реально существующие padas из BD
function getDicts(stems, cb) {
    // stems = ["क्तात्मा","तात्मा","आत्मा","अत्मा","त्मा","मा"];
    var keys = ['keys=', JSON.stringify(stems)].join('');
    // var qkeys = 'keys=' + JSON.stringify(stems);
    var view = 'gita-add/byForm';
    // var view = 'sa/stem';
    log('SSS-new', keys);
    // qkeys = keys=["क्तात्मा","तात्मा","आत्मा","अत्मा","त्मा","मा"];
    // qkeys = 'keys=["क्तात्मा","तात्मा","आत्मा","अत्मा","त्मा","मा"]';
    // log('SSS-new', qkeys);
    relax
        .view(view)
        .query(keys)
        // .query({include_docs: true})
        .query({limit: 100})
        .end(function(err, res) {
            if (err) return cb(err, null);
            var rows = JSON.parse(res.text.trim()).rows;
            // log('ROWS', rows);
            // var docs = _.map(rows, function(row) {
                // var doc = row.doc;
                // return doc;
            // });
            // в Гите значения dicts повторяются с разными переводами, в других словарях нужен будет .doc
            var docs = _.map(rows, function(row) {
                var doc = {stem: row.key, trn: row.value};
                return doc;
            });
            cb(err, docs);
        });
}


// as in flakes/test/gita.js
function correctM(str, next) {
    var clean = str;
    var fin = u.last(str);
    if (!next) next = '';
    if (!next.form) next = ''; // откуда тут объект? д.б. строка только
    var beg = next[0];
    var n = 'म';
    // здесь изображение правила: doubled palatal - var dental = u.palatal2dental(mark.fin);
    if (beg == 'च') n = 'न';
    if (fin == c.anusvara) clean = [u.wolast(str), n, c.virama].join('');
    // три простые правила, как в outer ?
    // else if (fin == 'ो' && inc(c.soft, beg)) clean = [u.wolast(str), c.visarga].join('');
    // else if (fin == 'ो' && inc(c.soft, beg)) log('OOO', str, 'beg', beg, 222) // परयाो
    // else if (fin == 'ा' && (inc(c.allvowels, beg) || inc(c.soft, beg))) clean = [samasa, c.visarga].join('');
    return clean;
}

// ===========================================


/**
 * removes flex, if possible, and fill in queries storage
 * @param {string} shabda
 */
function checkFlex(shabda) {
    var bareword = 'bareword';
    this.queries.push(bareword);
    return;
}

morpheus.prototype.x = function() {
}

morpheus.prototype.x = function(arr,obj) {
}
