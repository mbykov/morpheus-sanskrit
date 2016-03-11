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

outer.prototype.odd = function(chains, stems, clean, next) {
    var beg = u.first(next);
    var fin = u.last(clean);
    var penult = u.penult(clean);
    // log('SIMPLE', beg, u.isSimple(beg));
    var terms = chains.map(function(chain) { return u.last(chain)});
    terms = _.uniq(_.flatten(terms));
    // var odds = [];
    var odd;
    // по-моему, далее я опять воспроизвожу аккуратно outer.js:
    if (u.isConsonant(fin) && (u.isConsonant(beg) || u.isSimple(beg))) {
        terms.forEach(function(term) {
            if (inc(['स', 'एष'], term)) {
                odd = [term, c.visarga].join('');
                stems.push(odd);
                // log('SA - ESHA', odd);
            }
        });
    }
    // log('=========', fin, u.isConsonant(fin), beg, u.isSimple(beg), c.allexa)
    if (u.isConsonant(fin) && u.isVowExA(beg)) {
        var terms_e = terms.map(function(term) { return [term, c.e].join('')});
        var terms_H = terms.map(function(term) { return [term, c.visarga].join('') });
        stems = stems.concat(terms_e);
        stems = stems.concat(terms_H);
        // log('OOOO', terms_H)
    }
    // log('FIN', fin, 'BEG', beg);
    else if (fin == c.o && inc(c.soft, beg)) {
        var terms_o = terms.map(function(term) { return [u.wolast(term), c.visarga].join('') });
        // log('OOOO', terms_o)
        stems = stems.concat(terms_o);
    }
    else if (fin == c.A && (inc(c.soft, beg) || inc(c.allvowels, beg))) {
        var terms_A = terms.map(function(term) { return [term, c.visarga].join('') });
        // log('OOOO', terms_o)
        stems = stems.concat(terms_A);
    }
    else if (fin == c.virama && inc(c.onlysoft, penult) && inc(c.soft, beg)) {
        var terms_hard = terms.map(function(term) {
            var hard_fin = u.class1(penult);
            var hard = term.slice(0, -2);
            return [hard, hard_fin, c.virama].join('');
        });
        // log('SOFT TO HARD', terms)
        stems = stems.concat(terms_hard);
    }
    return stems;
}

outer.prototype.correctM = function(samasa, next) {
    var clean = samasa;
    var fin = u.last(samasa);
    if (!next) next = '';
    // if (!next.form) next = ''; // откуда тут объект? д.б. строка только
    var beg = next[0];
    var n = 'म';
    // здесь изображение правила: doubled palatal - var dental = u.palatal2dental(mark.fin);
    if (beg == 'च') n = 'न';
    if (fin == c.anusvara) clean = [u.wolast(samasa), n, c.virama].join('');
    return clean;
}
