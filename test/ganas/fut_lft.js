var utils = require('../utils');
var desc = 'fut'


var tests = {
    'arT': {dhatu: 'अर्थ्', gana: 10, pres: 'अर्थयते', par: 'अर्थयिष्यति', atm: 'अर्थयिष्यते'},
    'iz': {dhatu: 'इष्', gana: 1, pres: 'एषति', par: 'एषिष्यति', atm: 'एषिष्यते'},
    'Ikz': {dhatu: 'ईक्ष्', gana: 1, pres: 'ईक्षते', par: '', atm: 'ईक्षिष्यते'},
    'kaT': {dhatu: 'कथ्', gana: 10, pres: 'कथयति', par: 'कथयिष्यति', atm: 'कथयिष्यते'},
    'kup': {dhatu: 'कुप्', gana: 10, pres: 'कोपयति', par: 'कोपयिष्यति', atm: ''},
    'kfp': {dhatu: 'कृष्', gana: 6, pres: 'कृपयते', par: '', atm: 'कर्पयिष्यते'}, // оплакивать; в MW в pres дана форма kfpayate,
    'kft': {dhatu: 'कृत्', gana: 7, pres: 'कृणत्ति', par: 'कर्तिष्यति', atm: 'कर्तिष्यते'},
    'kliS': {dhatu: 'क्लिश्', gana: 9, pres: 'क्लिश्नाति', par: 'क्लेशिष्यति', atm: ''},
    'kzal': {dhatu: 'क्षल्', gana: 10, pres: 'क्षालयति', par: 'क्षालयिष्यति', atm: 'क्षालयिष्यते'}, // wash, MW क्षालय
    'kzip': {dhatu: 'क्षिप्', gana: 6, pres: 'क्षिपति', par: 'क्षेप्स्यति', atm: 'क्षेप्स्यते'},
    'Kan': {dhatu: 'खन्', gana: 1, pres: 'खनति', par: 'खनिष्यति', atm: 'खनिष्यते'},
    'KAd': {dhatu: 'खाद्', gana: 1, pres: 'खादति', par: 'खादिष्यति', atm: ''},
    'Kid': {dhatu: 'खिद्', gana: 6, pres: 'खिदति', par: 'खेत्स्यति', atm: ''}, // MW Kidati
    'gaR': {dhatu: 'गण्', gana: 10, pres: 'गणयति', par: 'गणयिष्यति', atm: 'गणयिष्यते'},
    'gam': {dhatu: 'गम्', gana: 1, pres: 'गच्छति', par: 'गमिष्यति', atm: 'गमिष्यते'},
    'gAh': {dhatu: 'गाह्', gana: 1, pres: 'गाहते', par: '', atm: 'गाहिष्यते'},
    'gras': {dhatu: 'ग्रस्', gana: 1, pres: 'ग्रसति', par: 'ग्रसिष्यति', atm: 'ग्रसिष्यते'},
    'Guz': {dhatu: 'घुष्', gana: 1, pres: 'घोषति', par: 'घोषिष्यति-घोक्ष्यति', atm: ''},
    'cal': {dhatu: 'चल्', gana: 1, pres: 'चलति', par: 'चलिष्यति', atm: ''},
    'cint': {dhatu: 'चिन्त्', gana: 10, pres: 'चिन्तयति', par: '', atm: ''}, // нету
    'cur': {dhatu: 'चुर्', gana: 10, pres: 'चोरयति', par: 'चोरयिष्यति', atm: 'चोरयिष्यते'},
    'jan': {dhatu: 'जन्', gana: 1, pres: 'जनति', par: 'जास्यति-जनिष्यति', atm: 'जास्यते-जनिष्यते'},
    'ji': {dhatu: 'जि', gana: 1, pres: 'जयति', par: 'जेष्यति-जयिष्यति', atm: 'जेष्यते-जयिष्यते'},
    // дальше primer, p.140
    'jIv': {dhatu: 'जीव्', gana: 1, pres: 'जीवति', par: 'जीविष्यति', atm: ''},
    'jval': {dhatu: 'ज्वल्', gana: 1, pres: 'ज्वलति', par: 'ज्वलिष्यति', atm: ''},
    'tud': {dhatu: 'तुद्', gana: 6, pres: 'तुदति', par: '', atm: ''}, // ---
    'tuz': {dhatu: 'तुष्', gana: 4, pres: 'तुष्यति', par: 'तोक्ष्यति', atm: ''},
    'tyaj': {dhatu: 'त्यज्', gana: 1, pres: 'त्यजति', par: 'त्यजिष्यति-त्यक्ष्यति', atm: ''},
    'daMs': {dhatu: 'दंस', gana: 10, pres: 'दंसयति', par: 'दंसयिष्यति', atm: ''},
    'dah': {dhatu: 'दह्', gana: 1, pres: 'दहति', par: 'धक्ष्यति-दहिष्यति', atm: ''},
    'dA': {dhatu: 'दा', gana: 3, pres: 'ददाति', par: 'दास्यति', atm: 'दास्यते'},
    'div': {dhatu: 'दिव्', gana: 4, pres: 'दीव्यति', par: 'देविष्यति', atm: 'देविष्यते'}, // MW dIvyati
    'diS': {dhatu: 'दिश्', gana: 1, pres: 'दिदेष्टि', par: 'देक्ष्यति', atm: ''}, // и в MW, и в inria - didwzwi, образуется diz, а не diS
    'dfS': {dhatu: 'दृश्', gana: 1, pres: 'दर्शति', par: 'द्रक्ष्यति', atm: ''}, // MW darSayati
    'Dav': {dhatu: 'धव्', gana: 1, pres: 'धवति', par: 'धविष्यति', atm: ''},
    'Df': {dhatu: 'धृ', gana: 1, pres: 'धरति', par: 'धरिष्यति', atm: 'धरिष्यते'},
    'nam': {dhatu: 'नम्', gana: 1, pres: 'नमति', par: 'नमिष्यति-नंस्यति', atm: ''},
    'naS': {dhatu: 'नश्', gana: 4, pres: 'नश्यति', par: 'नशिष्यति', atm: ''},
    'nind': {dhatu: 'निन्द्', gana: 1, pres: 'निन्दति', par: 'निन्दिष्यति', atm: ''},
    //'nI': {dhatu: '', gana: 1, pres: '', par: '', atm: ''},  // MW - nyeti - which gana?
    'nud': {dhatu: 'नुद्', gana: 6, pres: 'नुदति', par: 'नोत्स्यति', atm: 'नोत्स्यते'},
    'nft': {dhatu: 'नृत्', gana: 4, pres: 'नृत्यति', par: 'नर्त्स्यति-नर्तिष्यति', atm: ''},
    'pac': {dhatu: 'पच्', gana: 1, pres: 'पचति', par: 'पक्ष्यति', atm: 'पक्ष्यते'},
    'paW': {dhatu: 'पठ्', gana: 1, pres: 'पठति', par: 'पठिष्यति', atm: ''}, // read aloud
    'pat': {dhatu: 'पत्', gana: 1, pres: 'पतति', par: 'पतिष्यति', atm: ''}, // fall, fly
    'pA': {dhatu: 'पा', gana: 2, pres: 'पाति', par: 'पास्यति', atm: ''}, // watch
    'pal': {dhatu: 'पाल्', gana: 10, pres: 'पालयति', par: 'पालयिष्यति', atm: 'पालयिष्यते'},
    'puz': {dhatu: 'पुष्', gana: 10, pres: 'पोषति', par: 'पोषिष्यति', atm: 'पोषिष्यते'}, // nourish
    'pUj': {dhatu: 'पूज्', gana: 10, pres: 'पूजयिष्यति', par: 'पूजयिष्यते', atm: ''},
    // pracC ?
    'bud': {dhatu: 'बुध्', gana: 1, pres: 'बोधति', par: 'भोत्स्यति', atm: 'भोत्स्यते'},
    'Bakz': {dhatu: 'भक्ष्', gana: 10, pres: 'भक्षयति', par: 'भक्षयिष्यति', atm: ''},
    'BAz': {dhatu: 'भाष्', gana: 1, pres: 'भाषयते', par: 'भाषयिष्यते', atm: ''},
    'BU': {dhatu: 'भू', gana: 1, pres: 'भवति', par: 'भविष्यति', atm: ''},
    'BUz': {dhatu: 'भूष्', gana: 1, pres: 'भूषति', par: 'भूषिष्यति', atm: ''},
    'Bram': {dhatu: 'भ्रम्', gana: 1, pres: 'भ्रमति', par: 'भ्रमिष्यति', atm: ''},
    'man': {dhatu: 'मन्', gana: 8, pres: 'मनुते', par: 'मनिष्यति-मंस्यति', atm: 'मनिष्यते-मंस्यते'},
    'mantr': {dhatu: 'मन्त्र्', gana: 1, pres: 'मन्त्रयति', par: 'मन्त्रयिष्यति', atm: 'मन्त्रयिष्यते'},
    // p.141
    '': {dhatu: '', gana: 1, pres: '', par: '', atm: ''},
    '': {dhatu: '', gana: 1, pres: '', par: '', atm: ''},
    '': {dhatu: '', gana: 1, pres: '', par: '', atm: ''},
    '': {dhatu: '', gana: 1, pres: '', par: '', atm: ''},
    '': {dhatu: '', gana: 1, pres: '', par: '', atm: ''},
    '': {dhatu: '', gana: 1, pres: '', par: '', atm: ''},
    '': {dhatu: '', gana: 1, pres: '', par: '', atm: ''},
    '': {dhatu: '', gana: 1, pres: '', par: '', atm: ''},
    '': {dhatu: '', gana: 1, pres: '', par: '', atm: ''},
    '': {dhatu: '', gana: 1, pres: '', par: '', atm: ''},
    '': {dhatu: '', gana: 1, pres: '', par: '', atm: ''},
    '': {dhatu: '', gana: 1, pres: '', par: '', atm: ''},
    '': {dhatu: '', gana: 1, pres: '', par: '', atm: ''},
    '': {dhatu: '', gana: 1, pres: '', par: '', atm: ''},
    '': {dhatu: '', gana: 1, pres: '', par: '', atm: ''},
    '': {dhatu: '', gana: 1, pres: '', par: '', atm: ''},
    '': {dhatu: '', gana: 1, pres: '', par: '', atm: ''},
}

describe(desc, function() {
    utils.fireFutOrd(tests, desc);
});
