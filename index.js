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
var vigraha = require('vigraha');
var outer = require('./lib/outer');
var stemmer = require('sa-stemmer');

// var dbpath = 'http://admin:kjre4317@localhost:5984';
var dbpath = 'http://localhost:5984';
var Relax = require('relax-component');
var relax = new Relax(dbpath);

var debug = (process.env.debug == 'true') ? true : false;

module.exports = morpheus();

function morpheus() {
    if (!(this instanceof morpheus)) return new morpheus();
    this.queries = [];
}

// main
// должен возвращать полностью сформированный список вариантов с весами-вероятностями
morpheus.prototype.run = function(samasa, next, cb) {
    // log('======MORPHEUS========', samasa, 'next', next);
    // there is no next-a in v-0.3:
    var opt = options(samasa, next);
    clean = samasa;
    if (opt.fin == c.anusvara) clean = outer.correctM(samasa, opt);
    var chains = vigraha.pdchs(clean);
    if (!chains || chains.length == 0) {
        // throw new Error('no chains');
        var res = {queries: [], pdchs: []};
        cb(res);
        return;
    }

    var ochains = outer.chains(chains);

    var totalchains = (ochains) ? chains.concat(ochains) : chains;

    var stems = _.uniq(_.flatten(totalchains));
    var queries = []; // все plains должны появиться в stemmer ?

    var stem;
    stems.forEach(function(stem) {
        // if (syllables(stem) < 2) return;
        var qs = stemmer.query(stem);
        qs.forEach(function(q) { q.flake = stem});
        queries = queries.concat(qs);
    });

    var qstems = _.uniq(queries.map(function(q) { return q.query}));
    qstems = _.select(qstems, function(qstem) { return qstem.length > 1 || inc(['च', 'न', 'स', 'व', 'ॐ'], qstem)});

    getDicts(qstems, function(err, dbdicts) {

        var dbgs = _.select(dbdicts, function(d) { return (d.type == 'BG')});
        var dmorphs = _.select(dbdicts, function(d) { return (d.type == 'mw' || d.type == 'Apte')});
        var dterms = _.select(dbdicts, function(d) { return d.type == 'term'});

        var qbgs = [];
        var keys = {};
        queries.forEach(function(q) {
            // FIXME: здесь должна быть и query тоже
            dbgs.forEach(function(d) {
                if (d.pdchs) return; // это расшифровка pdchs из словаря BG, цель, то, что нужно найти. Здесь оно д.б. пропущено
                if (q.flake != d.stem) return;
                if (keys[q.flake]) return;
                var qclean = {flake: q.flake, dicts: [d._id]};
                qbgs.push(qclean)
                keys[q.flake] = true;
            });
        });

        var qterms = dterms.map(function(d) {
            var qclean = {flake: d.stem, dict: d.dict, term: '', morphs: d.morphs, dicts: [d._id]};
            if (d.pos == 'pron') qclean.pron = true;
            qclean.stem = d.stem; // нужно-ли ?
            return qclean;
        });

        var qmorphs = [];
        queries.forEach(function(q) {
            var qclean = {flake: q.flake, dicts: []};
            dmorphs.forEach(function(d) {
                var ok = false;
                if (q.la) {
                    if (!d.verb)  return;
                    if (q.query == d.stem || (!d.slps && inc(d.forms, q.query) )) { // !d.slps - to strip samasas
                        qclean.verb = true;
                        qclean.dict = d.stem;
                        var morph = {la: q.la, pada: q.pada, key: q.key, gana: q.gana};   // ????? и всегда только один morph ????
                        qclean.morph = morph;
                        ok = true;
                    }
                } else {
                    // путается q.term - окончание и term - тип записи
                    if (q.query != d.stem) return;
                    qclean.term = q.term;
                    if (q.pos == 'name' && d.name && d.lex) {
                        qclean.name = true;
                        qclean.dict = d.stem;
                        qclean.morphs = q.morphs;
                        ok = true;
                    } else if (q.pos == 'plain' && d.ind) {
                        qclean.ind = true;
                        qclean.term = '';
                        qclean.dict = d.stem;
                        ok = true;
                    } else {
                        // if (!d.verb) log('QQ', d)
                    }
                }
                var id = d._id;
                if (ok) qclean.dicts.push(id);
            });
            if (qclean.dicts.length > 0) qmorphs.push(qclean);
        });

        var qcleans = qbgs.concat(qmorphs).concat(qterms);

        // flakes - query из qcleans:
        var flakes = qcleans.map(function(q) { return q.flake});
        flakes =_.uniq(flakes);
        if (!chains[0]) p('NO CHAINS', samasa, flakes);
        var pdch = filterChain(chains, flakes);
        var opdch;
        if (ochains) opdch = filterChain(ochains, flakes);


        var res = {queries: qcleans, pdchs: []};

        var tchains = [];
        if (pdch && pdch.chains) tchains =  tchains.concat(pdch.chains);
        if (opdch && opdch.chains) tchains =  tchains.concat(opdch.chains);
        tchains = _.sortBy(tchains, function(tchain) { return tchain.weigth}).reverse();

        if (tchains.length > 0) res.pdchs = tchains;
        else res.holeys = pdch.holeys || [];
        cb(res);
        // cb([]);
    });
    return;
}

// м.б. считать syllables, а не length ? чтобы flexes не лезли вперед, а length - наоборот, уменьшить weight ?
// второе - лучше бы наверх - простейшие, т.е. flake=query ?
function filterChain(chains, flakes) {
    // log('C', chains);
    var pdchs = [];
    var holeys = [];
    var bads = [];
    // здесь возникает ошибка, нет chains[0]
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
        if (pdch.weigth > 0) {
            pdch.weigth = (pdch.weigth/total).toFixed(2);
            if (ok == chain.length) pdchs.push(pdch);
            else if (ok -1 == chain.length) holeys.push(pdch);
            else holeys.push(pdch);
        }
    });
    var res = {};
    if (pdchs.length > 0) {
        res.chains = _.sortBy(pdchs, function(pdch) { return pdch.weigth}).reverse();
    } else {
        holeys = _.sortBy(holeys, function(pdch) { return pdch.weigth}).reverse();
        res.holeys = holeys.slice(0, 5); // FIXME: выбрать с одной дырой
    }
    return {chains: res.chains, holeys: res.holeys} ;
}

function options(samasa, next) {
    var opt = {};
    opt.fin = u.last(samasa);
    opt.penult = u.penult(samasa);
    return opt;
}


// забрать реально существующие padas из BD, POST
// gita-add имеет единственный stem по определению
function getDicts(stems, cb) {
    var keys = {keys: stems};
    relax.dbname('sa');
    var view = 'sa/byStem';
    relax
        .postView(view)
        .send(keys)
        .query({include_docs: true})
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
            if (err) return cb(err, null);
            var rows = JSON.parse(res.text.trim()).rows;
            var docs =  _.uniq(rows.map(function(row) { return row.doc }));
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

function uniqDict(dicts) {
    var keys = {};
    var uniqs = [];
    dicts.forEach(function(d) {
        if (!keys[d._id]) {
            uniqs.push(d);
            keys[d._id] = true;
        }
    });
    return uniqs;
}
