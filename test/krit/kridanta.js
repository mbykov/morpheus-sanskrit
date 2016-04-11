var utils = require('../utils');
//var desc = 'krit';
var desc = '9suffix';
// a.k.a _9suffix_
//  tric, tavyat, yak, shanu, nvul, nyat, kta, ktavatu, aniyar,
// нужно все преобразовать здесь в sg.3, либо брать все формы с inria.fr
// да ваще звиздец

var tests = {

    'akz': {tric: 'अक्षितृ-अष्टृ', tavyat: 'अक्षितव्य/अष्टव्य', yak: 'अक्ष्यमाण', shanu: 'अक्षत्-अक्ष्णुवत्', nvul: 'अक्षक', nyat: 'अक्ष्य', kta: 'अष्ट', ktavatu: 'अष्टवत्', aniyar: 'अक्षणीय'},
    // FIXME: -kta - BUG:
    'ag': {tric: 'अगितृ', tavyat: 'अगितव्य', yak: 'अग्यमान', shanu: 'अगत्', nvul: 'आगक', nyat: 'आग्य', kta: 'अगित', ktavatu: 'अगितवत्', aniyar: 'अगनीय'},
    'aNk': {tric: 'अङ्कितृ', tavyat: 'अङ्कितव्य', yak: 'अङ्क्यमान', shanu: 'अङ्कमान', nvul: 'अङ्कक', yat: 'अङ्क्य', kta: 'अङ्कित', ktavatu: 'अङ्कितवत्', aniyar: 'अङ्कनीय'},
    //'aNka-10': {tric: '', tavyat: '', yak: '', shanav: '', nvul: '', nyat: '', kta: '', ktavatu: '', aniyar: ''},
    // тут непонятка. Первый aNk на самом деле д.б. aNka
    // FIXME: где разместить инф о гане? И как использовать? aNk-BvAdi-1, а aNka-curAdi-10

    'BU': {tric: 'भवितृ', tavyat: 'भवितव्य', yak: 'भूयमान', shanu: 'भवत्', shanac: 'भूमान', nvul: 'भावक', nyat: 'भाव्य', yat: 'भाव्य', kta: 'भूत', aniyar: 'भवनीय'},
    'buD': {tric: 'बोधितृ', tavyat: 'बोधितव्य', yak: 'बुध्यमान', shanu: 'बोधत्', shanac: 'बोधत्', nvul: 'बोधक', nyat: 'बोध्य', yat: 'बोध्य', kta: 'बोधित', aniyar: 'बोधनीय'},
    'smf': {tric: 'स्मर्तृ', tavyat: 'स्मर्तव्य', yak: 'स्मर्यमाण', shanu: 'स्मरत्', shanac: 'स्मर्यमाण', nvul: 'स्मारक', nyat: 'स्मर्य', kta: 'स्मृत', ktavatu: 'स्मृतवत्', aniyar: 'स्मरणीय'},
    // FIXME: проверить FEM -tr-tri
    //'smf-fem': {tric: 'स्मर्त्री', tavyat: 'स्मर्तव्या', yak: 'स्मर्यमाणा', shanu: 'स्मरन्ती', shanac: 'स्मर्यमाण', nvul: 'स्मारिका', nyat: 'स्मर्या', kta: 'स्मृता', ktavatu: 'स्मृतवती', aniyar: 'स्मरणीया'},

    'nI': {tric: 'नेतृ', tavyat: 'नेतव्य', yak: 'नीयमान', shanu: 'नयत्', shanac: 'नयमान', nvul: 'नायक', yat: 'नेय', kta: 'नीत', ktavatu: 'नीतवत्', aniyar: 'नयनीय'},
    'ruh': {tric: 'रोढृ', tavyat: 'रोढव्य', yak: 'रुह्यमाण', shanu: 'रोहत्', nvul: 'रोहत्', nyat: 'रोहक', kta: 'रूढ', ktavatu: 'रूढवत्', aniyar: 'रोहणीय'},
    'vfD': {tric: 'वर्धितृ', tavyat: 'वर्धितव्य', yak: 'वृध्यमान', shanac: 'वर्धमान', nvul: 'वर्धक', nyat: 'वृध्य', yat: 'वृध्य', kta: 'वृद्ध', ktavatu: 'वृद्धवत्', aniyar: 'वर्धनीय'},
    'gam': {tric: 'गन्तृ', tavyat: 'गन्तव्य', yak: 'गम्यमान', shanu: 'गच्छत्', nvul: 'गामक', yat: 'गम्य', kta: 'गत', ktavatu: 'गतवत्', aniyar: 'गमनीय'},
    // 'sad' - нет результата
    'sTA': {tric: 'स्थातृ', tavyat: 'स्थातव्य', yak: 'स्थीयमान', shanu: 'तिष्ठत्', nvul: 'स्थायक', yat: 'स्थेय', kta: 'स्थित', ktavatu: 'स्थितवत्', aniyar: 'स्थानीय'},

    //'': {tric: '', tavyat: '', yak: '', shanu: '', shanac: '', nvul: '', nyat: '', kta: '', ktavatu: '', aniyar: ''},
    //'': {tric: '', tavyat: '', yak: '', shanu: '', shanac: '', nvul: '', nyat: '', yat: '', kta: '', ktavatu: '', aniyar: ''},
    //'': {tric: '', tavyat: '', yak: '', shanu: '', nvul: '', nyat: '', kta: '', ktavatu: '', aniyar: ''},
    // 10 минут на один dhatu

    //'': {tric: '', tavyat: '', yak: '', shanu: '', nvul: '', nyat: '', kta: '', ktavatu: '', aniyar: ''},
    //'': {tric: '', tavyat: '', yak: '', shanu: '', nvul: '', nyat: '', kta: '', ktavatu: '', aniyar: ''},

    //'': {tric: '', tavyat: '', yak: '', shanu: '', nvul: '', nyat: '', kta: '', ktavatu: '', aniyar: ''},
    //'': {tric: '', tavyat: '', yak: '', shanu: '', nvul: '', nyat: '', kta: '', ktavatu: '', aniyar: ''},

}

describe(desc, function() {
    utils.kri9suff(tests, desc);
});
