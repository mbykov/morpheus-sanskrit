var utils = require('../utils');
var desc = 'tva'; // ri
// taddhita-tva - singular neuter -  impersonal substantives
// http://sanskrit.jnu.ac.in/elearning/thak_pratyay.html
// make test g=tadd_tva_

var tests = [

    ['amla', 'अम्ल', 'amlatvam', 'अम्लत्वम्'],
    ['asura', 'असुर', 'asuratvam', 'असुरत्वम्'],
    ['anukUla', 'अनुकूल', 'anukUlatvam', 'अनुकूलत्वम्'],
    ['AtmIya', 'आत्मीय', 'atmIyatvam', 'अत्मीयत्वम्'], // FIXME: здесь обратный ход - a->A, метод или исключение?
    ['ISvara', 'ईश्वर', 'ISvaratvam', 'ईश्वरत्वम्'],
    ['uzRa', 'उष्ण', 'uzRatvam', 'उष्णत्वम्'],
    ['ucca', 'उच्च', 'uccatvam', 'उच्चत्वम्'],
    ['fju', 'ऋजु', 'fjutvam', 'ऋजुत्वम्'],
    ['kawu', 'कटु', 'kawutvam', 'कटुत्वम्'],
    ['eka', 'एक', 'ekatvam', 'एकत्वम्'],
    ['kuSala', 'कुशल', 'kuSalatvam', 'कुशलत्वम्'],
    ['komala', 'कोमल', 'komalatvam', 'कोमलत्वम्'],
    ['kazAya', 'कषाय', 'kazAyatvam', 'कषायत्वम्'],
    ['kaWora', 'कठोर', 'kaWoratvam', 'कठोरत्वम्'],
    ['kavi', 'कवि', 'kavitvam', 'कवित्वम्'],
    ['kurUpa', 'कुरूप', 'kurupatvam', 'कुरुपत्वम्'],
    ['kfSa', 'कृश', 'kfSatvam', 'कृशत्वम्'],
    ['kfzRa', 'कृष्ण', 'kfzRatvam', 'कृष्णत्वम्'],
    ['krUra', 'क्रूर', 'krUratvam', 'क्रूरत्वम्'],
    ['kfpaRa', 'कृपण', 'kfpaRatvam', 'कृपणत्वम्'],
    ['kanizWa', 'कनिष्ठ', 'kanizWatvam', 'कनिष्ठत्वम्'],

    ['dAsa', 'दास', 'dAsatvam', 'दासत्वम्'],
    ['Kinna', 'खिन्न', 'Kinnatvam', 'खिन्नत्वम्'],
    ['guru', 'गुरु', 'gurutvam', 'गुरुत्वम्'],
    ['go', 'गो', 'gotvam', 'गोत्वम्'],
    ['cAru', 'चारु', 'cArutvam', 'चारुत्वम्'], // тут в тексте cArU-cArUtva. Это неверно, но если где-то действ. U долгое?
    ['citra', 'चित्र', 'citratvam', 'चित्रत्वम्'],
    ['capala', 'चपल', 'capalatvam', 'चपलत्वम्'],
    // ['caMcala', 'चंचल', 'caMcalatvam', 'चंचलत्वम्'], // ca?cala
    // ['Cina', 'छिन', 'Cinnatvam', 'छिन्नत्वम्'],
    ['Cala', 'छल', 'Calatvam', 'छलत्वम्'],
    ['jaqa', 'जड', 'jaqatvam', 'जडत्वम्'],
    ['jAtIya', 'जातीय', 'jAtIyatvam', 'जातीयत्वम्'],
    ['durjana', 'दुर्जन', 'durjanatvam', 'दुर्जनत्वम्'],
    ['duzwa', 'दुष्ट', 'duzwatvam', 'दुष्टत्वम्'],
    ['durlaBa', 'दुर्लभ', 'durlaBatvam', 'दुर्लभत्वम्'],
    ['dIrGa', 'दीर्घ', 'dIrGatvam', 'दीर्घत्वम्'],
    ['divya', 'दिव्य', 'divyatvam', 'दिव्यत्वम्'],

    ['dIna', 'दीन', 'dInatvam', 'दीनत्वम्'],
    ['deva', 'देव', 'devatvam', 'देवत्वम्'],
    ['dakza', 'दक्ष', 'dakzatvam', 'दक्षत्वम्'],
    ['nija', 'निज', 'nijatvam', 'निजत्वम्'],
    ['nIca', 'नीच', 'nIcatvam', 'नीचत्वम्'],
    ['pfzWa', 'पृष्ठ', 'pfzWatvam', 'पृष्ठत्वम्'],
    ['pawu', 'पटु', 'pawutvam', 'पटुत्वम्'],
    ['pIna', 'पीन', 'pInatvam', 'पीनत्वम्'],
    ['puruza', 'पुरुष', 'puruzatvam', 'पुरुषत्वम्'],
    ['pravIRa', 'प्रवीण', 'pravIRatvam', 'प्रवीणत्वम्'],
    ['pUrRa', 'पूर्ण', 'pUrRatvam', 'पूर्णत्वम्'],
    ['para', 'पर', 'paratvam', 'परत्वम्'],
    ['pfTu', 'पृथु', 'pfTutvam', 'पृथुत्वम्'],
    ['piSAca', 'पिशाच', 'piSAcatvam', 'पिशाचत्वम्'],

    ['prasanna', 'प्रसन्न', 'prasannatvam', 'प्रसन्नत्वम्'],
    ['priya', 'प्रिय', 'priyatvam', 'प्रियत्वम्'],
    ['paSu', 'पशु', 'paSutvam', 'पशुत्वम्'],

    ['Pala', 'फल', 'Palatvam', 'फलत्वम्'],
    ['banDu', 'बन्धु', 'banDutvam', 'बन्धुत्वम्'],
    ['brAhmaRa', 'ब्राह्मण', 'brAhmaRatvam', 'ब्राह्मणत्वम्'],
    ['vaDira', 'वधिर', 'vaDiratvam', 'वधिरत्वम्'],
    ['BIru', 'भीरु', 'BIrutvam', 'भीरुत्वम्'],
    ['Binna', 'भिन्न', 'Binnatvam', 'भिन्नत्वम्'],
    ['mitra', 'मित्र', 'mitratvam', 'मित्रत्वम्'],
    ['manuzya', 'मनुष्य', 'manuzyatvam', 'मनुष्यत्वम्'],
    ['mAnava', 'मानव', 'mAnavatvam', 'मानवत्वम्'],
    ['mahat', 'महत्', 'mahatvam', 'महत्वम्'],
    ['mfdu', 'मृदु', 'mfdutvam', 'मृदुत्वम्'],
    ['mUrKa', 'मूर्ख', 'mUrKatvam', 'मूर्खत्वम्'],
    ['rasa', 'रस', 'rasatvam', 'रसत्वम्'],

    ['ripu', 'रिपु', 'riputvam', 'रिपुत्वम्'],
    ['laGu', 'लघु', 'laGutvam', 'लघुत्वम्'],
    ['vESya', 'वैश्य', 'vESyatvam', 'वैश्यत्वम्'],
    ['vidvas', 'विद्वस्', 'vidvatvam', 'विद्वत्वम्'],
    ['vIra', 'वीर', 'vIratvam', 'वीरत्वम्'],
    ['viSAla', 'विशाल', 'viSAlatvam', 'विशालत्वम्'],
    ['vizAda', 'विषाद', 'vizAdatvam', 'विषादत्वम्'],
    ['vizaRRa', 'विषण्ण', 'vizaRRatvam', 'विषण्णत्वम्'],
    ['vyakti', 'व्यक्ति', 'vyaktitvam', 'व्यक्तित्वम्'],
    ['vakra', 'वक्र', 'vakratvam', 'वक्रत्वम्'],
    ['vipula', 'विपुल', 'vipulatvam', 'विपुलत्वम्'],
    ['SUra', 'शूर', 'SUratvam', 'शूरत्वम्'],
    ['Satru', 'शत्रु', 'Satrutvam', 'शत्रुत्वम्'],
    ['SUdra', 'शूद्र', 'SUdratvam', 'शूद्रत्वम्'],
    ['SiSu', 'शिशु', 'SiSutvam', 'शिशुत्वम्'],

    ['Suzka', 'शुष्क', 'Suzkatvam', 'शुष्कत्वम्'],
    ['SUnya', 'शून्य', 'SUnyatvam', 'शून्यत्वम्'],
    ['SItala', 'शीतल', 'SItalatvam', 'शीतलत्वम्'],
    ['SuBra', 'शुभ्र', 'SuBratvam', 'शुभ्रत्वम्'],
    ['SuBa', 'शुभ', 'SuBatvam', 'शुभत्वम्'],
    ['Sukla', 'शुक्ल', 'Suklatvam', 'शुक्लत्वम्'],
    ['sahAya', 'सहाय', 'sahAyatvam', 'सहायत्वम्'],
    ['sundara', 'सुन्दर', 'sundaratvam', 'सुन्दरत्वम्'],
    ['sADu', 'साधु', 'sADutvam', 'साधुत्वम्'],
    ['sva', 'स्व', 'svatvam', 'स्वत्वम्'],
    ['svADIna', 'स्वाधीन', 'svADInatvam', 'स्वाधीनत्वम्'],
    ['snigDa', 'स्निग्ध', 'snigDatvam', 'स्निग्धत्वम्'],
    ['sajjana', 'सज्जन', 'sajjanatvam', 'सज्जनत्वम्'],

    ['sOmya', 'सौम्य', 'sOmyatvam', 'सौम्यत्वम्'],
    ['sama', 'सम', 'samatvam', 'समत्वम्'],
    ['samAna', 'समान', 'samAnatvam', 'समानत्वम्'],
    ['sTira', 'स्थिर', 'sTiratvam', 'स्थिरत्वम्'],
    ['hIna', 'हीन', 'hInatvam', 'हीनत्वम्'],

];

describe(desc, function() {
    utils.taddhita(tests, desc);
});
