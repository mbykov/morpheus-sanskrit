// function verbMorph_(form, key, conj, done) {
//     if (form == '') done();
//     if (process.env.debug == 'true') log('=TEST=', form, key);
//     var morph = new Morph;
//     morph.query(form, function(results) {
//         var verbs = _.select(results[1], function(res) { if (res.pos == 'verb') return res});
//         var keys = _.map(verbs, function(verb) {
//             return _.map(verb.queries, function(query) {
//                 var key = query.key;
//                 return key;
//             });
//         });
//         keys = _.uniq(_.flatten(keys));
//         //log('=TEST KEYS=>>', keys);
//         var ganas = _.map(verbs, function(res) {return res.gana});
//         var ganas = _.map(verbs, function(verb) {
//             return _.map(verb.queries, function(query) { return query.gana });
//         });
//         //ganas = _.compact(_.uniq(_.flatten(ganas)));
//         ganas = _.uniq(_.flatten(ganas));
//         var ganaNumber = conum[conj];

//         if (isIN(ganas, 0) || ganaNumber == 99) var doNotGana = false;
//         if (doNotGana) {
//             //log('Test: KEY, GANA', keys, key, ganas, ganaNumber)
//             isIN(ganas, ganaNumber).should.equal(true);
//         }
//         if (process.env.debug == 'true') log('Test: KEY, GANA', keys, key, ganas, ganaNumber)

//         isIN(keys, key).should.equal(true);
//         done();
//     });
// }
