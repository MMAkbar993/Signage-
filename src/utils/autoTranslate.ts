// Auto-translation system for signage content
// Translates user input into selected languages

export interface TranslatedText {
  language: string;
  text: string;
  languageName: string;
  flag: string;
}

// Comprehensive translation dictionary
const translationDict: { [key: string]: { [lang: string]: string } } = {
  // Common Safety Terms
  'danger': {
    en: 'DANGER',
    ar: 'خطر',
    ur: 'خطرہ',
    hi: 'खतरा',
    bn: 'বিপদ',
    tl: 'PANGANIB',
    ta: 'ஆபத்து'
  },
  'warning': {
    en: 'WARNING',
    ar: 'تحذير',
    ur: 'انتباہ',
    hi: 'चेतावनी',
    bn: 'সতর্কতা',
    tl: 'BABALA',
    ta: 'எச்சரிக்கை'
  },
  'caution': {
    en: 'CAUTION',
    ar: 'تنبيه',
    ur: 'احتیاط',
    hi: 'सावधानी',
    bn: 'সাবধানতা',
    tl: 'INGAT',
    ta: 'எச்சரிக்கை'
  },
  'mandatory': {
    en: 'MANDATORY',
    ar: 'إلزامي',
    ur: 'لازمی',
    hi: 'अनिवार्य',
    bn: 'বাধ্যতামূলক',
    tl: 'SAPILITAN',
    ta: 'கட்டாயம்'
  },
  'prohibited': {
    en: 'PROHIBITED',
    ar: 'ممنوع',
    ur: 'ممنوع',
    hi: 'प्रतिबंधित',
    bn: 'নিষিদ্ধ',
    tl: 'IPINAGBABAWAL',
    ta: 'தடைசெய்யப்பட்டது'
  },
  'emergency': {
    en: 'EMERGENCY',
    ar: 'طوارئ',
    ur: 'ایمرجنسی',
    hi: 'आपातकाल',
    bn: 'জরুরী',
    tl: 'EMERHENSYA',
    ta: 'அவசரநிலை'
  },
  
  // Hazards
  'high voltage': {
    en: 'High Voltage',
    ar: 'جهد عالي',
    ur: 'ہائی وولٹیج',
    hi: 'उच्च वोल्टेज',
    bn: 'উচ্চ ভোল্টেজ',
    tl: 'Mataas na Boltahe',
    ta: 'உயர் மின்னழுத்தம்'
  },
  'electrical hazard': {
    en: 'Electrical Hazard',
    ar: 'خطر كهربائي',
    ur: 'برقی خطرہ',
    hi: 'विद्युत खतरा',
    bn: 'বৈদ্যুতিক বিপদ',
    tl: 'Panganib sa Kuryente',
    ta: 'மின் அபாயம்'
  },
  'chemical hazard': {
    en: 'Chemical Hazard',
    ar: 'خطر كيميائي',
    ur: 'کیمیائی خطرہ',
    hi: 'रासायनिक खतरा',
    bn: 'রাসায়নিক বিপদ',
    tl: 'Kemikal na Panganib',
    ta: 'இரசாயன அபாயம்'
  },
  'fire hazard': {
    en: 'Fire Hazard',
    ar: 'خطر حريق',
    ur: 'آگ کا خطرہ',
    hi: 'आग का खतरा',
    bn: 'আগুনের বিপদ',
    tl: 'Panganib sa Sunog',
    ta: 'தீ அபாயம்'
  },
  'toxic': {
    en: 'Toxic',
    ar: 'سام',
    ur: 'زہریلا',
    hi: 'जहरीला',
    bn: 'বিষাক্ত',
    tl: 'Nakakalason',
    ta: 'நச்சு'
  },
  'flammable': {
    en: 'Flammable',
    ar: 'قابل للاشتعال',
    ur: 'آتش گیر',
    hi: 'ज्वलनशील',
    bn: 'দাহ্য',
    tl: 'Madaling Masunog',
    ta: 'எரியக்கூடிய'
  },
  'explosive': {
    en: 'Explosive',
    ar: 'متفجر',
    ur: 'دھماکہ خیز',
    hi: 'विस्फोटक',
    bn: 'বিস্ফোরক',
    tl: 'Paputok',
    ta: 'வெடிக்கும்'
  },
  'confined space': {
    en: 'Confined Space',
    ar: 'مساحة ضيقة',
    ur: 'محدود جگہ',
    hi: 'सीमित स्थान',
    bn: 'সীমাবদ্ধ স্থান',
    tl: 'Makitid na Espasyo',
    ta: 'குறுகிய இடம்'
  },
  'fall hazard': {
    en: 'Fall Hazard',
    ar: 'خطر السقوط',
    ur: 'گرنے کا خطرہ',
    hi: 'गिरने का खतरा',
    bn: 'পতনের বিপদ',
    tl: 'Panganib sa Pagbagsak',
    ta: 'விழும் அபாயம்'
  },
  'slip hazard': {
    en: 'Slip Hazard',
    ar: 'خطر الانزلاق',
    ur: 'پھسلنے کا خطرہ',
    hi: 'फिसलने का खतरा',
    bn: 'পিছলে যাওয়ার বিপদ',
    tl: 'Panganib sa Pagkadulas',
    ta: 'நழுவும் அபாயம்'
  },
  
  // Areas
  'area': {
    en: 'Area',
    ar: 'منطقة',
    ur: 'علاقہ',
    hi: 'क्षेत्र',
    bn: 'এলাকা',
    tl: 'Lugar',
    ta: 'பகுதி'
  },
  'zone': {
    en: 'Zone',
    ar: 'منطقة',
    ur: 'زون',
    hi: 'क्षेत्र',
    bn: 'অঞ্চল',
    tl: 'Sona',
    ta: 'மண்டலம்'
  },
  'restricted area': {
    en: 'Restricted Area',
    ar: 'منطقة محظورة',
    ur: 'ممنوعہ علاقہ',
    hi: 'प्रतिबंधित क्षेत्र',
    bn: 'নিষিদ্ধ এলাকা',
    tl: 'Ipinagbabawal na Lugar',
    ta: 'தடைசெய்யப்பட்ட பகுதி'
  },
  
  // Actions
  'no entry': {
    en: 'No Entry',
    ar: 'ممنوع الدخول',
    ur: 'داخلہ ممنوع',
    hi: 'प्रवेश निषेध',
    bn: 'প্রবেশ নিষেধ',
    tl: 'Bawal Pumasok',
    ta: 'நுழைவு தடை'
  },
  'authorized personnel only': {
    en: 'Authorized Personnel Only',
    ar: 'للموظفين المصرح لهم فقط',
    ur: 'صرف مجاز اہلکار',
    hi: 'केवल अधिकृत कर्मियों',
    bn: 'শুধুমাত্র অনুমোদিত কর্মী',
    tl: 'Awtorisadong Empleyado Lamang',
    ta: 'அங்கீகரிக்கப்பட்ட பணியாளர்கள் மட்டும்'
  },
  'wear ppe': {
    en: 'Wear PPE',
    ar: 'ارتداء معدات الحماية',
    ur: 'حفاظتی سامان پہنیں',
    hi: 'पीपीई पहनें',
    bn: 'পিপিই পরুন',
    tl: 'Magsuot ng PPE',
    ta: 'பாதுகாப்பு உபகரணங்களை அணியவும்'
  },
  'keep out': {
    en: 'Keep Out',
    ar: 'ابتعد',
    ur: 'باہر رہیں',
    hi: 'बाहर रहें',
    bn: 'বাইরে থাকুন',
    tl: 'Huwag Pumasok',
    ta: 'வெளியே இருங்கள்'
  },
  'safety first': {
    en: 'Safety First',
    ar: 'السلامة أولاً',
    ur: 'حفاظت پہلے',
    hi: 'सुरक्षा प्रथम',
    bn: 'নিরাপত্তা প্রথম',
    tl: 'Kaligtasan Muna',
    ta: 'பாதுகாப்பு முதலில்'
  },
  'stop': {
    en: 'STOP',
    ar: 'قف',
    ur: 'رکیں',
    hi: 'रुको',
    bn: 'থামুন',
    tl: 'TIGIL',
    ta: 'நிறுத்து'
  },
  
  // Common phrases
  'wear safety equipment': {
    en: 'Wear Safety Equipment',
    ar: 'ارتداء معدات السلامة',
    ur: 'حفاظتی سامان پہنیں',
    hi: 'सुरक्षा उपकरण पहनें',
    bn: 'নিরাপত্তা সরঞ্জাম পরুন',
    tl: 'Magsuot ng Kagamitang Panseguridad',
    ta: 'பாதுகாப்பு உபகரணங்களை அணியவும்'
  },
  'report immediately': {
    en: 'Report Immediately',
    ar: 'أبلغ فوراً',
    ur: 'فوری رپورٹ کریں',
    hi: 'तुरंत रिपोर्ट करें',
    bn: 'অবিলম্বে রিপোর্ট করুন',
    tl: 'Iulat Kaagad',
    ta: 'உடனடியாக தெரிவிக்கவும்'
  },
  'follow safety procedures': {
    en: 'Follow Safety Procedures',
    ar: 'اتبع إجراءات السلامة',
    ur: 'حفاظتی طریقہ کار پر عمل کریں',
    hi: 'सुरक्षा प्रक्रियाओं का पालन करें',
    bn: 'নিরাপত্তা পদ্ধতি অনুসরণ করুন',
    tl: 'Sundin ang mga Pamamaraan sa Kaligtasan',
    ta: 'பாதுகாப்பு நடைமுறைகளை பின்பற்றவும்'
  }
};

// Language metadata
const languageMetadata: { [code: string]: { name: string; flag: string; direction: 'ltr' | 'rtl' } } = {
  en: { name: 'English', flag: '🇬🇧', direction: 'ltr' },
  ar: { name: 'Arabic', flag: '🇸🇦', direction: 'rtl' },
  ur: { name: 'Urdu', flag: '🇵🇰', direction: 'rtl' },
  hi: { name: 'Hindi', flag: '🇮🇳', direction: 'ltr' },
  bn: { name: 'Bengali', flag: '🇧🇩', direction: 'ltr' },
  tl: { name: 'Tagalog', flag: '🇵🇭', direction: 'ltr' },
  ta: { name: 'Tamil', flag: '🇮🇳', direction: 'ltr' }
};

/**
 * Translates text into multiple languages
 * @param text - The text to translate
 * @param targetLanguages - Array of target language codes
 * @returns Array of translations
 */
export function translateToMultiple(text: string, targetLanguages: string[]): TranslatedText[] {
  if (!text || !text.trim()) {
    return targetLanguages.map(lang => ({
      language: lang,
      text: '',
      languageName: languageMetadata[lang]?.name || lang,
      flag: languageMetadata[lang]?.flag || '🏳️'
    }));
  }

  const textLower = text.toLowerCase().trim();
  
  return targetLanguages.map(lang => {
    let translatedText = text;
    
    // Check if we have a direct translation
    if (translationDict[textLower] && translationDict[textLower][lang]) {
      translatedText = translationDict[textLower][lang];
    } else {
      // Try to find partial matches
      let found = false;
      for (const [key, translations] of Object.entries(translationDict)) {
        if (textLower.includes(key) && translations[lang]) {
          // Replace the matched part with translation
          translatedText = text.replace(new RegExp(key, 'gi'), translations[lang]);
          found = true;
          break;
        }
      }
      
      // If no match found, keep original text
      if (!found) {
        translatedText = text;
      }
    }
    
    return {
      language: lang,
      text: translatedText,
      languageName: languageMetadata[lang]?.name || lang,
      flag: languageMetadata[lang]?.flag || '🏳️'
    };
  });
}

/**
 * Translates a single text to a specific language
 */
export function translateToLanguage(text: string, targetLanguage: string): string {
  if (!text || !text.trim()) return text;
  
  const textLower = text.toLowerCase().trim();
  
  // Direct match
  if (translationDict[textLower] && translationDict[textLower][targetLanguage]) {
    return translationDict[textLower][targetLanguage];
  }
  
  // Partial match
  for (const [key, translations] of Object.entries(translationDict)) {
    if (textLower.includes(key) && translations[targetLanguage]) {
      return text.replace(new RegExp(key, 'gi'), translations[targetLanguage]);
    }
  }
  
  return text;
}

/**
 * Get text direction for a language
 */
export function getTextDirection(languageCode: string): 'ltr' | 'rtl' {
  return languageMetadata[languageCode]?.direction || 'ltr';
}

/**
 * Check if language is RTL
 */
export function isRTL(languageCode: string): boolean {
  return getTextDirection(languageCode) === 'rtl';
}
