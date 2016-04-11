var utils = require('../utils');
var desc = 'inf';


var tests = {
    'han': { dhatu: 'हन्', stem: 'हन्तुम्' },
    'i': { dhatu: 'इ', stem: 'एतुम्' },
    'kf': { dhatu: 'कृ', stem: 'कर्तुम्' },
    'car': { dhatu: 'चर्', stem: 'चरितुम्' },
    'BU': { dhatu: 'भू', stem: 'भवितुम्' },
    'dah': { dhatu: 'दह्', stem: 'दग्धुम्' },
    'Bid': { dhatu: 'भिद्', stem: 'भेत्तुम्' }, // break
    'pat': { dhatu: 'पत्', stem: 'पतितुम्' },
    'yAc': { dhatu: 'याच्', stem: 'याचितुम्' },
    'man': { dhatu: 'मन्', stem: 'मन्तुम्' },
    'vah': { dhatu: 'वह्', stem: 'वोढुम्' },
    '': { dhatu: '', stem: '' },
    '': { dhatu: '', stem: '' },
    '': { dhatu: '', stem: '' },
    '': { dhatu: '', stem: '' },
    '': { dhatu: '', stem: '' },
}

describe(desc, function() {
    utils.zeroFlex(tests, desc);
});
