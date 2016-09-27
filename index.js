// morpheus v.0.4.0

var _ = require('underscore');
var s = require('sandhi');
var c = s.const;
var u = s.u;
var sandhi = s.sandhi;
var inc = u.include;
var log = u.log;
var p = u.p;
var vigraha = require('vigraha');
var outer = require('./lib/outer');
var subanta = require('subanta');
var tiNanta = require('tiNanta');
var salita = require('salita-component');

var async = require("async");

var dbpath = 'http://localhost:5984';
var Relax = require('relax-component');
var relax = new Relax(dbpath);
relax.dbname('sa');

var debug = (process.env.debug == 'true') ? true : false;

module.exports = morpheus();

var path = require('path');
var fs = require('fs');

function morpheus() {
    if (!(this instanceof morpheus)) return new morpheus();
    this.queries = [];
}

// здесь - в базе есть отметка uchange на всех отбрасываемых - на terms, etc
function getIndecl(flakes, cb) {
    var keys = {keys: flakes};
    var view = 'sa/byIndecl';
    relax
        .postView(view)
        .send(keys)
        .query({include_docs: true})
        .end(function(err, res) {
            if (err) return cb(err, null);
            let rows = JSON.parse(res.text.trim()).rows;
            let adocs =  rows.map(function(row) { return row.doc; });
            let astems = _.uniq(adocs.map(function(a) { return a.query;}));
            let indecls = _.select(adocs, function(doc) { return doc.type != 'BG'; });
            let istems = _.uniq(indecls.map(function(a) { return a.query;}));
            this.istems = istems;
            let aqueries = [];
            astems.forEach(function(astem) {
                // let adoc = _.find(adocs, function(doc) { return doc.query == astem; });
                let idocs = _.select(adocs, function(doc) { return doc.query == astem; });
                idocs.forEach(function(adoc) {
                    if (adoc.ind) {
                        let aquery = {ind: true, type: adoc.type, query: adoc.query, slp: adoc.slp, dicts: [adoc._id]};
                        aqueries.push(aquery);
                    }
                    if (adoc.type == 'BG') {
                        let aquery = {ind: true, type: adoc.type, query: adoc.query, slp: adoc.slp, dicts: [adoc._id]};
                        aqueries.push(aquery);
                    }
                    if (adoc.type == 'term') {
                        let aquery = {ind: true, type: adoc.type, query: adoc.query, pos: adoc.pos, var: adoc.var, dict: adoc.dict, gend: adoc.gend, sups: adoc.sups, dicts: [adoc._id]};
                        aqueries.push(aquery);
                    }
                });
            });
            cb(err, aqueries);
        });
}

function getChangeable(cleans, flakes, cb) {
    let chstems = _.difference(flakes, this.istems);
    let queries = []; // все plains должны появиться в stemmer ?

    chstems.forEach(function(flake) {
        let qs = subanta.query(flake);
        qs.forEach(function(q) {
            q.flake = flake;
        });
        queries = queries.concat(qs);
    });

    tiNanta.query(chstems, function(err, tqueries) {
        let qskeys = _.uniq(queries.map(function(q) {return q.pada;}));
        let qtkeys = _.uniq(tqueries.map(function(q) {return q.dhatu;}));
        let qkeys = _.compact(qskeys.concat(qtkeys));
        qkeys = _.uniq(qkeys);
        let totqs = queries.concat(tqueries);
        getBD(qkeys, function(err, dbdicts) {
            let namas = _.select(dbdicts, function(d) { return d.name; });
            let verbs = _.select(dbdicts, function(d) { return d.verb; });
            let ndicts = namas.map(function(d) { return d.query; });
            let vdicts = verbs.map(function(d) { return d.query; });
            let scleans = _.select(queries, function(q) { return inc(ndicts, q.pada); });
            let tcleans = _.select(tqueries, function(q) { return inc(vdicts, q.dhatu); });
            let res = {squeries: scleans, tqueries: tcleans, namas: namas, verbs: verbs};
            cb(null, res);
        });
    });
}

morpheus.prototype.run = function(samasa, next, cb) {
    let cleans = outer.correct(samasa, next);

    if (cleans.length == 0) {
        throw new Error('no cleans');
        let res = {queries: [], pdchs: []};
        cb(res);
        return;
    }

    let chains;
    let totalchains = [];
    cleans.forEach(function(clean) {
        chains = vigraha.pdchs(clean);
        totalchains = totalchains.concat(chains);
    });

    if (totalchains.length == 0) totalchains = [cleans];

    var flakes = _.uniq(_.flatten(totalchains));

    async.series([
        function(cb) {
            getIndecl(flakes, cb);
        },
        function(cb) {
            getChangeable(cleans, flakes, cb);
        },
    ], function (err, results) {

        if (!results[1]) {
            log('NO RES 1 - samasa:', samasa);
            throw new Error('no res 1');
            let res = {queries: [], pdchs: []};
            cb(res);
            return;
        }

        let amorphs = results[0];
        let squeries = results[1].squeries;
        let tqueries = results[1].tqueries;
        let namas = results[1].namas;
        let verbs = results[1].verbs;

        let smorphs = mapDict2query(results[1].squeries, namas);
        let tmorphs = mapDict2query(results[1].tqueries, verbs);

        let aflakes = _.uniq(results[0].map(function(q) { return q.query; }));
        let sflakes = _.uniq(smorphs.map(function(q) { return q.flake; }));
        let tflakes = _.uniq(tmorphs.map(function(q) { return q.flake; }));
        let totalflakes = _.uniq(aflakes.concat(sflakes).concat(tflakes));
        let pdchs = filterChain(totalchains, totalflakes);

        let qcleans = amorphs.concat(smorphs).concat(tmorphs);

        let result = {queries: qcleans, pdchs: pdchs};
        cb(result);
    });
}

function mapDict2query(queries, dicts) {
    let qmorphs = [];
    queries.forEach(function(cq) {
        let q = JSON.parse(JSON.stringify(cq));
        q.dicts = [];
        dicts.forEach(function(d) {
            if (q.verb && d.verb) {
                if (q.dhatu == d.query) { // !d.slps - to strip samasas
                    q.dicts.push(d._id);
                }
            } else {
                if (q.name && d.name && q.pada == d.query && q.var == d.var) {
                    if (d.gend == 'mfn') q.dicts.push(d._id);
                    else if (d.gend == q.gend[0]) q.dicts.push(d._id);
                }
                // else if (q.plain && d.name && q.pada == d.query && q.var == d.var) {
                else if (q.plain && d.name && q.pada == d.query) {
                    let alreadies = _.select(qmorphs, function(already) { return already.pada == q.pada; });
                    if (alreadies.length > 0) return;
                    q.dicts.push(d._id);
                }
            }
        });
        if (q.dicts.length > 0) qmorphs.push(q);
    });
    return qmorphs;
}


function filterChain(chains, flakes) {
    var pdchs = [];
    var base = Math.pow(chains[0].join('').length, 2);

    chains.forEach(function(chain) {
        let pdch = {chain: chain, weight: 1, ok: 1};
        chain.forEach(function(flake) {
            if (inc(flakes, flake)) {
                pdch.weight += Math.pow(flake.length, 3);
            } else {
                let size = flake.length;
                let fake = Array(size).join('x');
                let index = chain.indexOf(flake);
                chain[index] = fake;
                pdch.ok = 0;
            }
        });
        let cbase = base * chain.length;
        pdch.weight = (pdch.weight/cbase).toFixed(2);
        pdchs.push(pdch);
    });

    if (pdchs.length == 0) return [];
    let cleans = _.sortBy(pdchs, function(pdch) { return pdch.weight; }).reverse();
    cleans = cleans.slice(0, 15);
    let qpdchs = _.select(cleans, function(pdch) { return pdch.ok; });
    let qchains = qpdchs.map(function(pdch) { return pdch.chain; });
    if (qchains.length > 0) return qchains;
    return [];

}

// function options(samasa, next) {
//     var opt = {};
//     opt.fin = u.last(samasa);
//     opt.penult = u.penult(samasa);
//     return opt;
// }


function getBD(qkeys, cb) {
    var keys = {keys: qkeys};
    relax.dbname('sa');
    var view = 'sa/byStem';
    relax
        .postView(view)
        .send(keys)
        .query({include_docs: true})
        .end(function(err, res) {
            if (err) return cb(err, null);
            var rows = JSON.parse(res.text.trim()).rows;
            var docs =  rows.map(function(row) { return row.doc; });
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
