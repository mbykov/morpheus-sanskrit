/*

*/

// здесь нужно полноценный модуль запилить

// var lat = process.argv.slice(2)[0] || false;
// var pdch = process.argv.slice(3)[0] || false;
// var util = require('util');

var salita = require('salita-component');


module.exports = param;

function param(latin) {
    if (!latin) return console.log('what ?');
    console.log('========PARAM', latin);
    var samasa;
    if (/[a-zA-Z]/.test(latin[0])) {
        samasa = salita.slp2sa(latin);
    } else {
        samasa = latin;
        latin = salita.sa2slp(samasa);
    }
    return {sa: samasa, lat: latin};
}
