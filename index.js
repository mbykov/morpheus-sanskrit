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

var debug = (process.env.debug == 'true') ? true : false;

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
        // здесь нужно добавлять слово с флексией, иначе не найдет в словаре, а в тесте - убирать, иначе не сравнит с chains
        // теперь в словаре нет флексии, ===> но изменение пока не отражено в переводе
        // var odds = outer.odd(terms, opt, clean, next);
        // log('odds', odds);
        // queries = queries.concat(odds);
    }
    // log('QUERIES to get', queries);
    if (debug) log('STEMS-flakes to get', stems.length);

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
    if (debug) log('QSTEMS-all to get', qstems.length);

    getDicts(qstems, function(err, dbdicts) {
    // getDictsSa(qstems, function(err, dbdicts) {
        // log('DBD', err, dbdicts.length);
        // TODO: теперь установить соответствие между chains и dbdicts
        // log('D-flakes', fdicts);
        // выбрать только те flakes, query которых найдены в dicts:
        var dstems = dbdicts.map(function(dict) { return dict.stem});
        var flakes = [];
        queries.forEach(function(q) {
            if (inc(dstems, q.query)) flakes.push(q.flake || q.query);
        });
        flakes =_.uniq(flakes);
        // log('FLAKES', flakes);
        var pdchs = filterChain(chains, flakes);
        //
        // выбрать dicts по реальным flakes, т.е. pdch
        // var fdicts = dict4flake(queries, dbdicts);
        log('========>>>>', pdchs);
        pdchs.dicts = dict4pdch(pdchs.pdchs, dbdicts);
        cb(pdchs);
    });
    // cb('ok');
    return;
}

// м.б. считать syllables, а не length ? чтобы flexes не лезли вперед, а length - наоборот, уменьшить weight ?
// второе - лучше бы наверх - простейшие, т.е. flake=query ?
function filterChain(chains, flakes) {
    // log('C', chains);
    var pdchs = [];
    var holeys = [];
    var bads = [];
    var total = Math.pow(chains[0].join('').length, 2);
    chains.forEach(function(chain) {
        var nonuniq = 0;
        if (chain.length != _.uniq(chain).length) nonuniq +=1;
        var pdch = {chain: chain, weigth: 0};
        var ok = 0;
        flakes.forEach(function(flake) {
            if (inc(chain, flake)) {
                pdch.weigth += Math.pow(flake.length, 2);
                ok += 1;
            }
        });
        ok += nonuniq; // если не uniq, то ok=1, короче
        // log('OK', ok, chain.length)
        // weights - BImArjunasamA - правильный только седьмой. Bi + ima больше, чем Bima, что неверно
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


function dict4pdch(pdchs, dbdicts) {
    // log('Pdchs', pdchs.length)
    // log('Dbdicts', dbdicts.length) // <=== вот тут вот неединственность
    var pdicts = {};
    pdchs.forEach(function(pdch) {
        pdch.chain.forEach(function(pada) {
            dbdicts.forEach(function(dbdict) {
                // log('DBDICT', dbdict)
                if (dbdict.stem != pada) return;
                var dict = {stem: dbdict.stem};
                // dict.flake = flake;
                if (dbdict.lex) dict.lex = dbdict.lex;
                else if (dbdict.vlex) dict.vlex = dbdict.vlex;
                else if (dbdict.trns) dict.lex = dbdict.trns; // FIXME: это в словате BG:, должно уйти в .lex
                if (!pdicts[pada]) pdicts[pada] = [];
                pdicts[pada].push(dict);
            });
        });
    });
    return pdicts;
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
    // relax.dbname('mw');
    // var view = 'mw/byStem';
    relax.dbname('gita-add');
    var view = 'gita-add/byStem';
    // log('morph-03 getDicts - POST', JSON.stringify(keys));
    relax
        .postView(view)
        .send(keys)
        .query({include_docs: true})
        // FIXME: Content-Type отдельно прописан - так нельзя
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
            // if (err) log('ERR morph getDicts', err, res);
            if (err) return cb(err, null);
            var rows = JSON.parse(res.text.trim()).rows;
            var docs =  _.uniq(rows.map(function(row) { return row.doc }));
            // log('DOCS', docs.length)
            cb(err, docs);
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
