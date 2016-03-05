/*
  couchDB/gita/bySamasa to file /test/freq/checkfreq-test.js
  before $ make freq
*/

var util = require('util');
var fs = require('fs');
var path = require('path');
var salita = require('salita-component');
var u = require('../lib/utils');
var log = u.log;
var Relax = require('relax-component');
var relax = new Relax('http://admin:kjre4317@localhost:5984');
relax.dbname('gita');

log('couch reading ...');

getDocs(function(rows) {
    var fpath = path.resolve(__dirname, 'freq/freq-test.js');
    log('R', fpath);

    var file = fs.createWriteStream(fpath);
    file.on('error', function(err) { /* error handling */ });
    file.write('[' + '\n')
    rows.forEach(function(row, idx) { log('ROW', idx, row) });
    rows.forEach(function(row) { file.write(JSON.stringify(row) + ',\n'); });
    file.write(']' + '\n')
    file.end();
    
});

function getDocs(cb) {
    var view = 'gita/bySamasa';
    relax
        .view(view)
        .query({limit: 10000})
        .end(function(err, res) {
            var rows = JSON.parse(res.text.trim()).rows;
            keys = rows.map(function(row) { return row.key});
            cb(keys);
        });
}






function log() { console.log.apply(console, arguments) }

