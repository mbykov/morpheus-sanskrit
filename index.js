// morpheus v.0.3.0

var _ = require('underscore');
var s = require('sandhi');
var c = s.const;
var u = s.u;
var sandhi = s.sandhi;
var outer = s.outer;
var log = u.log;
var p = u.p;
var rasper = require('flakes');

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
*/

// main
// должен возвращать полностью сформированный список вариантов с весами-вероятностями
morpheus.prototype.run = function(samasa, next, cb) {
    if (!next) next = '';
    // var clean = correctM(samasa);
    var clean = outer(samasa, next);
    // log('CLEAN', clean);
    var flakes = rasper.cut(clean);
    // p(flakes);
    // log('FLAKES size:', flakes.length);
    var stems = _.uniq(_.flatten(flakes));
    // log('STEMS to get', stems.length);
    getDicts(stems, function(err, dbdicts) {
        // log('DBD', dbdicts);
        // TODO: теперь установить соответствие между flakes и dbdicts
        cb(dbdicts);
    });
    // cb('ok');
    return;
}


// забрать реально существующие padas из BD
function getDicts(stems, cb) {
    var keys = {keys: stems};
    var view = 'gita-add/byForm';
    // log('morph-03 getDicts - SSS-new', keys.length);
    // FIXME: некузяво, keys вручную отдельно посылается через .send
    // и Content-Type отдельно прописан - так нельзя
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
    var keys = ['keys=', JSON.stringify(stems)].join('');
    var view = 'gita-add/byForm';
    log('morph-03 getDicts - SSS-new', keys.length);
    relax
        .view(view)
        .query(keys)
    // .query({include_docs: true})
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
