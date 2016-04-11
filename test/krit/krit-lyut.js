// kridanta - lyut; -ana ; Using this प्रत्यय (pratyaya) the verb can be expressed as an object (कर्म / karma) in the sentence.
// http://sanatan-rigveda.blogspot.ru/p/verb-forms-krridantapada-in-chapter-3.html
// http://learnsanskrit.org/start/words/primary

// FIXME: суффикс lyut -ana - всегда употребляется в форме -ana-m? Вряд-ли, но пока нет других примеров

var utils = require('../utils');
var desc = 'lyut'; //

var tests = [

    [ 'paW', 'पठ्', 'पठनम्' ],
    [ 'SI', 'शी', 'शयनम्' ],
    [ 'DAv', 'धाव्', 'धावनम्' ],
    [ 'nI', 'नी', 'नयनम्' ],
    [ 'nay', 'नय्', 'नयनम्' ],
    [ 'gam', 'गम्', 'गमनम्' ],
    [ 'smf', 'स्मृ', 'स्मरणम्' ],
    [ 'Svas', 'श्वस्', 'श्वसनम्' ],
    [ 'kf', 'कृ', 'करणम्' ],
    //[ 'darS', 'दर्श्', 'दर्शनम्' ], // no MW: это важное слово, NB:

];

describe(desc, function() {
    //utils.krit_lyut(tests, desc);
    utils.kritKta(tests, desc);

});
