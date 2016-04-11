var utils = require('./utils');
var desc = 'ppp';


var tests = {
    'smf': { dhatu: 'स्मृ', masc: 'स्मृतः', 'fem': 'स्मृता' },
    'dA': { dhatu: 'दा', masc: 'दत्तः', fem: 'दत्ता' },
    'vac': { dhatu: 'वच्', masc: 'उक्तः', fem: 'उक्ता' },
    'gam': { dhatu: 'गम्', masc: 'गतः', fem: 'गता' },
    'BU': { dhatu: 'भू', masc: 'भूतः', fem: 'भूता' },
    'pat': { dhatu: 'पत्', masc: 'पतितः', fem: 'पतिता' },
    'aYj': { dhatu: 'अञ्ज्', masc: 'अक्तः', fem: 'अक्ता' }, // decorate
    'banD': { dhatu: 'बन्ध्', masc: 'बन्धितः', fem: '' }, // Whitny - badDa, inria - banDta, ?
    'SramB': { dhatu: 'श्रम्भ्', masc: 'श्रम्भितः', fem: 'श्रम्भिता' }, // the same
    'has': { dhatu: 'हस्', masc: 'हसितम्', fem: 'हसिता' }, // laugh
    'daMS': { dhatu: 'दंश्', masc: 'दंशितः', fem: 'दंशिता' },
    'sraMs': { dhatu: 'स्रंस्', masc: 'स्रंस्तः', fem: 'स्रंस्ता' },
    'baMh': { dhatu: 'बंह्', masc: 'बहितः', fem: 'बहिता' },
    'vap': { dhatu: 'वप्', masc: 'उप्तः', fem: 'उप्ता' },
    'vah': { dhatu: 'वह्', masc: 'ऊढः', fem: 'ऊढा' },
    'svap': { dhatu: 'स्वप्', masc: 'सुप्तः', fem: 'सुप्ता' },
    'yaj': { dhatu: 'यज्', masc: 'इष्टः', fem: 'इष्टा' },
    'vyaD': { dhatu: 'व्यध्', masc: 'विद्धः', fem: 'विद्धा' },
    'praC': { dhatu: 'प्रछ्', masc: 'प्रष्टः', fem: 'प्रष्टा' },
    'gE': { dhatu: 'गै', masc: 'गीतः', fem: 'गीता' },
    'DA': { dhatu: 'धा', masc: 'हितः', fem: 'हिता' },
    'pA': { dhatu: 'पा', masc: 'पीतः', fem: 'पीता' },
    'jyA': { dhatu: 'ज्या', masc: 'जीतः', fem: 'जीता' },
    'ji': { dhatu: 'जि', masc: 'जितः', fem: 'जिता' },
    'nam': { dhatu: 'नम्', masc: 'नतः', fem: 'नता' },
    'yam': { dhatu: 'यम्', masc: 'यतः', fem: 'यता' },
    'ram': { dhatu: 'रम्', masc: 'रतः', fem: 'रता' },
    'kzan': { dhatu: 'क्षन्', masc: 'क्षतः', fem: 'क्षता' },
    'tan': { dhatu: 'तन्', masc: 'तन्तः', fem: 'तन्ता' },
    'man': { dhatu: 'मन्', masc: 'मानः', fem: 'माना' },
    'han': { dhatu: 'हन्', masc: 'हतः', fem: 'हता' },
    'vA': { dhatu: 'वा', masc: 'वातः', fem: 'वाता' },
    'SAs': { dhatu: 'शास्', masc: 'शासितः', fem: 'शासिता' },
    'svad': { dhatu: 'स्वद्', masc: 'स्वदितः', fem: 'स्वदिता' },
    // FIXME: продолжить исключения и много всего еще начиная с W.955.a
    '': { dhatu: '', masc: '', fem: '' },
    '': { dhatu: '', masc: '', fem: '' },
    '': { dhatu: '', masc: '', fem: '' },
    '': { dhatu: '', masc: '', fem: '' },
    '': { dhatu: '', masc: '', fem: '' },
    '': { dhatu: '', masc: '', fem: '' },
    '': { dhatu: '', masc: '', fem: '' },
    '': { dhatu: '', masc: '', fem: '' },
    '': { dhatu: '', masc: '', fem: '' },
}

describe(desc, function() {
    utils.firePPP_list(tests, desc);
});
