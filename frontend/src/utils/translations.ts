export interface Translation {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
  fontFamily?: string;
}

export const supportedLanguages: Translation[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    rtl: false
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    rtl: true,
    fontFamily: 'Arial, "Tahoma", sans-serif'
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    flag: '🇵🇰',
    rtl: true,
    fontFamily: 'Arial, "Tahoma", sans-serif'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    flag: '🇮🇳',
    rtl: false,
    fontFamily: '"Noto Sans Devanagari", Arial, sans-serif'
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '🇧🇩',
    rtl: false,
    fontFamily: '"Noto Sans Bengali", Arial, sans-serif'
  },
  {
    code: 'tl',
    name: 'Tagalog',
    nativeName: 'Tagalog',
    flag: '🇵🇭',
    rtl: false
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🇮🇳',
    rtl: false,
    fontFamily: '"Noto Sans Tamil", Arial, sans-serif'
  }
];

export const commonPhrases: Record<string, Record<string, string>> = {
  // Safety Categories
  'DANGER': {
    en: 'DANGER',
    ar: 'خطر',
    ur: 'خطرہ',
    hi: 'खतरा',
    bn: 'বিপদ',
    tl: 'PANGANIB',
    ta: 'ஆபத்து'
  },
  'WARNING': {
    en: 'WARNING',
    ar: 'تحذير',
    ur: 'انتباہ',
    hi: 'चेतावनी',
    bn: 'সতর্কতা',
    tl: 'BABALA',
    ta: 'எச்சரிக்கை'
  },
  'CAUTION': {
    en: 'CAUTION',
    ar: 'احتراس',
    ur: 'احتیاط',
    hi: 'सावधान',
    bn: 'সাবধান',
    tl: 'INGAT',
    ta: 'கவனம்'
  },
  'NOTICE': {
    en: 'NOTICE',
    ar: 'إشعار',
    ur: 'نوٹس',
    hi: 'सूचना',
    bn: 'বিজ্ঞপ্তি',
    tl: 'PAALALA',
    ta: 'அறிவிப்பு'
  },
  'EMERGENCY': {
    en: 'EMERGENCY',
    ar: 'طوارئ',
    ur: 'ایمرجنسی',
    hi: 'आपातकाल',
    bn: 'জরুরী',
    tl: 'EMERGENCY',
    ta: 'அவசரம்'
  },
  'MANDATORY': {
    en: 'MANDATORY',
    ar: 'إلزامي',
    ur: 'لازمی',
    hi: 'अनिवार्य',
    bn: 'বাধ্যতামূলক',
    tl: 'SAPILITAN',
    ta: 'கட்டாயம்'
  },
  'PROHIBITED': {
    en: 'PROHIBITED',
    ar: 'محظور',
    ur: 'ممنوع',
    hi: 'निषिद्ध',
    bn: 'নিষিদ্ধ',
    tl: 'BAWAL',
    ta: 'தடைசெய்யப்பட்டது'
  },
  
  // Common Safety Terms
  'AUTHORIZED PERSONNEL ONLY': {
    en: 'AUTHORIZED PERSONNEL ONLY',
    ar: 'للموظفين المصرح لهم فقط',
    ur: 'صرف مجاز اہلکار',
    hi: 'केवल अधिकृत कर्मचारी',
    bn: 'শুধুমাত্র অনুমোদিত কর্মী',
    tl: 'AWTORISADONG TAUHAN LAMANG',
    ta: 'அங்கீகரிக்கப்பட்ட பணியாளர்கள் மட்டும்'
  },
  'NO ENTRY': {
    en: 'NO ENTRY',
    ar: 'ممنوع الدخول',
    ur: 'داخلہ ممنوع',
    hi: 'प्रवेश निषेध',
    bn: 'প্রবেশ নিষেধ',
    tl: 'BAWAL PUMASOK',
    ta: 'நுழைவு தடை'
  },
  'HIGH VOLTAGE': {
    en: 'HIGH VOLTAGE',
    ar: 'جهد عالي',
    ur: 'ہائی وولٹیج',
    hi: 'उच्च वोल्टेज',
    bn: 'উচ্চ ভোল্টেজ',
    tl: 'MATAAS NA VOLTAGE',
    ta: 'அதிக மின்னழுத்தம்'
  },
  'WEAR SAFETY HELMET': {
    en: 'WEAR SAFETY HELMET',
    ar: 'ارتداء خوذة السلامة',
    ur: 'حفاظتی ہیلمٹ پہنیں',
    hi: 'सुरक्षा हेलमेट पहनें',
    bn: 'নিরাপত্তা হেলমেট পরুন',
    tl: 'MAGSUOT NG SAFETY HELMET',
    ta: 'பாதுகாப்பு தொப்பி அணியவும்'
  },
  'NO SMOKING': {
    en: 'NO SMOKING',
    ar: 'ممنوع التدخين',
    ur: 'تمباکو نوشی ممنوع',
    hi: 'धूम्रपान निषेध',
    bn: 'ধূমপান নিষেধ',
    tl: 'BAWAL MANIGARILYO',
    ta: 'புகைபிடித்தல் தடை'
  },
  'EMERGENCY EXIT': {
    en: 'EMERGENCY EXIT',
    ar: 'مخرج الطوارئ',
    ur: 'ایمرجنسی باہر نکلنے کا راستہ',
    hi: 'आपातकालीन निकास',
    bn: 'জরুরী প্রস্থান',
    tl: 'EMERGENCY EXIT',
    ta: 'அவசர வெளியேற்றம்'
  },
  'FIRST AID': {
    en: 'FIRST AID',
    ar: 'الإسعافات الأولية',
    ur: 'ابتدائی طبی امداد',
    hi: 'प्राथमिक चिकित्सा',
    bn: 'প্রাথমিক চিকিৎসা',
    tl: 'FIRST AID',
    ta: 'முதலுதவி'
  },
  'FIRE EXTINGUISHER': {
    en: 'FIRE EXTINGUISHER',
    ar: 'طفاية الحريق',
    ur: 'آگ بجھانے کا آلہ',
    hi: 'अग्निशामक यंत्र',
    bn: 'অগ্নিনির্বাপক',
    tl: 'FIRE EXTINGUISHER',
    ta: 'தீயணைப்பு கருவி'
  },
  'CONFINED SPACE': {
    en: 'CONFINED SPACE',
    ar: 'مكان محصور',
    ur: 'محدود جگہ',
    hi: 'सीमित स्थान',
    bn: 'সীমাবদ্ধ স্থান',
    tl: 'CONFINED SPACE',
    ta: 'வரையறுக்கப்பட்ட இடம்'
  },
  'PPE REQUIRED': {
    en: 'PPE REQUIRED',
    ar: 'معدات الحماية الشخصية مطلوبة',
    ur: 'حفاظتی سامان ضروری',
    hi: 'व्यक्तिगत सुरक्षा उपकरण आवश्यक',
    bn: 'ব্যক্তিগত সুরক্षা সরঞ্জাম প্রয়োজন',
    tl: 'KAILANGAN ANG PPE',
    ta: 'தனிப்பட்ட பாதுகாப்பு உபகரணங்கள் தேவை'
  },
  
  // Hazard Types
  'CHEMICAL HAZARD': {
    en: 'CHEMICAL HAZARD',
    ar: 'خطر كيميائي',
    ur: 'کیمیائی خطرہ',
    hi: 'रासायनिक खतरा',
    bn: 'রাসায়নিক বিপদ',
    tl: 'PANGANIB NG KEMIKAL',
    ta: 'இரசாயன ஆபத்து'
  },
  'ELECTRICAL HAZARD': {
    en: 'ELECTRICAL HAZARD',
    ar: 'خطر كهربائي',
    ur: 'برقی خطرہ',
    hi: 'विद्युत खतरा',
    bn: 'বৈদ্যুতিক বিপদ',
    tl: 'PANGANIB NG KURYENTE',
    ta: 'மின் ஆபத்து'
  },
  'FIRE HAZARD': {
    en: 'FIRE HAZARD',
    ar: 'خطر الحريق',
    ur: 'آگ کا خطرہ',
    hi: 'आग का खतरा',
    bn: 'আগুনের বিপদ',
    tl: 'PANGANIB NG SUNOG',
    ta: 'தீ ஆபத்து'
  },
  'SLIP HAZARD': {
    en: 'SLIP HAZARD',
    ar: 'خطر الانزلاق',
    ur: 'پھسلنے کا خطرہ',
    hi: 'फिसलने का खतरा',
    bn: 'পিছলে যাওয়ার বিপদ',
    tl: 'PANGANIB NG PAGKADULAS',
    ta: 'நழுவல் ஆபத்து'
  },
  'FALLING OBJECTS': {
    en: 'FALLING OBJECTS',
    ar: 'أشياء متساقطة',
    ur: 'گرتی اشیاء',
    hi: 'गिरती वस्तुएं',
    bn: 'পড়ন্ত বস্তু',
    tl: 'NAHUHULOG NA BAGAY',
    ta: 'விழும் பொருட்கள்'
  },
  
  // Instructions
  'KEEP CLEAR': {
    en: 'KEEP CLEAR',
    ar: 'إبقاء واضحة',
    ur: 'صاف رکھیں',
    hi: 'साफ रखें',
    bn: 'পরিষ্কার রাখুন',
    tl: 'PANATILIHING MALINIS',
    ta: 'தெளிவாக வைக்கவும்'
  },
  'DO NOT ENTER': {
    en: 'DO NOT ENTER',
    ar: 'لا تدخل',
    ur: 'داخل نہ ہوں',
    hi: 'प्रवेश न करें',
    bn: 'প্রবেश করবেন না',
    tl: 'HUWAG PUMASOK',
    ta: 'நுழைய வேண்டாம்'
  },
  'STOP': {
    en: 'STOP',
    ar: 'قف',
    ur: 'رکیں',
    hi: 'रुकें',
    bn: 'থামুন',
    tl: 'TIGIL',
    ta: 'நிறுத்து'
  },
  'WEAR PROTECTIVE EQUIPMENT': {
    en: 'WEAR PROTECTIVE EQUIPMENT',
    ar: 'ارتداء معدات الحماية',
    ur: 'حفاظتی سامان پہنیں',
    hi: 'सुरक्षा उपकरण पहनें',
    bn: 'সুরক্ষা সরঞ্জাম পরুন',
    tl: 'MAGSUOT NG PROTECTIVE EQUIPMENT',
    ta: 'பாதுகாப்பு உபகரணங்களை அணியவும்'
  }
};

export function translate(text: string, targetLanguage: string): string {
  const upperText = text.toUpperCase();
  if (commonPhrases[upperText] && commonPhrases[upperText][targetLanguage]) {
    return commonPhrases[upperText][targetLanguage];
  }
  return text; // Return original if no translation found
}

export function getLanguageByCode(code: string): Translation | undefined {
  return supportedLanguages.find(lang => lang.code === code);
}

export function isRTL(languageCode: string): boolean {
  const lang = getLanguageByCode(languageCode);
  return lang?.rtl || false;
}

export function getLanguageFont(languageCode: string): string | undefined {
  const lang = getLanguageByCode(languageCode);
  return lang?.fontFamily;
}
