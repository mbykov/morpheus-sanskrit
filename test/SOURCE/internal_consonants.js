// http://learnsanskrit.org/references/sandhi/internal

var utils = require('../utils');

// form, flex, canon.flex, stem = result
var unaspirated2aspirated = [
    ['रुन्द्ध्वे', 'ध्वे', 'ध्वे', 'रुन्ध्'],
    ['सिप्तः', 'तः', 'तः', 'सिभ्'],
    ['', '', '', ''],
];

var move_aspirate_forward = [
    ['बुद्ध', 'ध', 'त', 'बुध्'],
    ['रुन्द्धः', 'धः', 'थः', 'रुन्ध्'],
    ['दुग्ध', 'ध', 'त', 'दुह्'],
];

var move_aspirate_backward = [
    ['भुद्ध्वम्', 'ध्वम्', 'xxx', 'बुध्'], // अभुद्ध्वम् - w/o affix
    ['', '', '', ''],
];

// h is treated like gh cflex=s
var h_like_gh_s_z = [
    ['लेक्षि', 'षि', 'सि', 'लेह्'],
    ['', '', '', ''],
];

// h is treated like gh
var h_like_gh_t_D = [
    ['दग्ध', 'ध', 'त', 'दह्'],
    ['दिग्ध्वे', 'ध्वे', 'ध्वे', 'दिह्'],
];

// h_like_gh_other
var h_like_gh_other = [
    ['मूढ', 'ढ', 'त', 'मुह्'],
    ['लीढ', 'ढ', 'त', 'लिह्'],
    ['ऊढ', 'ढ', 'त', 'ऊह्'],
    ['स्निग्धः', 'धः', 'त', 'स्निह्'],
    ['', '', '', ''],
];

// final_s => vas, Gas exceptions
var final_s = [
    ['वत्स्यति', 'स्यति', 'xxx', 'वस्'],
    ['जिघत्सति', 'सति', 'xxx', 'जिघस्'],
    ['शाधि', 'धि', 'xxx', 'शास्'],
];

var no_sandhi_change_of_any_kind = [
    ['वचन्ति', 'न्ति', 'xxx', 'वच'], // अन्ति, stem=वच्
    ['वच्मि', 'मि', '', 'वच्'],
    ['वाच्य', 'य', '', 'वाच्'],
    ['', '', '', ''],
];

var unvoiced2voiced = [
    ['हत्तः', 'तः', 'xxx', 'हद्'],
    ['अत्सि', 'सि', 'xxx', 'अद्'],
    ['अत्थः', 'थः', 'xxx', 'अद्'],
    ['', '', '', ''],
    ['', '', '', ''],
];

var cavarga_c = [
    ['वक्ति', 'ति', 'ति', 'वच्'],
    ['युक्त', 'त', 'त', 'युज्'],
    ['', '', '', ''],
];

var cavarga_j = [
    // stem_k, flex_t
];

var cavarga_z_y = [
    ['द्रक्ष्यसि', 'यसि', 'xxx', 'द्रश्'],
    ['', '', '', ''],
];

var cavarga_z_t_w = [
    ['विष्ट', 'ट', 'त', 'विश्'],
    ['वष्टे', 'टे', 'ते', 'वच्'],
    ['राष्ट्र', 'ट्र', 'त्र', 'राज्'],
    ['', '', '', ''],
];

var retroflex_k = [
    ['द्वेक्षि', 'षि', 'सि', 'द्वेष्'],
];

var final_n = [
    ['जिघांसति', 'सति', 'xxx', 'जिघान्'],
    ['मीमांसति', 'सति', 'xxx', 'मीमान्'],
    ['', '', '', ''],
];

var final_m = [
    ['जगन्वत्', 'वत्', 'xxx', 'जगम्'],
    ['', '', '', ''],
];

describe('Internal consonants sandhi', function() {
    describe('unaspirated2aspirated OK', function() {
        utils.test(unaspirated2aspirated);
    });
    describe('move_aspirate_backward OK', function() {
        utils.test(move_aspirate_backward);
    });
    describe('move_aspirate_forward OK', function() {
        utils.test(move_aspirate_forward);
    });
    describe('h_like_gh_s_z OK', function() {
        utils.test(h_like_gh_s_z);
    });
    describe('h_like_gh_t_D OK', function() {
        utils.test(h_like_gh_t_D);
    });
    describe('h_like_gh_other OK', function() {
        utils.test(h_like_gh_other);
    });
    describe('final_s OK', function() {
        utils.test(final_s);
    });
    describe('unvoiced2voiced OK', function() {
        utils.test(unvoiced2voiced);
    });
    describe('no_sandhi_change_of_any_kind OK', function() {
        utils.test(no_sandhi_change_of_any_kind);
    });
    describe('cavarga_c OK', function() {
        utils.test(cavarga_c);
    });
    describe('cavarga_j', function() {
        utils.test(cavarga_j);
    });
    describe('cavarga_z_y OK', function() {
        utils.test(cavarga_z_y);
    });
    describe('cavarga_z_t_w OK', function() {
        utils.test(cavarga_z_t_w);
    });
    describe('retroflex_k OK', function() {
        utils.test(retroflex_k);
    });
    describe('final_n OK', function() {
        utils.test(final_n);
    });
    describe('final_m OK', function() {
        utils.test(final_m);
    });
});



// describe(descr, function() {
//     utils.test(tests);
// });
