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
var stemmer = require('../stemmer');

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
    var queries = stems.map(function(stem) { return {query: stem}});

    if (next) {
        var odds = outer.odd(terms, opt, clean, next);
        // log('odds', odds);
        queries = queries.concat(odds);
    }
    // log('QUERIES to get', queries);
    log('STEMS-flakes to get', stems.length);

    // добавляю stems по tin-sup флексиям
    var stem;
    queries.forEach(function(q) {
        stem = q.query;
        if (syllables(stem) < 2) return;
        var qs = stemmer.get(stem);
        // if (stem == 'ऊपस्थे') log('===========', qs);
        qs.forEach(function(q) { q.flake = stem});
        // log('QS', stem, qs);
        queries = queries.concat(qs);
    });
    var qstems = _.uniq(queries.map(function(q) { return q.query}));
    // log('QSTEMS to get', JSON.stringify(qstems));
    log('QSTEMS-all to get', qstems.length);

    getDicts(qstems, function(err, dbdicts) {
    // getDictsSa(qstems, function(err, dbdicts) {
        // log('DBD', err, dbdicts.length);
        // TODO: теперь установить соответствие между chains и dbdicts
        // var fdicts = dict4flake(queries, dbdicts);
        // log('D-flakes', fdicts);
        // выбрать только те flakes, query которых найдены в dicts:
        var dstems = dbdicts.map(function(dict) { return dict.sa});
        var flakes = [];
        queries.forEach(function(q) {
            if (inc(dstems, q.query)) flakes.push(q.flake || q.query);
        });
        flakes =_.uniq(flakes);

        // var flakes = _.uniq(queries.map(function(q) { return q.flake || q.query}));
        // log('FLAKES-Q', inc(qstems, 'अर्जुन'));
        // log('FLAKES-D', inc(dstems, 'अर्जुन'));
        // log('FLAKES-F', inc(dstems, 'अर्जुन'));
        log('FLAKES', flakes);
        var pdchs = filterChain(chains, flakes);
        //
        // log('PDCHS', pdchs);
        // cb(dbdicts);
        cb(pdchs);
    });
    // cb('ok');
    return;
}

// м.б. считать syllables, а не length ? чтобы flexes не лезли вперед, а length - наоборот, уменьшить weight ?
// второе - лучше бы наверх - простейшие, т.е. flake=query ?
function filterChain(chains, flakes) {
    // log('C', chains)
    var pdchs = [];
    var holeys = [];
    var bads = [];
    var total = Math.pow(chains[0].join('').length, 2);
    chains.forEach(function(chain) {
        var pdch = {chain: chain, weigth: 0};
        var ok = 0;
        flakes.forEach(function(flake) {
            if (inc(chain, flake)) {
                pdch.weigth += Math.pow(flake.length, 2);
                ok += 1;
            }
        });
        if (pdch.weigth > 0) {
            pdch.weigth = (pdch.weigth/total).toFixed(2);
            if (ok == chain.length) pdchs.push(pdch);
            else if (ok -1 == chain.length) holeys.push(pdch);
            else holeys.push(pdch);
        }
    });
    var res = {};
    if (pdchs.length > 0) {
        res.pdchs = _.sortBy(pdchs, function(pdch) { return pdch.weigth}).reverse();
    } else {
        holeys = _.sortBy(holeys, function(pdch) { return pdch.weigth}).reverse();
        res.holeys = holeys.slice(0, 25);
    }
    // if (pdchs.length == 0 && holeys.length == 0) {
        // bads = _.sortBy(holeys, function(pdch) { return pdch.weigth}).reverse();
        // res.bads = holeys.slice(0, 25);
    // }
    return res;
}


// соответствие dbdict и queries - может быть много dbdicts на один query
// здесь каждому flake ставится в соответствие набор dicts, на будущее - нужно в интерфейсе, при выводе dicts для flakes
// нормально, но я здесь обрабатываю ВСЕ flakes, включая ненужные
// и здесь я тащу словари за собой в фильтр chains, so . . . переделать на только нужные
function dict4flake(queries, dbdicts) {
    log('Queries', queries.length)
    log('Dbdicts', dbdicts.length) // <=== вот тут вот неединственность
    var fdicts = {};
    queries.forEach(function(q) {
        dbdicts.forEach(function(dbdict) {
            // log('DBDICT', dbdict)
            var flake = q.flake || q.query; // простейшие, из chain, не имеют .flake
            if (dbdict.sa != q.query) return;
            var dict = {};
            // dict.flake = flake;
            if (dbdict.lex) dict.lex = dbdict.lex;
            if (dbdict.vlex) dict.vlex = dbdict.vlex;
            if (!fdicts[flake]) fdicts[flake] = [];
            fdicts[flake].push(dict);
        });
    });
    return fdicts;
}

function options(samasa, next) {
    var opt = {};
    opt.fin = u.last(samasa);
    opt.penult = u.penult(samasa);
    opt.beg = u.first(next);
    return opt;
}


// забрать реально существующие padas из BD, POST
// gita-add имеет единственный stem по определению
function getDicts(stems, cb) {
    var keys = {keys: stems};
    // var view = 'gita-add/byForm';
    relax.dbname('mw');
    var view = 'mw/byStem';
    // log('morph-03 getDicts - POST', JSON.stringify(keys));
    // FIXME: Content-Type отдельно прописан - так нельзя
    // var keys = {keys: ['इहैव']};
    relax
        .postView(view)
        .send(keys)
        // .query({limit: 100})
        .query({include_docs: true})
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
            // if (err) log('ERR morph getDicts', err, res);
            if (err) return cb(err, null);
            var rows = JSON.parse(res.text.trim()).rows;
            var docs =  _.uniq(rows.map(function(row) { return row.doc }));
            // gita-add:
            // var docs = _.map(rows, function(row) {
            //     var doc = {stem: row.key, trn: row.value};
            //     return doc;
            // });
            cb(err, docs);
        });
}

function getDictsSa(stems, cb) {
    // log('STEMS', stems);
    // stems = ['रमते'];
    // relax.dbname('sa');
    // var view = 'sa/sa';
    relax.dbname('mw');
    var view = 'mw/byStem';
    var keys = ['keys=', JSON.stringify(stems)].join('');
    // var keys = ['keys=', JSON.stringify(['इहैव'])].join('');
    log('morph-03 getDicts ===== MW-new');
    relax
        .view(view)
        .query(keys)
        .query({include_docs: true})
        .query({limit: 100})
        .end(function(err, res) {
            // log('RES morph getDicts', res);
            // log('ERR morph getDicts', err);
            if (err) return cb(err, null);
            var rows = JSON.parse(res.text.trim()).rows;
            // var stems =  _.uniq(rows.map(function(row) { return row.key }));
            var docs =  _.uniq(rows.map(function(row) { return row.doc }));
            cb(err, docs);
            return;

            // дальше пока лишнее, сначала лучше выбрать только значимые stems;
            // попытка здесь же сформировать правильные docs, как в ответе:
            // var stems =  _.uniq(rows.map(function(row) { return row.key }));
            // log('KEYS:', stems);
            // var rawdocs = rows.map(function(row) { return row.doc });
            // var docs = stems.map(function(stem) {
            //     var doc = {stem: stem, dict: 'mw', dicts: []};
            //     rawdocs.forEach(function(raw) {
            //         if (raw.sa != stem) return;
            //         var dict = {stem: raw.sa, slp: raw.slp, lex: raw.lex};
            //         doc.dicts.push(dict);
            //     });
            //     return doc;
            // });
            // cb(err, docs);
        });
}


function syllables(flake) {
    var syms = flake.split('');
    var beg = syms[0];
    var vows = (u.isVowel(beg)) ? 1 : 0;
    syms.forEach(function(s) {
        if (u.isConsonant(s)) vows+=1;
        else if (s == c.virama) vows-=1;
    });
    return vows;
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
