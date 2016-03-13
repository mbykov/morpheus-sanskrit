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
    var queries = stems.map(function(stem) { return {stem: stem}});

    if (next) {
        var odds = outer.odd(terms, opt, clean, next);
        // log('odds', odds)
        queries = queries.concat(odds);
        stems = queries.map(function(q) {return q.stem});
    }
    // log('QUERIES to get', queries);
    log('STEMS to get', stems.length);

    // добавляю stems по tin-sup флексиям
    var tinsups = [];
    stems.forEach(function(stem) {
        if (syllables(stem) < 4) return;
        var qs = stemmer.get(stem);
        var qstems = qs.map(function(q) { return q.query});
        tinsups = tinsups.concat(qstems);
    });
    stems = stems.concat(tinsups);
    stems = _.uniq(stems);
    log('STEMS to get', stems.length);


    // getDicts(stems, function(err, dbdicts) {
    getDictsSa(stems, function(err, dbdicts) {
        // log('DBD', err, dbdicts);
        // TODO: теперь установить соответствие между chains и dbdicts
        // в сводном словаре dbdicts - не уникальны
        // var pdchs = filterPadas(chains, queries, dbdicts);
        // log('PDCHS', pdchs);
        cb(dbdicts);
    });
    // cb('ok');
    return;
}

// соответствие dbdict и queries - может быть много dbdicts на один stem
// здесь формируется один dict, имеющий type: MW, Apte, BG, etc
function filterPadas(chains, queries, dbdicts) {
    log('Q', queries)
    log('D', dbdicts) // <=== вот тут вот неединственность
    log('C', chains.length)
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
    return dicts;

    /*
      ой-ой, а в реале-MW dicts-то может быть много на одни stem ? term, BG, MW, Apte ?
      то есть dicts нельзя просто в цикле крутить
     */
    var pdchs = [];
    var holeys = [];
    var total = Math.pow(chains[0].join('').length, 2);
    chains.forEach(function(chain) {
        // var total = chain.map(function(pada) { return pada.length});
        // total =  _.reduce(total, function(memo, num){ return memo + num; });
        var pdch = {chain: chain, weigth: 0};
        var ok = 0;
        dicts.forEach(function(dict) {
            if (inc(chain, dict.pada)) {
                pdch.weigth += Math.pow(dict.pada.length, 2);
                // dict.ok = true; // бессмысленно, ибо всегда найдется
                ok += 1;
            }
        });
        if (pdch.weigth > 0) {
            pdch.weigth = (pdch.weigth/total).toFixed(2);
            if (ok == chain.length) pdchs.push(pdch);
            else holeys.push(pdch)
        }
    });
    // м.б. сразу добавлять в решение dict?
    // var cdicts = _.select(dicts, function(dict) { return dict.ok });
    if (pdchs.length > 0) {
        pdchs = _.sortBy(pdchs, function(pdch) { return pdch.weigth}).reverse();
        return pdchs;
    } else {
        holeys = _.sortBy(holeys, function(pdch) { return pdch.weigth}).reverse();
        holeys = holeys.slice(0, 3);
        return {ok: false, pdchs: holeys};
        // return holeys;
    }
    // log('PDCHS', pdchs);
    // return [];
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
    var view = 'gita-add/byForm';
    // log('morph-03 getDicts - POST', JSON.stringify(keys));
    // FIXME: Content-Type отдельно прописан - так нельзя
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

            var stems =  _.uniq(rows.map(function(row) { return row.key }));
            log('KEYS:', stems);
            var rawdocs = rows.map(function(row) { return row.doc });
            var docs = stems.map(function(stem) {
                var doc = {stem: stem, dict: 'mw', dicts: []};
                rawdocs.forEach(function(raw) {
                    if (raw.sa != stem) return;
                    var dict = {stem: raw.sa, slp: raw.slp, lex: raw.lex};
                    doc.dicts.push(dict);
                });
                return doc;
            });
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
