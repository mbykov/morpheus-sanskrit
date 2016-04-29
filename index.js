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

var dbpath = 'http://admin:kjre4317@localhost:5984';
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
    // log('CLEAN', clean);
    var chains = vigraha.pdchs(clean);
    if (!chains || chains.length == 0) {
        // throw new Error('no chains');
        var res = {queries: [], pdchs: []};
        cb(res);
        return;
    }
    // log('CHAINS size:', chains);
    var ochains = outer.chains(chains);
    // log('oCHAINS:', ochains);
    var totalchains = (ochains) ? chains.concat(ochains) : chains;
    // log('totalchains:', totalchains.length);
    // return;

    var stems = _.uniq(_.flatten(totalchains));
    // var queries = stems.map(function(stem) { return {query: stem, flake: stem}});
    var queries = []; // все plains должны появиться в stemmer ?

    // log('QUERIES to get', queries);
    // log('STEMS-flakes to get', stems, stems.length);
    // return;

    var stem;
    stems.forEach(function(stem) {
        // stem = q.query;
        // if (syllables(stem) < 2) return;
        var qs = stemmer.query(stem);
        // if (stem == 'ऊपस्थे')
        qs.forEach(function(q) { q.flake = stem});
        // log('===========', qs);
        // log('QS', stem, qs);
        queries = queries.concat(qs);
    });

    var qstems = _.uniq(queries.map(function(q) { return q.query}));
    qstems = _.select(qstems, function(qstem) { return qstem.length > 1 || inc(['च', 'न', 'स', 'व', 'ॐ'], qstem)});
    // log('QSTEMS to get', JSON.stringify(qstems));
    // log('QSTEMS-all to get', qstems, qstems.length);
    // return;

    getDicts(qstems, function(err, dbdicts) {
    // getDictsSa(qstems, function(err, dbdicts) {
        // p('DBDicts', err, dbdicts);
        // убрал samasas из dbdicts: - зачем? этого нельзя делать
        // dbdicts = _.select(dbdicts, function(d) { return !d.slps});
        // из-за forms, verbs могут обнаруживаться несколько раз:
        // dbdicts = uniqDict(dbdicts);
        // log('qstems', qstems);
        // log('Dbdicts', dbdicts);
        // return;

        var dbgs = _.select(dbdicts, function(d) { return (d.type == 'BG')});
        // var dmorphs = _.select(dbdicts, function(d) { return (d.type == 'mw' || d.type == 'Apte' || d.type == 'term')});
        var dmorphs = _.select(dbdicts, function(d) { return (d.type == 'mw' || d.type == 'Apte')});
        var dterms = _.select(dbdicts, function(d) { return d.type == 'term'});
        // p('Dbdicts', dbgs);
        // return;

        // а как тут может быть не-единственность? в BG? ее не может быть же?
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
        // p('Qbgs', qbgs);
        // return;
        // var poss = _.select(queries, function(q) { return q.pos == 'plain'})
        // p('Qs', poss);
        // return;

        var qterms = dterms.map(function(d) {
            // log(1, d)
            var qclean = {flake: d.stem, dict: d.dict, term: '', morphs: d.morphs, dicts: [d._id]};
            if (d.pos == 'pron') qclean.pron = true;
            qclean.stem = d.stem; // нужно-ли ?
            return qclean;
        });
        // log('QTERMS', qterms)
        // return;

        var qmorphs = [];
        queries.forEach(function(q) {
            var qclean = {flake: q.flake, dicts: []};
            // if (q.query) qclean.dict = q.query; // FIXME: а q.query всегда есть? И q.term всегда, если .morphs?
            dmorphs.forEach(function(d) {
                var ok = false;
                if (q.la) {
                    // ???? в verb каждой query соотв. всегда только один dict ????
                    if (!d.verb)  return;
                    if (q.query == d.stem || (!d.slps && inc(d.forms, q.query) )) { // !d.slps - to strip samasas
                        // TODO: d.vlexes - выбрать из них только то, что отвечает query? или нужны все?
                        qclean.verb = true;
                        qclean.dict = d.stem;
                        var morph = {la: q.la, pada: q.pada, key: q.key, gana: q.gana};   // ????? и всегда только один morph ????
                        qclean.morph = morph;
                        ok = true;
                        // log('QV', q, d.slp);
                    }
                } else {
                    // путается q.term - окончание и term - тип записи
                    if (q.query != d.stem) return;
                    qclean.term = q.term;
                    // if (q.pos == 'name' && d.name && !d.ind) { // FIXME: это после перезаливки без ind в составных
                    if (q.pos == 'name' && d.name && d.lex) {
                        // log('Q', q, d)
                        qclean.name = true;
                        qclean.dict = d.stem;
                        qclean.morphs = q.morphs;
                        ok = true;
                    } else if (q.pos == 'plain' && d.ind) {
                        // log('=====Q', q.pos, q, d)
                        qclean.ind = true;
                        qclean.term = '';
                        qclean.dict = d.stem;
                        ok = true;
                    } else {
                        // if (d.type == 'BG') log('Q', q, q.pos, d)
                        // if (!d.verb) log('QQ', d)
                    }
                }
                var id = d._id;
                if (ok) qclean.dicts.push(id);
                // if (ok) qclean.dicts.push(d);
            });
            if (qclean.dicts.length > 0) qmorphs.push(qclean);
        });
        // qmorphs = _.select(function(q) { return q.flake == 'नवानि'});
        // log('Qmorphs', qmorphs);
        // return;

        // qcleans это query, к которым есть dicts:
        var qcleans = qbgs.concat(qmorphs).concat(qterms);
        // qcleans = _.select(qcleans, function(q) { return q.flake == 'विहाय'});
        // log('Term+', qcleans);
        // return;

        // flakes - query из qcleans:
        var flakes = qcleans.map(function(q) { return q.flake});
        flakes =_.uniq(flakes);
        // log('FL', flakes);
        // return;
        // log('Chains', chains);
        // return;
        if (!chains[0]) p('NO CHAINS', samasa, flakes);
        var pdch = filterChain(chains, flakes);
        // p('PDCHS', pdch);
        // return;
        var opdch;
        if (ochains) opdch = filterChain(ochains, flakes);
        // p('oPDCHS', opdch);


        var res = {queries: qcleans, pdchs: []};
        // так нельзя: vihAyaH забивает vihAya
        // var max = 0;
        // var omax = 0;
        // if (pdch && pdch.chains) max =  pdch.chains[0].weigth;
        // if (opdch && opdch.chains) omax =  opdch.chains[0].weigth;
        // if (max >= omax) res.pdchs = pdch.chains;
        // else res.pdchs = opdch.chains;

        var tchains = [];
        if (pdch && pdch.chains) tchains =  tchains.concat(pdch.chains);
        if (opdch && opdch.chains) tchains =  tchains.concat(opdch.chains);
        tchains = _.sortBy(tchains, function(tchain) { return tchain.weigth}).reverse();

        if (tchains.length > 0) res.pdchs = tchains;
        else res.holeys = pdch.holeys || [];
        // p(res.pdchs)
        // if (pdch.chains) res.pdchs = pdch.chains;
        // else res.holeys = pdch.holeys;
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
                // if (flake == 'वन्तः') log('VANTAH', flake, pdch, ok);
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
        res.chains = _.sortBy(pdchs, function(pdch) { return pdch.weigth}).reverse();
    } else {
        holeys = _.sortBy(holeys, function(pdch) { return pdch.weigth}).reverse();
        res.holeys = holeys.slice(0, 5); // FIXME: выбрать с одной дырой
    }
    // if (pdchs.length == 0 && holeys.length == 0) {
        // bads = _.sortBy(holeys, function(pdch) { return pdch.weigth}).reverse();
        // res.bads = holeys.slice(0, 25);
    // }
    return {chains: res.chains, holeys: res.holeys} ;
}

function options(samasa, next) {
    var opt = {};
    opt.fin = u.last(samasa);
    opt.penult = u.penult(samasa);
    // opt.beg = u.first(next);
    return opt;
}


// забрать реально существующие padas из BD, POST
// gita-add имеет единственный stem по определению
function getDicts(stems, cb) {
    var keys = {keys: stems};
    relax.dbname('sa');
    var view = 'sa/byStem';
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
            // log('DOCS', docs)
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
        // if (!keys[d._id]) uniqs.push(d);
        if (!keys[d._id]) {
            // log('D===', d._id, keys[d._id]);
            uniqs.push(d);
            keys[d._id] = true;
            // log('D== 2', d._id, keys[d._id]);
        }
    });
    return uniqs;
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
