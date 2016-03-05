//
var _ = require('underscore');
var salita = require('salita-component');
var fs = require('fs');
var u = require('../../lib/utils');
var log = u.log;
var Relax = require('relax-component');
var relax = new Relax('http://admin:kjre4317@localhost:5984');
relax.dbname('gita');
var freq = require('../../lib/freqpadas');
var outer = require('../../lib/outersandhi');
var debug = (process.env.debug == 'true') ? true : false;


var str = fs.readFileSync('./test/SOURCE/freq-test.js', "utf8");
var rows = str.trim().split('\n');
rows = rows.map(function(row) { return JSON.parse(row.trim()) });

var unique = {};
rows.forEach(function(row) {
    if (!unique[row.samasa]) unique[row.samasa] = row.padas;
})

var idx = 0;
for (var samasa in unique) {
    var padas = unique[samasa];
    var first = padas[0];
    // first = outer.run(first);
    var idy = idx+0;
    var second = padas[1];
    var descr = '_ ' + salita.sa2slp(samasa) + ' = '  + salita.sa2slp(first) + ' + ' + salita.sa2slp(second) + ' _';
    describe(descr, function() {
        var asamasa = [samasa, ''].join('');
        var afirst = [first, ''].join('');
        afirst = outer.run(afirst);
        var asecond = [second, ''].join('');
        asecond = outer.run(asecond);
        // if (asecond.slice(-2) == 'ाः' ) log('AAA', asamasa); धार्तराष्ट्रान्स्वबान्धवान् स्वबान्धवान्
        // log(111, asecond.slice(-2) == 'ाः', asecond, asamasa.slice(-1) ==  'ा');
        // log(222, asecond.slice(-2) == 'ाः' && asamasa.slice(-1) ==  'ा');
        // var bbb = asecond.slice(-2) == 'ाः' && asamasa.slice(-1) ==  'ा';
        // log('bbb-222', bbb)
        if (asecond.slice(-2) == 'ाः' && asamasa.slice(-1) ==  'ा') asamasa = [asamasa, 'ः'].join('');
        if (asecond.slice(-2) == 'ाः' && asamasa.slice(-1) ==  'ा') asamasa = [asamasa, 'ः'].join('');
        var finsam = asamasa.slice(-1);
        var finsec = asecond.slice(-2);
        if (finsec == finsam+ 'ः') asamasa = [asamasa, 'ः'].join('');

        var itdescr = [asamasa,afirst,asecond].toString(); // द्रव्ययज्ञास्तपोयज्ञा: 2 तपोयज्ञाः
        it(itdescr, function(done) {
            log(idy);
            idy +=1;
            // asamasa = outer.run(asamasa);
            var queries = freq.tails(asamasa);
            // log('Q', queries, 1, asamasa, 2, asecond); // केचिद्भीताः भीताः
            queries.length.should.greaterThan(0);
            var qstems = queries.map(function(q) { return q.stem});
            var qpadas = queries.map(function(q) { return q.pada});
            qstems.should.containEql(afirst);
            qpadas.should.containEql(asecond);
            // true.should.be.ok;
            done();
        });
    });
}
