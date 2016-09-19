/*
  runner: node morph.js eva
*/

var lat = process.argv.slice(2)[0] || false;
var next = process.argv.slice(3)[0] || false;
// var util = require('util');

var path = require('path');
var fs = require('fs');

var sandhi = require('sandhi');
var u = sandhi.u;
var log = u.log;
var p = u.p;

var salita = require('salita-component');
var morph = require('./index');

if (!lat) return log('?');

var samasa;
if (/[a-zA-Z]/.test(lat[0])) {
    samasa = salita.slp2sa(lat);
} else {
    samasa = lat;
    lat = salita.sa2slp(samasa);
}

log('_la_:', lat, '_sa_:', samasa);

console.time('_morph');

morph.run(samasa, null, function(res) {
    log('morph-0.4 res: ==============>>');
    p(res);
    console.timeEnd('_morph');
});
