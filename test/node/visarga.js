var utils = require('../utils');

var tests = [
    // अ & visarga changes to ओ+avagraha when followed by अ;
    {sutra: 'visarga-ah-a',
     descr: 'aH+a => o-ऽ',
     only: 'ext',
     tests: [
         ['शिवोऽहम्', 'शिवः', 'अहम्'],
         ['रामोऽस्ति', 'रामः', 'अस्ति'],
         ['गच्छतोऽश्वौ', 'गच्छतः', 'अश्वौ'],
         ['शिवोऽहम्', 'शिवः', 'अहम्'],
         ['देवोऽस्ति', 'देवः', 'अस्ति'],
         ['नरोऽश्वः', 'नरः', 'अश्वः'],
         ['', '', ''],
     ]
    },

    {sutra: 'visarga-ah-soft',
     descr: 'अ & visarga (for अस्) followed by a soft consonant -> changes to ओ',
     only: 'ext',
     tests: [
         ['नमो नारायणाय', 'नमः', 'नारायणाय'],
         ['रामो गच्छति', 'रामः', 'गच्छति'],
         ['नरो गच्छति', 'नरः', 'गच्छति'],
         ['नरो यच्छति', 'नरः', 'यच्छति'],
         ['नरो हसति', 'नरः', 'हसति'],
         ['रुद्रो वन्द्यः', 'रुद्रः', 'वन्द्यः'],
         ['प्राणायामो हितः', 'प्राणायामः', 'हितः'],
     ]
    },

    {sutra: 'visarga-ah-other',
     descr: 'अ & visarga (standing for अस्) followed by a vowel except अ -> visarga is dropped',
     only: 'ext',
     tests: [
         ['राम इच्छति', 'रामः', 'इच्छति'],
         ['राम उवाच', 'रामः', 'उवाच'],
         ['नर इच्छति', 'नरः', 'इच्छति'],
         ['शिव एति', 'शिवः', 'एति'],
         // ['शिवयेति', 'शिवः', 'एति'], // optional y after diphtong
         ['', '', ''],
     ]
    },

    // आ & visarga  (for आस्) is followed by a vowel or soft consonant - > dropped.
    {sutra: 'visarga-aah-vow',
     descr: '',
     only: 'ext',
     tests: [
         ['नरा अटन्ति', 'नराः', 'अटन्ति'],
         ['नरा गच्छन्ति', 'नराः', 'गच्छन्ति'],
         ['देवा निस्तारयन्ति', 'देवाः', 'निस्तारयन्ति'],
         ['अश्वा भवन्ति', 'अश्वाः', 'भवन्ति'],
         ['योगा आवश्यकाः', 'योगाः', 'आवश्यकाः'],
         ['', '', ''],
         ['', '', ''],
         ['', '', ''],
         ['', '', ''],
     ]
    },

    {sutra: 'visarga-hard-cons',
     descr: '(visarga) changes to (श्) (p sb) when followed by (च् or छ्) (p hc)',
     only: 'ext',
     tests: [
         ['रामश्च', 'रामः', 'च'],
         ['नरश्चरति', 'नरः', 'चरति'],
         ['शिवश्छायः', 'शिवः', 'छायः'],

         ['रामष्टीकते', 'रामः', 'टीकते'], // ष
         ['वरष्ठक्कुराणाम्', 'वरः', 'ठक्कुराणाम्'],
         ['सुन्दरष्टङ्कः', 'सुन्दरः', 'टङ्कः'],

         ['नमस्ते', 'नमः', 'ते'],
         ['नरस्तिष्ठति', 'नरः', 'तिष्ठति'],
         ['विष्णुस्त्राता', 'विष्णुः', 'त्राता'],
         ['नरस्थुत्थुकारकः', 'नरः', 'थुत्थुकारकः'],

         // optional - repeating beg
         ['नमश्शिवाय', 'नमः', 'शिवाय'],
         ['नमष्षणमुखाय', 'नमः', 'षणमुखाय'],
         ['', '', ''],
         ['', '', ''],
     ]
    },

    // to R нужно переделать, чтобы охватить все

    {sutra: 'visarga-r',
     descr: 'visarga for र्',
     only: 'ext',
     tests: [
         // visarga (for र्) after any vowel except अ or आ changes to र् when followed by a vowel or soft consonant except र्
         ['गणपतिरवतु', 'गणपतिः', 'अवतु'],
         ['रविरुदेति', 'रविः', 'उदेति'],
         ['गुरुर्ब्रह्मा', 'गुरुः', 'ब्रह्मा'],
         ['मनुर्गच्छति', 'मनुः', 'गच्छति'],
         // अ & visarga changes to अर् when followed by a vowel or soft consonant except र्
         ['पुनरपि', 'पुनः', 'अपि'],
         ['पितर्वदसि', 'पितः', 'वदसि'],
         ['मातरिन्दुं', 'मातः', 'इन्दुं'],
         // आ & visarga changes to आर् when followed by a (vowel or soft consonant except र्)
         ['द्वारत्र', 'द्वाः', 'अत्र'],
         ['द्वार्दृष्टा', 'द्वाः', 'दृष्टा'],
         ['', '', ''],
         ['', '', ''],
         ['', '', ''],
     ]
    },

    {sutra: '',
     descr: '',
     only: 'ext',
     tests: [
         ['', '', ''],
         ['', '', ''],
     ]
    },

]

describe('visarga_sandhi', function() {
    tests.forEach(function(t) {
        if (t.sutra == '') return;
        var descr = [t.sutra, t.descr, t.only].join(' - ');
        describe(descr, function() {
            t.tests.forEach(function(test, idx) {
                if (t.only) test.push(t.only);
                utils.test(test, idx);
            });
        });
    });
});
