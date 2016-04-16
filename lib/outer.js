var _ = require('underscore');
var s = require('sandhi');
var c = s.const;
var u = s.u;
var sandhi = s.sandhi;
var inc = u.include;
var log = u.log;
var p = u.p;
var rasper = require('flakes');


module.exports = outer();

function outer() {
    if (!(this instanceof outer)) return new outer();
    this.queries = [];
}

/*
  outer:
  вычисляет и возвращает формы без outer-sandhi
*/

outer.prototype.correct = function(clean) {
    var fin = u.last(clean);
    var penult = u.penult(clean);
    if (fin == c.o) return [u.wolast(clean), c.visarga].join('');
}

outer.prototype.odd = function(terms, opt, clean, next) {
    var odds = [];
    var odd;
    // по-моему, далее я опять воспроизвожу аккуратно outer.js:
    if (u.isConsonant(opt.fin) && (u.isConsonant(opt.beg) || u.isSimple(opt.beg))) {
        terms.forEach(function(term) {
            if (inc(['स', 'एष'], term)) {
                // odd = [term, c.visarga].join('');
                odd = {query: [term, c.visarga].join(''), flake: term, var: 'saH-eshaH'}
                odds.push(odd);
                // log('SA - ESHA', odd);
                // throw new Error('SA:-ESHA: OUTER');
            }
        });
    }
    // log('=========', opt.fin, u.isConsonant(opt.fin), opt.beg, u.isSimple(opt.beg), c.allexa)
    if (u.isConsonant(opt.fin) && u.isVowExA(opt.beg)) {
        var terms_e = terms.map(function(term) { return {query: [term, c.e].join(''), flake: term, var: 'e'} });
        var terms_H = terms.map(function(term) { return {query: [term, c.visarga].join(''), flake: term, var: 'H'} });
        odds = odds.concat(terms_e, terms_H);
        // log('OOOO', terms_H)
    }
    // log('FIN', opt.fin, 'BEG', opt.beg);
    else if (opt.fin == c.o && inc(c.soft, opt.beg)) {
        var terms_o = terms.map(function(term) { return {query: [u.wolast(term), c.visarga].join(''), flake: term, var: 'o'}  });
        // log('OOOO', terms_o)
        odds = odds.concat(terms_o);
    }
    else if (opt.fin == c.A && (inc(c.soft, opt.beg) || inc(c.allvowels, opt.beg))) {
        var terms_A = terms.map(function(term) { return  {query: [term, c.visarga].join(''), flake: term, var: 'A'}   });
        // log('OOOO', terms_o)
        odds = odds.concat(terms_A);
    }
    else if (opt.fin == c.virama && inc(c.onlysoft, opt.penult) && inc(c.soft, opt.beg)) {
        var terms_hard = terms.map(function(term) {
            var hard_fin = u.class1(opt.penult);
            var hard = term.slice(0, -2);
            return {query: [hard, hard_fin, c.virama].join(''), flake: term, var: 'hard'} ;
        });
        // log('SOFT TO HARD', terms)
        odds = odds.concat(terms_hard);
    }
    return odds;
}

// as in flakes/test/gita.js
outer.prototype.correctM = function(samasa, opt) {
    var clean = samasa;
    var n = (opt.beg == 'च') ? 'न' : 'म';
    clean = [u.wolast(samasa), n, c.virama].join('');
    return clean;
}
