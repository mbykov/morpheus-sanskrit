/*

*/

// здесь нужно полноценный модуль запилить

var lat = process.argv.slice(2)[0] || false;
// var pdch = process.argv.slice(3)[0] || false;
// var util = require('util');

var salita = require('salita-component');

if (!lat) return console.log('what ?');

module.exports = param;

function param(latin) {
    // if (!(this instanceof param)) return new param();
    // this.queries = [];
    console.log('========PARAM', latin);
    var samasa;
    if (/[a-zA-Z]/.test(lat[0])) {
        samasa = salita.slp2sa(lat);
    } else {
        samasa = lat;
        lat = salita.sa2slp(samasa);
    }
    return samasa;
}
