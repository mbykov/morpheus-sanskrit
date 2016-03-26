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
  во-вторых, каждому flake на -o нужно сразу добавить flake на visarga, etc ?
  а есть-ли вообще у меня в словаре слова с окончанием на o, на e? есть, пара слов и обращения
  непонятно - просто добавить висаргу? что потом?
  или - только в последнюю pada в цепочке?
  выписать все реальные слова на -o в словаре? Пока список:
  - अहो = alas - अथो = or in other words - नो = nor - आहो = or else - все они попали бы в список terms, если бы стояли отдельно
  или просто outer(samasa), но кроме этого списка?
  outer заменит -o, а в ответе исключение - aho
  то есть outer, и затем, если в цепочке ahaH, добавить aho, etc на эти исключения
  по честному, нужно учитывать next, но в тестах я gita-add next не сделал, для простоты
  ==> нельзя вообще в тестах работать с gita-add, потому что там формы вырваны из контекста.
  а в реале будет задан какой-то конкретный next

  теперь -e. - raTopasTa
  в samasa нет флексии -e, ayadi-sandhi. А в dict - есть, это локатив. М.б. добавить всегда к dict на -e еще и форму без -e?

  то есть я что исправляю? Сейчас и samasa, и dict, через outer.

  а могут быть разные случаи, в зависимости от next
  может быть -e в средней паде, всегда не меняется ?
  может совпадать и в samasa, и в dict - это скажется в MW ?
  может form= ta, clean= te, что тут, нужно добавить form ? Зачем?
  например, dict=me, совпадает с samasa. Добавить ma для MW? (если в MW нету)
  а в 1.47 - dict= upasTe, а самаса= raTopasTa, из-за ayadi. Тут точно добавить, для MW и для BG: उपस्थ = for उपस्थे = on the seat
  3.28 - form: vartanta, dict: vartante - глагол, vartante, -e обрезано по outer-sandhi.

  итак, запрос на -e, а в словаре MW -a, форма склонения существительного, в BG - dict также на -e
  или запрос на -a, а в словаре -e, глагол atmanepada

  так как быть ?
  если в запросе -e, то добавить в запрос -a - точнее, отбросить флексию, --> для MW --> однако, некоторых в MW нет: upasTa, лишь upa+sTa
  если в запросе -a и next-vow, добавить в запрос -e --> для BG тоже

  в словарь gita-add я не добавляю никаких очищеных форм,
  в тестах BG я могу преобразовывать samasa в соответствии с dict, добавлять -e или -H, но не трогать dict
  а в реале?
  все последние padas на -a, (на согласную) - добавить и -H и -e ? не дохрена ли?
  в реале я должен отбросить-добавить ВСЕ варианты флексий, их еще более дохренищща будет
  нет, отбросить - ок, автоматически отброшены (если слоги, однако)
  а добавить - только -H, -e ?
*/

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
