var utils = require('../utils');
var desc = 'thak';
// taddhita-tha
// http://sanskrit.jnu.ac.in/elearning/thak_pratyay.html
//ठक् and ठञ् affixes are added to naming words ended in अ in order to express different meanings.
// Of these two affixes only ठ remains and by the aphorism "ठस्येक" ठ becomes इक् .

var tests = [

    ['Darma', 'धर्म', 'DArmikaH', 'धार्मिकः'],
    ['itihAsa', 'इतिहास', 'EtihAsikaH', 'ऐतिहासिकः'],
    ['uzas', 'उषस्', 'OzasikaH', 'औषसिकः'],
    ['vftta', 'वृत्त', 'vArttikaH', 'वार्त्तिकः'],
    ['revata', 'रेवत', 'rEvatikaH', 'रैवतिकः'],
    ['aSvapAla', 'अश्वपाल', 'ASvapAlikaH', 'आश्वपालिकः'],
    ['dvArapAla', 'द्वारपाल', 'dvArapAlikaH', 'द्वारपालिकः'],
    ['marica', 'मरिच', 'mAricikaH', 'मारिचिकः'],
    ['daDa', 'दध', 'daDikaH', 'दधिकः'],
    ['hasta', 'हस्त', 'hAstikaH', 'हास्तिकः'],
    ['Sakawa', 'शकट', 'SAkawikaH', 'शाकटिकः'],
    ['Sabda', 'शब्द', 'SAbdikaH', 'शाब्दिकः'],
    ['dardura', 'दर्दुर', 'dArdurikaH', 'दार्दुरिकः'],

    ['badara', 'बदर', 'vAdarikaH', 'वादरिकः'],
    ['samAja', 'समाज', 'sAmAjikaH', 'सामाजिकः'],
    ['aDarma', 'अधर्म', 'aDArmikaH', 'अधार्मिकः'],
    ['pakza', 'पक्ष', 'pAkzikaH', 'पाक्षिकः'],
    ['Sakuna', 'शकुन', 'SAkunikaH', 'शाकुनिकः'],
    ['mayUra', 'मयूर', 'mAyUrikaH', 'मायूरिकः'],
    ['matsya', 'मत्स्य', 'mAtsyikaH', 'मात्स्यिकः'],
    ['mIna', 'मीन', 'mEnikaH', 'मैनिकः'],
    ['mfga', 'मृग', 'mArgikaH', 'मार्गिकः'],
    ['hariRa', 'हरिण', 'hAriRikaH', 'हारिणिकः'],

    ['asta', 'अस्त', 'AstikaH', 'आस्तिकः'],
    ['nasta', 'नस्त', 'nAstikaH', 'नास्तिकः'],
    ['dizwa', 'दिष्ट', 'dEzwikaH', 'दैष्टिकः'],
    ['Akara', 'आकर', 'AkarikaH', 'आकरिकः'],
    ['nikawa', 'निकट', 'nEkawikaH', 'नैकटिकः'],
    ['paradAra', 'परदार', 'pAradArikaH', 'पारदारिकः'],
    ['gurutalpa', 'गुरुतल्प', 'gOratalpikaH', 'गौरतल्पिकः'],
    ['nyAya', 'न्याय', 'nEyAyikaH', 'नैयायिकः'],
    ['vftta', 'वृत्त', 'vArtikaH', 'वार्तिकः'],
    ['veda', 'वेद', 'vEdikaH', 'वैदिकः'],
    ['purARa', 'पुराण', 'pOrARikaH', 'पौराणिकः'],
    ['lakza', 'लक्ष', 'lAkzikaH', 'लाक्षिकः'],

    ['rocana', 'रोचन', 'rocanikaH', 'रोचनिकः'],
    ['Sakala', 'शकल', 'SAkalikaH', 'शाकलिकः'],
    ['kardama', 'कर्दम', 'kArdamikaH', 'कार्दमिकः'],
    ['sapta', 'सप्त', 'sAptikaH', 'साप्तिकः'],
    ['yajYa', 'यज्ञ', 'yAjYikaH', 'याज्ञिकः'],

    ['akza', 'अक्ष', 'AkzikaH', 'आक्षिकः'],

    ['darSana', 'दर्शन', 'dArSanikaH', 'दार्शनिकः'],
    ['Sata', 'शत', 'SAtikaH', 'शातिकः'],

    ['nagara', 'नगर', 'nAgarikaH', 'नागरिकः'],
    ['aDyAtma', 'अध्यात्म', 'aDyAtmikaH', 'अध्यात्मिकः'],
    ['BAva', 'भाव', 'BAvikaH', 'भाविकः'],
    ['mAsa', 'मास', 'mAsikaH', 'मासिकः'],
    ['varza', 'वर्ष', 'vArzikaH', 'वार्षिकः'],
    ['saptAha', 'सप्ताह', 'sAptAhikaH', 'साप्ताहिकः'],
    ['SarIra', 'शरीर', 'SArIrikaH', 'शारीरिकः'],
    ['saMsAra', 'संसार', 'sAMsArikaH', 'सांसारिकः'],
    ['prasTa', 'प्रस्थ', 'prAsTikaH', 'प्रास्थिकः'],
    ['paraloka', 'परलोक', 'pAralOkikaH', 'पारलौकिकः'],
    ['paRa', 'पण', 'pARikaH', 'पाणिकः'],
    ['mAnasa', 'मानस', 'mAnasikaH', 'मानसिकः'],

    ['parivAra', 'परिवार', 'pArivArikaH', 'पारिवारिकः'],

    ['prakfta', 'प्रकृत', 'prAkftikaH', 'प्राकृतिकः'],
    ['mArica', 'मारिच', 'mAricikaH', 'मारिचिकः'],
    // ['nAsti', 'नास्ति', 'nAstikaH', 'नास्तिकः'], // FIXME: ? nAsti - indecl ?

    ['pramARa', 'प्रमाण', 'prAmARikaH', 'प्रामाणिकः'],
    ['kAya', 'काय', 'kAyikaH', 'कायिकः'],
    ['sAhitya', 'साहित्य', 'sAhityikaH', 'साहित्यिकः'],
    ['pradeSa', 'प्रदेश', 'prAdeSikaH', 'प्रादेशिकः'],
    ['Atma', 'आत्म', 'AtmikaH', 'आत्मिकः'], // FIXME: в словаре это не субстантив.
    ['iha', 'इह', 'EhikaH', 'ऐहिकः'], // FIXME: indecl ?
    ['tarka', 'तर्क', 'tArkikaH', 'तार्किकः'],

    ['dina', 'दिन', 'dEnikaH', 'दैनिकः'],
    ['viSeza', 'विशेष', 'vESezikaH', 'वैशेषिकः'],
    ['samaya', 'समय', 'sAmayikaH', 'सामयिकः'],
    ['viDAna', 'विधान', 'vEDAnikaH', 'वैधानिकः'],
    ['nIta', 'नीत', 'nEtikaH', 'नैतिकः'],

    ['loka', 'लोक', 'lOkikaH', 'लौकिकः'],
    ['uqupa', 'उडुप', 'OqupikaH', 'औडुपिकः'],
    ['BUma', 'भूम', 'BOmikaH', 'भौमिकः'],
    ['BUgola', 'भूगोल', 'BOgolikaH', 'भौगोलिकः'],

    ['deha', 'देह', 'dEhikaH', 'दैहिकः'],
    ['deva', 'देव', 'dEvikaH', 'दैविकः'],

    ['aByantara', 'अभ्यन्तर', 'AByantarikaH', 'आभ्यन्तरिकः'],

    ['tatkAla', 'तत्काल', 'tAtkAlikaH', 'तात्कालिकः'],
    ['vetana', 'वेतन', 'vEtanikaH', 'वैतनिकः'],
    ['muKa', 'मुख', 'mOKikaH', 'मौखिकः'],
    ['icCA', 'इच्छा', 'EcCikaH', 'ऐच्छिकः'],

    ['vyavasAya', 'व्यवसाय', 'vyAvasAyikaH', 'व्यावसायिकः'],

    ['nAva', 'नाव', 'nAvikaH', 'नाविकः'],
    ['vijYAna', 'विज्ञान', 'vEjYAnikaH', 'वैज्ञानिकः'],
    ['indrajAla', 'इन्द्रजाल', 'EndrajAlikaH', 'ऐन्द्रजालिकः'],

    ['aSIta', 'अशीत', 'ASItikaH', 'आशीतिकः'],
    ['prAramBa', 'प्रारम्भ', 'prAramBikaH', 'प्रारम्भिकः'],
    ['navata', 'नवत', 'nAvatikaH', 'नावतिकः'],
    ['vyavahAra', 'व्यवहार', 'vyAvahArikaH', 'व्यावहारिकः'],
    ['sena', 'सेन', 'sEnikaH', 'सैनिकः'],
    ['samudra', 'समुद्र', 'sAmudrikaH', 'सामुद्रिकः'],

];

describe(desc, function() {
    utils.taddhita(tests, desc);
});
