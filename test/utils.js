// deprecated!  now laghu returns only queries for asking in DB, so . . .


var _ = require('underscore');
var morph = require('../../morpheus03');
// var Morph = require('../stemmer');
// var stemmer = require('../stemmer');
//var ganas = require('../gana');
var slp = require('salita-component');
var debug = (process.env.debug == 'true') ? true : false;

// log('MMMM', morph);

var keys = ['sg.3', 'sg.2', 'sg.1', 'du.3', 'du.2', 'du.1', 'pl.3', 'pl.2', 'pl.1'];
var numkeys = ['nom', 'voc', 'acc', 'ins', 'dat', 'abl', 'gen', 'loc'];
var conum = {
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
    'ten': 10,
    'redup': 99,
}

module.exports = utils();

function utils(str) {
    if (!(this instanceof utils)) return new utils(str);
    return this;
}


utils.prototype.title = function(desc) {
    var title;
    if (desc.gend) {
        title = ['noun', desc.gend, desc.var, ''].join('_');
    }
    return title;
}

utils.prototype.firePPP_list = function(tests, desc) {
    for (var dhatu in tests) {
        if (dhatu == '') continue;
        var obj = tests[dhatu];
        //log('D', obj);
        var dhatuName = [desc, dhatu].join('_');

        describe(dhatuName, function() {
            var forms = obj.masc.split('-').concat(obj.fem.split('-')); // form, not stem
            _.each(forms, function(form) {
                if (form == '') return;
                var translit = slp.sa2slp(form);
                var formName = [dhatuName, translit].join('_');
                //log('D', dhatu);
                var key = dhatu;
                it(formName, function(done) {
                    var morph = new Morph;
                    morph.query(form, function(res) {
                        var parts = _.filter(res[1], function(doc) { return (doc.ppp)});
                        var keys = _.map(parts, function(doc) {
                            return _.map(doc.queries, function(q) {
                                var translit = slp.sa2slp(doc.stem);
                                return translit;
                            });
                        });
                        keys = _.uniq(_.flatten(keys));
                        if (debug) log('t-keys', keys, 't-key', key);
                        isIN(keys, key).should.equal(true);
                        //true.should.equal(true);
                        done();
                    });
                });
            });
        });
    }
}


utils.prototype.zeroFlex = function(tests, desc) {
    for (var dhatu in tests) {
        if (dhatu == '') continue;
        var obj = tests[dhatu];
        //log('D', obj);
        var dhatuName = [desc, dhatu].join('_');
        describe(dhatuName, function() {
            var forms = obj.stem.split('-'); // pres. здесь не не пригодится?
            _.each(forms, function(form) {
                var translit = slp.sa2slp(form);
                var formName = [dhatuName, translit].join('_');
                //log('D', dhatu);
                var key = dhatu;
                it(formName, function(done) {
                    var morph = new Morph;
                    morph.query(form, function(res) {
                        // var parts = _.filter(res[1], function(doc) { return (doc.part)});
                        var keys = _.map(res[1], function(doc) {
                            return _.map(doc.queries, function(q) {
                                var translit = slp.sa2slp(doc.stem);
                                return translit;
                            });
                        });
                        keys = _.uniq(_.flatten(keys));
                        if (debug) log('t-keys', keys, 't-key', key);
                        isIN(keys, key).should.equal(true);
                        //true.should.equal(true);
                        done();
                    });
                });
            });
        });
    }
}

// tests/ganas/test-verbs.js
utils.prototype.fireVerbs = function(tests, desc) {
    //tests = tests.slice(0, 500);
    var terms = ['कृ'];
    //log(tests.length);
    _.each(tests, function(test, idx) {
        if (isIN(terms, test.dhatu)) return;
        //if (idx > 0) return;
        // блин, если pada только A, то нужно прибавить -te, поскольку в g.1 -te попросту нет
        if (!test.stem) return;
        var stem = test.stem;
        //var stem = [test.stem, 'ति'].join('');
        //log(test);
        var tstem = slp.sa2slp(stem);
        var tdhatu = slp.sa2slp(test.dhatu);
        var tname = [tdhatu, tstem].join('-');
        it(tname, function(done) {
            var morph = new Morph;
            morph.query(stem, function(res) {
                var keys = _.map(res[1], function(doc) {
                    return _.map(doc.queries, function(q) {
                        var translit = slp.sa2slp(doc.stem);
                        return translit;
                    });
                });
                keys = _.uniq(_.flatten(keys));
                //log(keys)
                // if (debug) log('t-keys', keys, 't-key', key);
                isIN(keys, tdhatu).should.equal(true);
                //true.should.equal(true);
                done();
            });
        });
    });
}

// тут я могу тестировать pres также.
utils.prototype.fireFutOrd = function(tests, desc) {
    //log('F', desc, tests);
    for (var dhatu in tests) {
        if (dhatu == '') continue;
        var obj = tests[dhatu];
        if (obj.par == '') continue;
        //log('D', obj);
        var dhatuName = [desc, dhatu].join('_');
        describe(dhatuName, function() {
            var forms = obj.pres.split('-'); // pres, par, atm
            // тут еще и atm потом
            _.each(forms, function(form) {
                var translit = slp.sa2slp(form);
                var formName = [dhatuName, translit].join('_');
                //log('D', dhatu);
                var key = dhatu;
                it(formName, function(done) {
                    var morph = new Morph;
                    morph.query(form, function(res) {
                        // var parts = _.filter(res[1], function(doc) { return (doc.part)});
                        var keys = _.map(res[1], function(doc) {
                            return _.map(doc.queries, function(q) {
                                var translit = slp.sa2slp(doc.stem);
                                return translit;
                            });
                        });
                        keys = _.uniq(_.flatten(keys));
                        if (debug) log('t-keys', keys, 't-key', key);
                        isIN(keys, key).should.equal(true);
                        //true.should.equal(true);
                        done();
                    });
                });
            });
        });
    }
}


//     ['ak', 'अक्', 'अकितः']
utils.prototype.kritKta = function(tests, desc) {
    _.each(tests, function(test) {
        var dhatuTR = test[0];
        if (dhatu == '') return;
        var dhatu = test[1]
        var forms2 = test[2];
        if (!forms2) return;
        //log('T', dhatuTR, dhatu, forms2);
        var forms = forms2.split(/[-\/]/);
        var kri_name = ['krit', desc, dhatuTR, dhatu].join('_');
        describe(kri_name, function() {
            forms.forEach(function(form) {
                if (form == '') return;
                //form = [form, 'ः'].join(''); // only sg.nom
                var translit = slp.sa2slp(form);
                var key_name = [kri_name, translit, form].join('_');
                //var key = slp.slp2sa(dhatu);
                it(key_name, function(done) {
                    //log('FORM', dhatuTR, form, translit);
                    //done();
                    testKri(dhatu, form, done);
                });
            });
        });
    });
}

// test/node/kridanta.js
//  dhatu: tric, tavyat, yak, shanu, nvul, nyat, kta, ktavatu, aniyar,
utils.prototype.kri9suff = function(tests, desc) {
    for (var dhatu in tests) {
        if (dhatu == '') continue;
        var test = tests[dhatu];
        for (var kri in test) {
            var kri_name = [desc, dhatu].join('_');
            describe(kri_name, function() {
                var forms = test[kri].split(/[-\/]/);
                forms.forEach(function(form) {
                    if (form == '') return;
                    form = [form, 'ः'].join(''); // only sg.nom
                    var translit = slp.sa2slp(form);
                    var key_name = [desc, kri, dhatu, translit, form].join('_');
                    var key = slp.slp2sa(dhatu);
                    it(key_name, function(done) {
                        //done();
                        //log('FORM', key, form, translit);
                        testKri(key, form, done);
                    });
                });
            });
        }
    }
}

function testKri(dhatu, form, done) {
    var morph = new Morph;
    morph.query(form, function(res) {
        var keys = _.map(res[1].kridanta, function(doc) { return doc.stem});
        keys = _.uniq(keys);
        if (debug) log('t-keys', keys, 'key', dhatu);
        isIN(keys, dhatu).should.equal(true);
        done();
    });
}

// http://sansarit.jnu.ac.in/elearning/derivative.html - tavyat, aniyar
// test - dhatu, translate,  kridanta, translate-kri, masc, fem, neut (sg.noms)
utils.prototype.kridantaArray = function(tests, desc) {
    _.each(tests, function(test) {
        var dhatuTR = slp.sa2slp(test[0]);
        var transl = test[1];
        var test_name = ['krit', desc, dhatuTR].join('_');
        var gends = {masc: test[4], fem: test[5], neut: test[6] };
        for (var gend in gends) {
            describe(test_name, function() {
                var form2 = gends[gend];
                var forms = form2.split('-');
                _.each(forms, function(form) {
                    var transForm = slp.sa2slp(form);
                    var dhatu = test[0];
                    var key_name = [test_name, gend, dhatu, form, transForm].join('_');
                    //var key = dhatu;
                    var g = gend;
                    it(key_name, function(done) {
                        //log('FORM', dhatu, form, transForm, g);
                        testKri(dhatu, form, done);
                    });
                });
            });
        }
    });
}

// sansarit.uohyd.ernet.in/scl/sat_gen/kqw/kqw_gen.html - right column
//['अद्', 'eat', 'अत्तुम्', 'आदम्', 'जग्ध्वा'],
utils.prototype.kridantaAvyaya = function(tests, desc) {
    _.each(tests, function(test) {
        var trdhatu = slp.sa2slp(test[0]);
        var transl = test[1];
        var test_name = [desc, trdhatu].join('_');
        var avyayas = {tumun: test[2], nmul: test[3], ktvac: test[4] };
        for (var avyaya in avyayas) {
            describe(test_name, function() {
                var form2 = avyayas[avyaya];
                if (form2 == '') return;
                var forms = form2.split(/\//);
                _.each(forms, function(form) {
                    var transForm = slp.sa2slp(form);
                    var key_name = [desc, avyaya, trdhatu, transForm, test[0], form].join('_');
                    var dhatu = test[0];
                    it(key_name, function(done) {
                        testAvyaya(dhatu, form, done);
                    });
                });
            });
        }
    });
}

function testAvyaya(dhatu, form, done) {
    var morph = new Morph;
    morph.query(form, function(res) {
        var krits = res[1].kridanta;
        var dhatus = _.map(krits, function(doc) { return doc.stem });
        if (debug) log('test: avyaya', 'dhatus', dhatus, 'dhatu', dhatu);
        isIN(dhatus, dhatu).should.equal(true);
        done();
    });
}

utils.prototype.fireNoun = function(tests, desc, krit) {
    var gend = desc.gend;
    var vari = desc.var;
    for (var noun in tests) {
        if (noun == '') continue;
        var sa_noun = slp.slp2sa(noun);
        var test = tests[noun];
        for (var num in test) {
            var num_name = [gend, noun, num, sa_noun].join('_');
            describe(num_name, function(){
                test[num].forEach(function(form2, idx) {
                    var forms = form2.split('-');
                    forms.forEach(function(form) {
                        if (form == '') return;
                        var translit = slp.sa2slp(form);
                        var kase = numkeys[idx];
                        var numkase = [num, kase].join('.');
                        var kase_name = [gend, noun, numkase, translit, form].join('_');
                        var key = [num, kase].join('.');
                        var n = noun;
                        it(kase_name, function(done) {
                            // now laghu returns only queries for asking in DB, so . . .
                            true.should.equal(true);
                            // if (krit) {
                            //     kritMorph(form, key, done);
                            // } else {
                                nounMorph(form, n, key, gend, done);
                            // }
                            done();
                        });
                    });
                });
            });
        }
    }
}

function nounMorph(form, noun, key, gend, done) {
    if (debug) log('=TEST=', form, key);
    // log('=TEST=', form, key);
    var morph = new Morph;
    morph.query(form, function(res) {
        var noms = res[1].nama;
        var morenoms = res[1].nama_more || [];
        noms = noms.concat(morenoms);
        var keys = _.map(noms, function(doc) { return doc.morph[gend] });
        keys = _.uniq(_.flatten(keys));
        var nouns = _.map(noms, function(doc) { return doc.slp });
        nouns = _.uniq(_.flatten(nouns));
        if (debug) log('test: nouns', nouns, 'noun', noun, 'keys', keys, 'key', key);
        isIN(nouns, noun).should.equal(true);
        isIN(keys, key).should.equal(true);
        done();
    });
}

function kritMorph(form, key, done) {
    if (debug) log('=TEST=', form, key);
    var morph = new Morph;
    morph.query(form, function(res) {
        // var krits = _.filter(res[1], function(res) { return (res.dhatu )});
        var krits = res[1].kridanta;
        if (krits.length == 0) {
            false.should.equal(true);
            done();
        }
        log('=== KEY', key, krits.length)
        // TODO: можно добавить в проверку значение суффикса: -tr, etc
        var keys = _.map(krits, function(doc) {
            return _.map(doc.queries, function(query) {
                var translit = slp.sa2slp(doc.stem);
                var key = [translit, query.var, query.key].join('.'); // FIXME: fem->f.
                return key;
            });
        });
        keys = _.uniq(_.flatten(keys));
        if (debug) log('t-keys-krit', keys, 'key', key);
        isIN(keys, key).should.equal(true);
        done();
    });
}

utils.prototype.fireTest = function(tests, conj) {
    for (var verb in tests) {
        var test = tests[verb];
        for (var lakara in test) {
            var la_name = [conj, lakara, verb].join('_');
            var prdgm = test[lakara];
            describe(la_name, function(){
                paradigm(lakara, verb, prdgm, conj);
            });
        }
    }
}

function paradigm(lakara, verb, prdgm, conj) {
    _.each(prdgm, function(kases, idx) {
        if (!kases) return;
        var forms = kases.split('-');
        _.each(forms, function(form) {
            var stem = slp.slp2sa(verb);
            var sa = slp.sa2slp(form);
            var key = keys[idx];
            var it_name = [conj, lakara, verb, key, form, stem, sa].join('_');
            it(it_name, function(done) {
                // true.should.equal(true);
                log('====Key:', key, form, sa);
                if (form == '') done();
                verbMorph(lakara, stem, form, key, done);
                // done();
            });
        });
    });
}

// now laghu returns only queries for asking in DB, so . . .
function verbMorph(lakara, stem, form, key, done) {
    log('TEST: LAKARA', lakara, stem, form, key);
    if (debug) log('=TEST=', verb, form, key);
    // var res = stemmer.get(form);
    // var morph = new Morph;
    morph.run(form, null, function(res) { // null is for next
        log('======RES========', res);
        // теперь здесь res = {queries, dicts, pdchs}
        // исправить соответственно
        var verbs = res[1].verbs.concat(res[1].verbs_more);
        var stems = _.map(verbs, function(doc) { return doc.stem });
        var morphs = _.map(verbs, function(doc) { return doc.morph[lakara] });
        morphs = _.uniq(_.flatten(morphs));
        if (debug) log('test: verbs', stems, 'stem', stem, 'morphs', morphs, 'key', key);
        isIN(morphs, key).should.equal(true);
        isIN(stems, stem).should.equal(true);
        done();
    });
}


utils.prototype.taddhita = function(tests, desc) {
    _.each(tests, function(test) {
        var namaTR = test[0];
        var nama = test[1];
        if (nama == '') return;
        var taddTR = test[2];
        var tadd = test[3];
        var tadd_name = ['tadd', desc, namaTR, nama].join('_');
        describe(tadd_name, function() {
            if (tadd == '') return;
            var key_name = [tadd_name, taddTR, tadd].join('_');
            it(key_name, function(done) {
                //log('FORM', namaTR, tadd, taddTR);
                //done();
                testTaddhita(nama, tadd, done);
            });
        });
    });
}

function testTaddhita(dhatu, form, done) {
    var morph = new Morph;
    morph.query(form, function(res) {
        var keys = _.map(res[1].taddhita, function(doc) { return doc.stem});
        if (debug) log('keys', keys, 'key', dhatu);
        isIN(keys, dhatu).should.equal(true);
        done();
    });
}

utils.prototype.tadd_tva = function(tests, desc) {
    _.each(tests, function(test) {
        var namaTR = test[0];
        var nama = test[1];
        var t1 = slp.sa2slp(namaTR);
        var t2 = slp.sa2slp(nama);

        // ???
        //log(t1, namaTR, t2, nama);
        //return;

        var taddTR = test[2];
        var tadd = test[3];
        var tadd_name = ['tadd', desc, namaTR, nama].join('_');
        describe(tadd_name, function() {
            if (tadd == '') return;
            var key_name = [tadd_name, taddTR, tadd].join('_');
            it(key_name, function(done) {
                //log('FORM', namaTR, tadd, taddTR);
                //done();
                testKri(nama, tadd, done);
            });
        });
    });
}

// [ 'guRa', 'गुण', 'गुणवत्', 'गुणवान्', 'गुणवती', 'गुणवत्' ],
utils.prototype.tadd_matup = function(tests, desc) {
    _.each(tests, function(test) {
        var namaTR = test[0];
        var nama = test[1];
        var matup = test[2]; // is on -at
        var masc = test[3];
        var fem = test[4];
        var neut = test[5];
        var tadd_name = ['tadd', desc, namaTR, nama].join('_');
        describe(tadd_name, function() {
            var key_name = [tadd_name, masc].join('_');
            it(key_name, function(done) {
                //log('FORM', namaTR);
                //done();
                testTaddhita(nama, masc, done);
            });
        });
    });
}

utils.prototype.krit_lyut = function(tests, desc) {
    _.each(tests, function(test) {
        var namaTR = test[0];
        var nama = test[1];
        var lyut = test[2];
        var tadd_name = ['krit', desc, namaTR, nama].join('_');
        describe(tadd_name, function() {
            var key_name = [tadd_name, lyut].join('_');
            it(key_name, function(done) {
                //log('FORM', namaTR, tadd, taddTR);
                // done();
                testKri(nama, lyut, done);
            });
        });
    });
}

// == BIG VERB == большие тесты глаголов
utils.prototype.verb = function(hash, la) {
    for (var verb in hash) {
        var lat = slp.sa2slp(verb);
        var tests = hash[verb];
        _.each(tests, function(test2, idx) {
            var test_name = [la, lat].join('_');
            describe(test_name, function(){
                var key;
                if (idx == 0 || idx == 1) key = 'sg.3'; // - только sg.3, P. и, возможно, A.
                // это для трех тестов
                // if (idx == 0 || idx == 3) key = 'sg.3';
                // if (idx == 1 || idx == 4) key = 'du.2';
                // if (idx == 2 || idx == 5) key = 'pl.1';
                var test2s = test2.split('/');
                _.each(test2s, function(test) {
                    var stem = verb;
                    var form_name = [test_name, key, stem, test].join('_');
                    it(form_name, function(done) {
                        queryVerb(test, stem, la, key, done);
                    });
                });
            });
        });
    }
}

function queryVerb(form, stem, la, key, done) {
    if (form == '' || form == '-') done();
    if (debug) log('=TEST=', form, key);
    var morph = new Morph;
    morph.query(form, function(res) {
        var verbs = res[1].verbs;
        var stems = _.map(verbs, function(doc) { return doc.stem });
        var morphs = _.map(verbs, function(doc) { return doc.morph });
        morphs = _.uniq(_.flatten(morphs));
        _.each(morphs, function(morph) {
            if (!morph[la]) return; // учитываю только требуемые la - lat, etc
            if (debug) log('test: verbs', stems, 'stem', stem, 'morphs', morph[la], 'key', key);
            isIN(morph[la], key).should.equal(true);
        });
        isIN(stems, stem).should.equal(true);
        done();
    });
}

utils.prototype.upasarga = function(desc, btests) {
    _.each(btests, function(tests) {
        var upa = tests.shift();
        upa = upa.replace(/-$/, '');
        var lupa = slp.sa2slp(upa);
        //log(upa, lupa, tests);
        var test_name = [desc, lupa].join('_');
        describe(test_name, function() {
            _.each(tests, function(test2) {
                var test = test2.split('-')[0];
                var key = test2.split('-')[1];
                var ltest = slp.sa2slp(test);
                var lkey = slp.sa2slp(key);
                var form_name = [test_name, ltest, lkey, upa, test, key].join('_');
                it(form_name, function(done) {
                    queryUpa(test, key, done);
                });
            });
        });
    });
}

function queryUpa(form, key, done) {
    if (form == '' || form == '-') done();
    if (debug) log('=UPA-test=', form, 'key:', key);
    var morph = new Morph;
    morph.query(form, function(res) {
        var upas = res[1].upas;
        var keys = _.map(upas, function(upa) { return upa.stem });
        isIN(keys, key).should.equal(true);
        //true.should.equal(true);
        done();
    });
}




function isIN(arr, item) {
    return (arr.indexOf(item) > -1) ? true : false;
}

function log() { console.log.apply(console, arguments) }
