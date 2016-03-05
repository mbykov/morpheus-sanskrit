//

var salita = require('salita-component');

var _ = require('underscore');
// var sandhi = require('../index');
var vigraha = require('../vigraha');
var debug = (process.env.debug == 'true') ? true : false;

module.exports = utils();

function utils(str) {
    if (!(this instanceof utils)) return new utils(str);
    return this;
}

function mapPada(res) {
    var padas = [];
    res.forEach(function(ps) {
        var pps = ps.map(function(p) { return p.pada});
        padas.push(pps);
    });
    // log(1, _.flatten(padas));
    return _.uniq(_.flatten(padas));
}

utils.prototype.test = function(test, idx) {
    var samasa = test.shift();
    var first = test[0];
    var second = test[1];
    if (!samasa) return;
    var addtext = test.join(' + ');
    var idxstr = ['_', idx+1, '_'].join('');
    var cotrn = salita.sa2slp(samasa);
    var fitrn = salita.sa2slp(first);
    var setrn = salita.sa2slp(second);
    var trn = [fitrn, setrn, cotrn].join(' - ');
    // add
    var descr = [idxstr, 'vigraha', addtext, samasa, trn].join(' - ');
    it(descr, function(done) {
        // vigraha.get(samasa);
        vigraha.get(samasa, function(res) {
            // log('VIGRAHA', JSON.stringify(res));
            if (!res) return done();
            var padas = mapPada(res);
            var isin = false;

            var ts = [];
            padas.forEach(function(pada) {
                var re = new RegExp(pada);
                if (pada.length > 1 && re.test(first)) isin = true;
            });
            isin.should.equal(true);
            padas.forEach(function(pada) {
                var re = new RegExp(pada);
                if (pada.length > 1 && re.test(second)) isin = true;
            });
            isin.should.equal(true);

            // var isin = (isIN(padas, first) && isIN(padas, second)) ? true : false;
            // log('test:', padas)
            done();
        });
    });

    // // delete
    // /* как организовать тесты? В реальной жизни я имею samasa и хвост, а в сплиттере наоборот - начало от samasa
    //    здесь я могу посчитать длину second и вычислить половинки - вычитаю длину второго и символ начала (+1)
    //    вычитаю вторую половину для естественности
    //    salita не перекодирует начальные лиги
    //  */
    // var descr = [idxstr, 'del', addtext, samasa].join(' - ');
    // it(descr, function() {
    //     var fres = false;
    //     var sres = false;
    //     var results = sandhi.del(samasa, second);
    //     results.forEach(function(res) {
    //         if (isIN(res.firsts, first)) fres = true;
    //         if (isIN(res.seconds, second)) sres = true;
    //     });
    //     // log('TEST CUT', res);
    //     fres.should.equal(true);
    //     sres.should.equal(true);
    // });

}

utils.prototype.gita = function(descr, sa, v, idx, idy) {
    it(descr, function() {
        // isIN(splitted, second).should.equal(true);
        // var vistr = JSON.stringify(v);
        var vistr = v.join(' ');
        // log(v.length, 'vi-str', vistr);
        var hash = sandhi.split(sa);
        // log(1, idx, idy, v);
        // log('hash', hash);
        var splitted = hash[sa];
        // log('test-gita splitted size', splitted.length);
        // log('hash', arr2string(res)); // '"भीरुः अयम्"'
        isIN(splitted, vistr).should.equal(true);
        // true.should.equal(true);

        // SPLITTER FIXME: убрать, это тест
        splitter.get(sa);
    });
}

function arr2string(v) {
    // if (typeof(obj) == 'string') obj = [obj];
    return v.map(function(str) {return JSON.stringify(str) });
}

function isIN(arr, item) {
    return (arr.indexOf(item) > -1) ? true : false;
}

// true.should.equal(true);
function log() { console.log.apply(console, arguments) }
