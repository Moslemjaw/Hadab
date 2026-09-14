import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Language = 'en' | 'ar';

export interface Translations {
  // Common / Navbar
  tickerLocation: string;
  tickerCraft: string;
  tickerArchive: string;
  navCollection: string;
  navCategories: string;
  navStory: string;
  searchPlaceholder: string;
  searchAria: string;
  bagAria: string;
  toggleLangAria: string;
  toggleMenuAria: string;
  accountAria: string;
  closeMenuAria: string;
  switchLanguageName: string;

  // Cart / Bag Drawer
  yourBag: string;
  itemsCount: string;
  emptyBagTitle: string;
  emptyBagSubtitle: string;
  discoverCollection: string;
  complimentaryShippingUnlocked: string;
  addForFreeDelivery: string;
  subtotal: string;
  shipping: string;
  free: string;
  checkoutSecurely: string;
  remove: string;

  // Hero / Scroll Stage
  heroEyebrow: string;
  heroTagline: string;
  heroSubtitle: string;
  exploreWorks: string;
  beat1Title1: string;
  beat1Title2: string;
  archiveBadge: string;
  curatedTitle: string;
  curatedSubtitle: string;
  viewMore: string;
  addToBag: string;
  inspect: string;
  details: string;
  craftFamiliesBadge: string;
  craftFamiliesTitle: string;
  craftFamiliesHighlight: string;
  craftFamiliesSubtitle: string;
  family01Tab: string;
  family02Tab: string;
  familyPrefix: string;
  viewCollection: string;

  // Categories Page
  categoriesBadge: string;
  categoriesTitle: string;
  categoriesSubtitle: string;
  backToHome: string;
  piecesCount: string;
  exploreThisFamily: string;
  familyTagline: string;

  // Collection Page & Filters
  collectionHeroTitle: string;
  collectionHeroSubtitle: string;
  searchCollectionPlaceholder: string;
  searchCountWorks: string;
  allCategories: string;
  filtersButton: string;
  saleFilter: string;
  showingOf: string;
  pieces: string;
  sortLabel: string;
  sortFeatured: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  sortNameAsc: string;
  noMatchTitle: string;
  noMatchSubtitle: string;
  clearAllFilters: string;
  resetFilters: string;
  filterDrawerTitle: string;
  priceCeiling: string;
  allFibers: string;
  allColors: string;
  applyFilters: string;

  // Product Modal
  studioOriginal: string;
  inspectStitch: string;
  showFullPiece: string;
  artisanSpecifications: string;
  yarnMaterial: string;
  stitchPattern: string;
  colorPalette: string;
  handmakingTime: string;
  craftHeritage: string;
  craftHeritageDesc: string;
  freeShippingNote: string;
  addedToBagNotification: string;

  // Story Page
  storyBadge: string;
  storyMainTitle: string;
  storyMainHighlight: string;
  storyHeroDesc: string;
  storyNounLabel: string;
  storyCraftLabel: string;
  storyQuote: string;
  storyPronounceAria: string;
  actIHeadline: string;
  actISub: string;
  actIP1: string;
  actIP2: string;
  dualCitiesBadge: string;
  dualCitiesTitle: string;
  dualCitiesSubtitle: string;
  ammanTab: string;
  kuwaitTab: string;
  ammanDesc: string;
  kuwaitDesc: string;
  craftPhilosophyTitle: string;
  craftItem1Title: string;
  craftItem1Desc: string;
  craftItem2Title: string;
  craftItem2Desc: string;
  craftItem3Title: string;
  craftItem3Desc: string;
  storyCtaTitle: string;
  storyCtaDesc: string;

  // Footer
  footerDesc: string;
  footerExplore: string;
  footerCareJournal: string;
  footerNewsletterTitle: string;
  footerNewsletterDesc: string;
  footerEmailPlaceholder: string;
  footerJoin: string;
  footerSubscribed: string;
  footerRights: string;
  footerCareHandwash: string;
  footerCareDrying: string;
  footerCareStorage: string;
}

const translations: Record<Language, Translations> = {
  en: {
    tickerLocation: 'JORDAN • KUWAIT',
    tickerCraft: 'SLOW CRAFT CROCHET ATELIER • EACH PIECE HOOKED BY HAND',
    tickerArchive: 'COMPLIMENTARY ARCHIVE WRAPPING',
    navCollection: 'The Collection',
    navCategories: 'Categories',
    navStory: 'Our Story',
    searchPlaceholder: 'Search by piece, stitch or yarn...',
    searchAria: 'Search Collection',
    bagAria: 'Open Bag',
    toggleLangAria: 'Toggle Language',
    toggleMenuAria: 'Open Navigation Menu',
    accountAria: 'My Account',
    closeMenuAria: 'Close Navigation Menu',
    switchLanguageName: 'العربية',

    yourBag: 'Your Bag',
    itemsCount: 'items',
    emptyBagTitle: 'Your bag is empty',
    emptyBagSubtitle: 'Explore our artisan hand-hooked collection to find your next heirloom.',
    discoverCollection: 'Discover Collection',
    complimentaryShippingUnlocked: 'You qualify for complimentary shipping!',
    addForFreeDelivery: 'Add ${amount} more for free delivery',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    free: 'Complimentary',
    checkoutSecurely: 'Proceed to Checkout',
    remove: 'Remove',

    heroEyebrow: 'Atelier Edition • 2026',
    heroTagline: 'Handmade. One stitch at a time.',
    heroSubtitle: 'Handmade crochet items, crafted by hand in Jordan and Kuwait.',
    exploreWorks: 'Explore Works',
    beat1Title1: 'One stitch at a time.',
    beat1Title2: 'For your everyday.',
    archiveBadge: 'Permanent Archive',
    curatedTitle: 'Handmade Pieces for Everyday Use',
    curatedSubtitle: 'Made by hand in small batches using thick 5mm natural cotton cord.',
    viewMore: 'View More',
    addToBag: 'Add to Bag',
    inspect: 'Inspect',
    details: 'Details',
    craftFamiliesBadge: 'Craft Families',
    craftFamiliesTitle: 'Explore by',
    craftFamiliesHighlight: 'Craft Family',
    craftFamiliesSubtitle: 'Four different styles of handmade crochet, made with natural cotton cord.',
    family01Tab: 'Bags & Wearables',
    family02Tab: 'Hats & Accessories',
    familyPrefix: 'Family',
    viewCollection: 'View Collection',

    categoriesBadge: 'Craft Families',
    categoriesTitle: 'The Four Craft Families',
    categoriesSubtitle: 'Each family is defined by its fiber thickness, stitch architecture, and functional form.',
    backToHome: 'Back to Home',
    piecesCount: 'Pieces',
    exploreThisFamily: 'Explore Family Works',
    familyTagline: 'Atelier Heritage',

    collectionHeroTitle: 'The Collection',
    collectionHeroSubtitle: 'Hand-hooked in numbered studio batches with unbleached 5mm cotton cord, organic linen, and raw plant dyes.',
    searchCollectionPlaceholder: 'Search by piece name, stitch, yarn, or color...',
    searchCountWorks: 'works',
    allCategories: 'All',
    filtersButton: 'Filters',
    saleFilter: 'Sale',
    showingOf: 'Showing',
    pieces: 'pieces',
    sortLabel: 'Sort',
    sortFeatured: 'Featured',
    sortPriceAsc: 'Price: Low to High',
    sortPriceDesc: 'Price: High to Low',
    sortNameAsc: 'Alphabetical',
    noMatchTitle: 'No Pieces Match Your Filter',
    noMatchSubtitle: 'We could not find any atelier works matching your current selection. Try adjusting your search.',
    clearAllFilters: 'Clear All Filters',
    resetFilters: 'Reset',
    filterDrawerTitle: 'Filter Collection',
    priceCeiling: 'Price Ceiling',
    allFibers: 'All Fibers',
    allColors: 'All Colors',
    applyFilters: 'View Results',

    studioOriginal: 'Studio Original',
    inspectStitch: 'Inspect Yarn Stitch Detail',
    showFullPiece: 'Show Full Piece',
    artisanSpecifications: 'Artisan Specifications',
    yarnMaterial: 'Yarn Material',
    stitchPattern: 'Stitch Technique',
    colorPalette: 'Color Name',
    handmakingTime: 'Handmaking Time',
    craftHeritage: 'Craft Heritage',
    craftHeritageDesc: 'Each piece is entirely hand-hooked without electric machinery in Jordan & Kuwait.',
    freeShippingNote: 'Complimentary shipping on orders over $80.',
    addedToBagNotification: 'Added to Bag',

    storyBadge: 'Our Philosophy & Heritage',
    storyMainTitle: 'A brand born from the quiet beauty of',
    storyMainHighlight: 'little details',
    storyHeroDesc: 'Before there were machines, clothing and carriers carried the heartbeat of the hands that looped them. At HADAB, we return to that single-stitch meditation.',
    storyNounLabel: 'Arabic Noun',
    storyCraftLabel: 'Artisan Craft',
    storyQuote: 'The delicate threads or fringes hanging from the edge of a woven piece. Small details that seem unassuming, but give an object character and make it complete.',
    storyPronounceAria: 'Listen to pronunciation',
    actIHeadline: 'Slow Craft in an Accelerated World',
    actISub: 'Why we still loop every single knot by hand',
    actIP1: 'HADAB was founded on a simple conviction: the objects we carry every day should feel human. In modern mass production, pieces are stamped out in minutes by automated looms.',
    actIP2: 'When you hold a HADAB tote or pull on a cardigan, you can trace the tension of every loop. The slight natural variance in unbleached cotton cord gives each piece a soul.',
    dualCitiesBadge: 'Two Studios, One Thread',
    dualCitiesTitle: 'Between Amman & Kuwait City',
    dualCitiesSubtitle: 'Connecting the terracotta stone warmth of Jordan with the vibrant coastal design culture of Kuwait.',
    ammanTab: 'Amman Studio • Jordan',
    kuwaitTab: 'Kuwait Atelier • Kuwait',
    ammanDesc: 'Our Amman workshop focuses on sourcing pure unbleached cotton yarns, raw plant dyes, and traditional ribbing patterns.',
    kuwaitDesc: 'Our Kuwait design studio refines contemporary silhouettes, modern structural tote gussets, and seasonal archive drops.',
    craftPhilosophyTitle: 'Our Three Tenets',
    craftItem1Title: 'Zero Synthetic Stiffeners',
    craftItem1Desc: 'We achieve architectural firmness purely through dense stitch tension and 5mm thick braided cotton ribbon.',
    craftItem2Title: 'Single Maker Accountability',
    craftItem2Desc: 'Each piece is hand-hooked from start to finish by a single artisan, never passed down an assembly line.',
    craftItem3Title: 'Numbered Studio Batches',
    craftItem3Desc: 'We produce only what our hands can sustain. Once a seasonal dye lot is exhausted, it is archived.',
    storyCtaTitle: 'Experience the Handcrafted Collection',
    storyCtaDesc: 'Explore our latest numbered batch of totes, cardigans, hats, and accessories.',

    footerDesc: 'Slow-craft crochet atelier based between Jordan & Kuwait. Hand-hooked from unbleached cotton cord.',
    footerExplore: 'Explore',
    footerCareJournal: 'Atelier Care',
    footerNewsletterTitle: 'Studio Newsletter',
    footerNewsletterDesc: 'Be notified when new small batches are dyed, hooked, and ready for dispatch.',
    footerEmailPlaceholder: 'Enter your email...',
    footerJoin: 'Join Loop',
    footerSubscribed: 'Thank you for joining our atelier circle.',
    footerRights: 'All rights reserved. Slow-craft crochet atelier.',
    footerCareHandwash: 'Hand wash gently in cool water',
    footerCareDrying: 'Reshape and dry flat in shade',
    footerCareStorage: 'Fold neatly, avoid sharp hangers',
  },
  ar: {
    tickerLocation: 'الأردن • الكويت',
    tickerCraft: 'مشغل كروشيه بطيء • كل قطعة محبوكة يدوياً بالكامل',
    tickerArchive: 'تغليف أرشيفي هادئ مع كل طلب',
    navCollection: 'المجموعة',
    navCategories: 'التصنيفات',
    navStory: 'قصتنا',
    searchPlaceholder: 'ابحث عن قطعة، غرزة أو خيط...',
    searchAria: 'البحث في المجموعة',
    bagAria: 'سلة المشتريات',
    toggleLangAria: 'تبديل اللغة',
    toggleMenuAria: 'فتح قائمة التنقل',
    accountAria: 'حسابي',
    closeMenuAria: 'إغلاق قائمة التنقل',
    switchLanguageName: 'English',

    yourBag: 'حقيبة التسوق',
    itemsCount: 'قطع',
    emptyBagTitle: 'حقيبتك فارغة حالياً',
    emptyBagSubtitle: 'تصفح تشكيلة الكروشيه اليدوية المصنوعة بحرفية لتجد قطعتك القادمة.',
    discoverCollection: 'تصفح المجموعة',
    complimentaryShippingUnlocked: 'تهانينا! لقد حصلت على توصيل مجاني',
    addForFreeDelivery: 'أضف ${amount} للحصول على شحن مجاني',
    subtotal: 'المجموع الفرعي',
    shipping: 'الشحن',
    free: 'مجاني',
    checkoutSecurely: 'متابعة الدفع بأمان',
    remove: 'حذف',

    heroEyebrow: 'إصدار الأتيليه • ٢٠٢٦',
    heroTagline: 'صُنعت باليد. غرزة تلو الأخرى.',
    heroSubtitle: 'قطع كروشيه يدوية مميزة، محبوكة بحرفية وشغف بين الأردن والكويت.',
    exploreWorks: 'استكشف الأعمال',
    beat1Title1: 'غرزة تلو الأخرى.',
    beat1Title2: 'ليومك وكل يوم.',
    archiveBadge: 'الأرشيف الدائم',
    curatedTitle: 'قطع يدوية صنعت لرفقة يومك',
    curatedSubtitle: 'محبوكة يدوياً بدفعات محدودة باستخدام خيوط قطنية طبيعية سميكة ٥ ملم.',
    viewMore: 'عرض المزيد',
    addToBag: 'أضف إلى الحقيبة',
    inspect: 'تفاصيل',
    details: 'معاينة',
    craftFamiliesBadge: 'عائلات الحرفة',
    craftFamiliesTitle: 'استكشف حسب',
    craftFamiliesHighlight: 'عائلة الحرفة',
    craftFamiliesSubtitle: 'أربعة أنماط أصيلة من الكروشيه اليدوي الفاخر، صممت من خيوط القطن النقي.',
    family01Tab: 'الحقائب والملابس',
    family02Tab: 'القبعات والإكسسوارات',
    familyPrefix: 'عائلة',
    viewCollection: 'تصفح التشكيلة',

    categoriesBadge: 'عائلات الحرفة',
    categoriesTitle: 'عائلات الحرفة الأربع',
    categoriesSubtitle: 'تتميز كل عائلة بسماكة خيوطها، هندسة غرزها، وشكلها العملي للاستخدام اليومي.',
    backToHome: 'العودة للرئيسية',
    piecesCount: 'قطع',
    exploreThisFamily: 'تصفح قطع العائلة',
    familyTagline: 'أصالة المشغل',

    collectionHeroTitle: 'المجموعة الكاملة',
    collectionHeroSubtitle: 'محبوكة يدوياً في دفعات ستوديو مرقّمة من حبال القطن النقي ٥ ملم، الكتان الطبيعي، والصبغات النباتية.',
    searchCollectionPlaceholder: 'ابحث باسم القطعة، الغرزة، نوع الخيط، أو اللون...',
    searchCountWorks: 'أعمال',
    allCategories: 'الكل',
    filtersButton: 'تصفية',
    saleFilter: 'تخفيضات',
    showingOf: 'عرض',
    pieces: 'قطع',
    sortLabel: 'ترتيب',
    sortFeatured: 'المميزة',
    sortPriceAsc: 'السعر: من الأقل للأعلى',
    sortPriceDesc: 'السعر: من الأعلى للأقل',
    sortNameAsc: 'أبجدياً',
    noMatchTitle: 'لم نجد قطعاً تطابق بحثك',
    noMatchSubtitle: 'لا توجد أعمال في الأتيليه تطابق خيارات التصفية الحالية. جرب تغيير كلمات البحث.',
    clearAllFilters: 'مسح كل الفلاتر',
    resetFilters: 'إعادة ضبط',
    filterDrawerTitle: 'تصفية المجموعة',
    priceCeiling: 'الحد الأقصى للسعر',
    allFibers: 'جميع الخيوط',
    allColors: 'جميع الألوان',
    applyFilters: 'عرض النتائج',

    studioOriginal: 'إصدار أصلي من المشغل',
    inspectStitch: 'معاينة تفاصيل الغرزة والخيط',
    showFullPiece: 'عرض القطعة كاملة',
    artisanSpecifications: 'المواصفات الحرفية',
    yarnMaterial: 'نوع الخيط',
    stitchPattern: 'تقنية الغرزة',
    colorPalette: 'اسم اللون',
    handmakingTime: 'وقت الحياكة اليدوية',
    craftHeritage: 'أصالة الصنعة',
    craftHeritageDesc: 'كل قطعة محبوكة يدوياً بالكامل دون ماكينات كهربائية في الأردن والكويت.',
    freeShippingNote: 'شحن مجاني للطلبات التي تزيد عن ٨٠ دولار.',
    addedToBagNotification: 'تمت الإضافة إلى الحقيبة',

    storyBadge: 'فلسفتنا وتراثنا',
    storyMainTitle: 'علامة استلهمت فكرتها من سحر',
    storyMainHighlight: 'التفاصيل الصغيرة',
    storyHeroDesc: 'قبل ظهور الآلات السريعة، كانت الملابس والأمتعة تحمل نبض الأيدي التي نسجتها. في هَدَب، نعود إلى سكينة الغرزة الواحدة المتصلة.',
    storyNounLabel: 'اسم عربي أصيل',
    storyCraftLabel: 'حِرفة يدوية',
    storyQuote: 'الهَدَب هو ما تدلّى من أطراف الثوب أو المنسوجة من خيوط وزوائد ناعمة. تفاصيل قد تبدو بسيطة، لكنها تمنح الشيء روحه واكتماله.',
    storyPronounceAria: 'استمع إلى النطق',
    actIHeadline: 'حرفة هادئة في عالم متسارع',
    actISub: 'لماذا نحيك كل عقدة بمفردها بأيدينا',
    actIP1: 'تأسست هَدَب على يقين بسيط: الأشياء التي نحملها ونعيش معها يومياً يجب أن تنبض بالدفء الإنساني. في عالم الإنتاج الضخم، تصنع الآلاف في دقائق.',
    actIP2: 'عندما تحملين حقيبة من هَدَب أو ترتدين أحد شالاتنا، يمكنك تلمس تماسك كل غرزة. الاختلافات الطبيعية الدقيقة في خيط القطن الخام تمنح كل قطعة فرادتها.',
    dualCitiesBadge: 'مشغلان، وخيط واحد',
    dualCitiesTitle: 'بين عمّان ومدينة الكويت',
    dualCitiesSubtitle: 'نربط دفء حجر عمّان الترابي العتيق مع حيوية التصميم وأناقة الساحل في الكويت.',
    ammanTab: 'مشغل عمّان • الأردن',
    kuwaitTab: 'أتيليه الكويت • الكويت',
    ammanDesc: 'يركز مشغلنا في عمّان على انتقاء خيوط القطن الصافية والكتان غير المعالج والصبغات الطبيعية وأنماط الغرز التراثية.',
    kuwaitDesc: 'يعمل ستوديو التصميم في الكويت على تطوير تصاميم الحقائب المعاصرة والهياكل الهندسية الأنيقة وإصدارات الأرشيف.',
    craftPhilosophyTitle: 'مبادئنا الثلاثة',
    craftItem1Title: 'خالٍ من المقويات الصناعية',
    craftItem1Desc: 'نحقق التماسك الهندسي للحقائب عبر شدة الغرزة المحكمة وحبال القطن المنسوجة بعرض ٥ ملم.',
    craftItem2Title: 'مسؤولية صانع واحد لكل قطعة',
    craftItem2Desc: 'تُحاك كل قطعة من بدايتها حتى نهايتها بيد حرفي واحد من دون تمريرها في خطوط إنتاج مجزأة.',
    craftItem3Title: 'دفعات ستوديو محدودة ومرقّمة',
    craftItem3Desc: 'نصنع فقط ما تستطيع أيدينا إتمامه بإتقان. عند نفاد دفعة الخيوط، تنتقل القطعة مباشرة إلى الأرشيف.',
    storyCtaTitle: 'تذوّقي فخامة الكروشيه اليدوي',
    storyCtaDesc: 'اكتشفي أحدث مجموعاتنا المحدودة من الحقائب، الكارديجان، القبعات، والإكسسوارات.',

    footerDesc: 'مشغل كروشيه للحرف البطيئة بين الأردن والكويت. محبوك يدوياً من حبال القطن الطبيعي الفاخر.',
    footerExplore: 'استكشاف',
    footerCareJournal: 'العناية بالقطعة',
    footerNewsletterTitle: 'نشرة المشغل',
    footerNewsletterDesc: 'كوني أول من يعلم بجهوزية دفعات الخيوط والقطع المحبوكة الجديدة فور اكتمالها.',
    footerEmailPlaceholder: 'أدخلي بريدك الإلكتروني...',
    footerJoin: 'انضمي إلينا',
    footerSubscribed: 'شكراً لانضمامك إلى مجتمع مشغلنا الهادئ.',
    footerRights: 'جميع الحقوق محفوظة. مشغل هَدَب للكروشيه اليدوي.',
    footerCareHandwash: 'غسيل يدوي لطيف بماء بارد',
    footerCareDrying: 'فرد القطعة وتجفيفها أفقياً في الظل',
    footerCareStorage: 'طيّ أنيق وتجنب التعليق على أطراف حادة',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  isArabic: boolean;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('hadab_lang');
    return saved === 'ar' || saved === 'en' ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('hadab_lang', lang);
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'ar' : 'en';
    setLanguage(next);
  };

  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    toggleLanguage,
    t: translations[language],
    isArabic: language === 'ar',
    dir: language === 'ar' ? 'rtl' : 'ltr',
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
