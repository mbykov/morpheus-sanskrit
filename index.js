// morpheus v.0.3.0

var _ = require('underscore');
var s = require('sandhi');
var c = s.const;
var u = s.u;
var sandhi = s.sandhi;
// var outer = s.outer;
var inc = u.include;
var log = u.log;
var p = u.p;
var rasper = require('flakes');
var outer = require('./lib/outer');

dbpath = 'http://admin:kjre4317@localhost:5984';
var Relax = require('relax-component');
var relax = new Relax(dbpath);
relax.dbname('gita-add');

module.exports = morpheus();

function morpheus() {
    if (!(this instanceof morpheus)) return new morpheus();
    this.queries = [];
}

// main
// должен возвращать полностью сформированный список вариантов с весами-вероятностями
morpheus.prototype.run = function(samasa, next, cb) {
    if (!next) next = 'इ'; // FIXME:
    var opt = options(samasa, next);
    clean = samasa;
    if (opt.fin == c.anusvara) clean = outer.correctM(samasa, opt);
    // log('CLEAN', clean);
    var chains = rasper.cut(clean);
    // p(chains);
    var terms = chains.map(function(chain) { return u.last(chain)});
    terms = _.uniq(_.flatten(terms));
    // log('CHAINS size:', chains.length);
    var stems = _.uniq(_.flatten(chains));
    var queries = stems.map(function(stem) { return {stem: stem}});

    if (next) {
        var odds = outer.odd(terms, opt, clean, next);
        // log('odds', odds)
        queries = queries.concat(odds);
        stems = queries.map(function(q) {return q.stem});
    }
    // log('QUERIES to get', queries);
    // log('STEMS to get', stems);
    getDicts(stems, function(err, dbdicts) {
        // log('DBD', err, dbdicts);
        // TODO: теперь установить соответствие между chains и dbdicts
        var pdchs = filterPadas(chains, queries, dbdicts);
        log('PDCHS', pdchs);
        // в тесты нужно отдать dbdicts, а наверх - pdchs?
        cb(dbdicts);
    });
    // cb('ok');
    return;
}

function filterPadas(chains, queries, dbdicts) {
    // log('Q', queries)
    // log('D', dbdicts)
    // log('C', chains.length)
    var dicts = [];
    dbdicts.forEach(function(dbdict) {
        var dict = {};
        queries.forEach(function(q) {
            if (dbdict.stem != q.stem) return;
                // dict.pada = q.stem;
            if (q.raw) {
                dict.pada = q.raw;
                dict.form = q.stem;
            } else dict.pada = q.stem;
            dict.trn = dbdict.trn;
            dicts.push(dict);
        });
    });
    // log('C', chains)
    // log('D', dicts);
    var pdchs = [];
    chains.forEach(function(chain) {
        var pdch = {chain: chain, weigth: 0};
        dicts.forEach(function(dict) {
            if (inc(chain, dict.pada)) pdch.weigth += Math.pow(dict.pada.length, 2);
        });
        if (pdch.weigth > 0) pdchs.push(pdch);
    });
    pdchs = _.sortBy(pdchs, function(pdch) { return pdch.weigth}).reverse();
    log('PDCHS', pdchs);
    return [];
}

function options(samasa, next) {
    var opt = {};
    opt.fin = u.last(samasa);
    opt.penult = u.penult(samasa);
    opt.beg = u.first(next);
    return opt;
}


// забрать реально существующие padas из BD, POST
function getDicts(stems, cb) {
    var keys = {keys: stems};
    var view = 'gita-add/byForm';
    // log('morph-03 getDicts - SSS-new', keys.length);
    // FIXME: некузяво, keys вручную отдельно посылается через .send
    // и Content-Type отдельно прописан - так нельзя
    // var keys = {keys: ['इहैव']};
    relax
        .postView(view)
        .send(keys)
        // .query({limit: 100})
        // .query({include_docs: true})
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
            // if (err) log('ERR morph getDicts', err, res);
            if (err) return cb(err, null);
            var rows = JSON.parse(res.text.trim()).rows;
            var docs = _.map(rows, function(row) {
                var doc = {stem: row.key, trn: row.value};
                return doc;
            });
            cb(err, docs);
        });
}

function getDicts_(stems, cb) {
    log('STEMS', stems);
    // stems = ['रमते'];
    var keys = ['keys=', JSON.stringify(stems)].join('');
    var view = 'gita-add/byForm';
    var keys = ['keys=', JSON.stringify(['इहैव'])].join('');
    log('morph-03 getDicts - SSS-new', keys);
    relax
        .view(view)
        .query(keys)
    // .query({include_docs: true}) // 'वर्तेतः'
        .query({limit: 100})
        .end(function(err, res) {
            if (err) log('ERR morph getDicts', err, res);
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
