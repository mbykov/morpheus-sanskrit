// morpheus v.0.3.0

var _ = require('underscore');
var s = require('sandhi');
var c = s.const;
var u = s.u;
var sandhi = s.sandhi;
// var outer = s.outer;
var inc = u.include;
var log = u.log;
var p = u.p;
var rasper = require('flakes');
var outer = require('./lib/outer');

dbpath = 'http://admin:kjre4317@localhost:5984';
var Relax = require('relax-component');
var relax = new Relax(dbpath);
relax.dbname('gita-add');

module.exports = morpheus();

function morpheus() {
    if (!(this instanceof morpheus)) return new morpheus();
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

// main
// должен возвращать полностью сформированный список вариантов с весами-вероятностями
morpheus.prototype.run = function(samasa, next, cb) {
    if (!next) next = 'इ'; // FIXME:
    var clean = outer.correctM(samasa, next);
    // log('CLEAN', clean);
    var chains = rasper.cut(clean);
    // p(chains);
    // log('CHAINS size:', chains.length);
    var stems = _.uniq(_.flatten(chains));
    // log('STEMS to get', stems);
    if (next) stems = outer.odd(chains, stems, clean, next);
    // log('STEMS to get', stems);
    getDicts(stems, function(err, dbdicts) {
        // log('DBD', err, dbdicts);
        // TODO: теперь установить соответствие между chains и dbdicts
        cb(dbdicts);
    });
    // cb('ok');
    return;
}


// забрать реально существующие padas из BD, POST
function getDicts(stems, cb) {
    var keys = {keys: stems};
    var view = 'gita-add/byForm';
    // log('morph-03 getDicts - SSS-new', keys.length);
    // FIXME: некузяво, keys вручную отдельно посылается через .send
    // и Content-Type отдельно прописан - так нельзя
    // var keys = {keys: ['इहैव']};
    relax
        .postView(view)
        .send(keys)
        // .query({limit: 100})
        // .query({include_docs: true})
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
            if (err) log('ERR morph getDicts', err, res);
            if (err) return cb(err, null);
            var rows = JSON.parse(res.text.trim()).rows;
            var docs = _.map(rows, function(row) {
                var doc = {stem: row.key, trn: row.value};
                return doc;
            });
            cb(err, docs);
        });
}

function getDicts_(stems, cb) {
    log('STEMS', stems);
    // stems = ['रमते'];
    var keys = ['keys=', JSON.stringify(stems)].join('');
    var view = 'gita-add/byForm';
    var keys = ['keys=', JSON.stringify(['इहैव'])].join('');
    log('morph-03 getDicts - SSS-new', keys);
    relax
        .view(view)
        .query(keys)
    // .query({include_docs: true}) // 'वर्तेतः'
        .query({limit: 100})
        .end(function(err, res) {
            if (err) log('ERR morph getDicts', err, res);
            if (err) return cb(err, null);
            var rows = JSON.parse(res.text.trim()).rows;
            // log('ROWS', rows);
            // var docs = _.map(rows, function(row) {
            // var doc = row.doc;
            // return doc;
            // });
            // в Гите значения dicts повторяются с разными переводами, в других словарях нужен будет .doc
            var docs = _.map(rows, function(row) {
                var doc = {stem: row.key, trn: row.value};
                return doc;
            });
            cb(err, docs);
        });
}


// as in flakes/test/gita.js
function correctM(str, next) {
    var clean = str;
    var fin = u.last(str);
    if (!next) next = '';
    if (!next.form) next = ''; // откуда тут объект? д.б. строка только
    var beg = next[0];
    var n = 'म';
    // здесь изображение правила: doubled palatal - var dental = u.palatal2dental(mark.fin);
    if (beg == 'च') n = 'न';
    if (fin == c.anusvara) clean = [u.wolast(str), n, c.virama].join('');
    // три простые правила, как в outer ?
    // else if (fin == 'ो' && inc(c.soft, beg)) clean = [u.wolast(str), c.visarga].join('');
    // else if (fin == 'ो' && inc(c.soft, beg)) log('OOO', str, 'beg', beg, 222) // परयाो
    // else if (fin == 'ा' && (inc(c.allvowels, beg) || inc(c.soft, beg))) clean = [samasa, c.visarga].join('');
    return clean;
}

// ===========================================


/**
 * removes flex, if possible, and fill in queries storage
 * @param {string} shabda
 */
function checkFlex(shabda) {
    var bareword = 'bareword';
    this.queries.push(bareword);
    return;
}

morpheus.prototype.x = function() {
}

morpheus.prototype.x = function(arr,obj) {
}
