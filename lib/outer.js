var _ = require('underscore');
var s = require('sandhi');
var c = s.const;
var u = s.u;
var sandhi = s.sandhi;
var inc = u.include;
var log = u.log;
var p = u.p;


module.exports = outer();

function outer() {
    if (!(this instanceof outer)) return new outer();
    this.queries = [];
}


function correctM(samasa, next) {
    let fin = u.last(samasa);
    if (fin != c.anusvara) return;
    let clean = '';
    let beg = (next) ? next[0] : null;
    let n = (beg == 'च') ? 'न' : 'म';
    clean = [u.wolast(samasa), n, c.virama].join('');
    return clean;
}

function exeptions(samasa, next) {
    let clean;
    if (!next) return samasa;
    let beg = next[0];
    if (!u.isVowel(beg)) { // FIXME: B7. (visarga) in सः and एषः is dropped when followed by (vowel except अ) or a (consonant).
        if (samasa == 'स') return 'सः';
        else if (samasa == 'एष') return 'एषः';
        else if (u.endsWith(samasa, 'ेष')) return [samasa, c.visarga].join(''); // if last pada is the same eza;
    }
    if (samasa == 'य' && beg != c.a) return 'यः';
    else if (samasa == 'त' && beg != c.a) return 'ते';
    return clean;
}


// а если это не !next, а конец строки, и санди таки есть? Нужен пример


// was sandhi/lib/outer
outer.prototype.correct = function(samasa, next) {
    if (!next) next = '';
    let clean;
    let virama;
    let fin = u.last(samasa);

    // log('BEFORE 1');
    clean = correctM(samasa, next);
    if (clean) return [clean];

    // log('BEFORE 2');
    clean = exeptions(samasa, next);
    if (clean) return [clean];

    // log('BEFORE O EA', clean);
    let cleans = correctEA(samasa, next);
    if (cleans) return cleans;

    cleans = correctHard(samasa, next);
    if (cleans) return cleans;

    return [samasa];
}

function correctEA(samasa, next) {
    // log('outer samasa:', samasa, 'next:', next);
    let virama;
    let fin = u.last(samasa);
    let beg = next[0];
    if (fin == c.virama) {
        fin = u.penult(samasa);
        virama = true;
    }

    // log('OUTER before EA', fin, u.isConsonant(fin));
    let clean, cleanE, cleanHard;
    // три простые частые правила:
    if (fin == 'ो' && inc(c.soft, beg)) clean = [u.wolast(samasa), c.visarga].join('');
    else if (fin == 'ो' && u.isVowel(beg)) clean = [u.wolast(samasa), c.visarga].join('');
    else if (fin == 'ा' && (inc(c.allvowels, beg) || inc(c.soft, beg))) clean = [samasa, c.visarga].join('');
    else if (u.isConsonant(fin) && !next) clean = [samasa, c.visarga].join('');
    if (clean) return [clean];
    // log('OUTER - EA', clean);

    // ==> первое - если beg - не a, могут быть -e, и -:, то есть два результата?
    // FIXME: TODO: next two rules contradict each other, should be two results, with e and with visarga? then syntax analyze?
    // 1.6 - e: सर्व सर्वे, next एव, ; 1.6-visarga विक्रान्त विक्रान्तः, next उ
    // BUT: 10.1 - भूय  भूयः, next eva
    // a+visarga (v for s) + vow ex a: // 5.1 - yacCreya-यच्छ्रेय
    if (inc(c.consonants, fin) && inc(c.allexa, beg)) {
        clean = [samasa, c.visarga].join(''); // visarga dropped before simple
        cleanE = [samasa, u.liga('ए')].join(''); // e dropped - ayadi-sandhi
        return [samasa, clean, cleanE];
    }
}

function correctHard(samasa, next) {
    // log('outer samasa:', samasa, 'next:', next);
    let virama;
    let fin = u.last(samasa);
    let beg = next[0];
    if (fin == c.virama) {
        fin = u.penult(samasa);
        virama = true;
    }

    // soft to hard
    let lala = (fin == 'ल' && beg == 'ल');
    let begSoftButNasal = (inc(c.soft, beg) && !inc(c.Nam, beg));
    let cleanHard;

    if (virama && (inc(c.class3, fin) || inc(c.yava, fin)) && begSoftButNasal && !lala) {
        let hard = u.class1(fin);
        let stem = samasa.slice(0, -2);
        cleanHard = [stem, hard, c.virama].join('');
        return [samasa, cleanHard];
    }
}
