var utils = require('../utils');
var desc = 'gerund';


var tests = {
    'gam': { dhatu: 'गम्', stem: 'गम्य-गत्वा' },
    'i': { dhatu: 'इ', stem: 'इत्य' },
    'tF': { dhatu: 'तॄ', stem: 'तीर्त्वा' },
    'pF': { dhatu: 'पॄ', stem: 'पूर्त्वा' },
    'dfS': { dhatu: 'दृश्', stem: 'दृष्ट्वा' },
    'KAd': { dhatu: 'खद्', stem: 'खादित्वा' }, // -itva
    'buD': { dhatu: 'बुध्', stem: 'बुद्ध्वा' },
    'laB': { dhatu: 'लभ्', stem: 'लब्ध्वा' },
    'pI': { dhatu: 'पी', stem: 'पीत्वा' },
    '': { dhatu: '', stem: '' },
    '': { dhatu: '', stem: '' },
    '': { dhatu: '', stem: '' },
    '': { dhatu: '', stem: '' },
    '': { dhatu: '', stem: '' },
    '': { dhatu: '', stem: '' },
    '': { dhatu: '', stem: '' },
    '': { dhatu: '', stem: '' },
}

describe(desc, function() {
    utils.zeroFlex(tests, desc);
});
