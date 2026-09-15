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

  // Auth Pages
  authBadge: string;
  signInTitle: string;
  signInSubtitle: string;
  signUpTitle: string;
  signUpSubtitle: string;
  signInTab: string;
  signUpTab: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  confirmPasswordLabel: string;
  confirmPasswordPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  rememberMe: string;
  forgotPassword: string;
  signInButton: string;
  signUpButton: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  switchToSignUp: string;
  switchToSignIn: string;
  termsNotice: string;
  termsLink: string;
  privacyLink: string;
  loginSuccess: string;
  registerSuccess: string;
  atelierMemberBadge: string;
  memberBenefit1: string;
  memberBenefit2: string;
  memberBenefit3: string;
  orContinueWith: string;
}

const translations: Record<Language, Translations> = {
  en: {
    tickerLocation: 'MADE IN JORDAN • SHIPPING TO KUWAIT',
    tickerCraft: 'HANDMADE CROCHET SHOP • EACH PIECE MADE BY HAND WITH LOVE',
    tickerArchive: 'NEAT & CAREFUL PACKAGING ON EVERY ORDER',
    navCollection: 'Shop All',
    navCategories: 'Categories',
    navStory: 'Our Story',
    searchPlaceholder: 'Search products, colors, yarn...',
    searchAria: 'Search Shop',
    bagAria: 'Open Cart',
    toggleLangAria: 'Toggle Language',
    toggleMenuAria: 'Open Navigation Menu',
    accountAria: 'My Account',
    closeMenuAria: 'Close Navigation Menu',
    switchLanguageName: 'العربية',

    yourBag: 'Shopping Bag',
    itemsCount: 'items',
    emptyBagTitle: 'Your bag is empty',
    emptyBagSubtitle: 'Browse our handmade crochet items to find your favorite piece.',
    discoverCollection: 'Browse Shop',
    complimentaryShippingUnlocked: 'You qualify for free shipping to Kuwait!',
    addForFreeDelivery: 'Add {amount} KWD more for free shipping',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    free: 'Free',
    checkoutSecurely: 'Proceed to Checkout',
    remove: 'Remove',

    heroEyebrow: 'Handmade Crochet • 2026 Collection',
    heroTagline: 'Handmade with love. One stitch at a time.',
    heroSubtitle: 'Home business based in Jordan, handcrafted with care and shipped directly to Kuwait.',
    exploreWorks: 'Shop Collection',
    beat1Title1: 'One stitch at a time.',
    beat1Title2: 'Handmade for your day.',
    archiveBadge: 'Handmade Collection',
    curatedTitle: 'Handmade Pieces for Everyday Use',
    curatedSubtitle: 'Made by hand in small batches using quality natural cotton yarn and cord.',
    viewMore: 'View All Products',
    addToBag: 'Add to Bag',
    inspect: 'Inspect',
    details: 'Details',
    craftFamiliesBadge: 'Our Categories',
    craftFamiliesTitle: 'Shop by',
    craftFamiliesHighlight: 'Category',
    craftFamiliesSubtitle: 'Four handmade collections crocheted with care from natural cotton.',
    family01Tab: 'Bags & Tops',
    family02Tab: 'Hats & Pouches',
    familyPrefix: 'Category',
    viewCollection: 'View Products',

    categoriesBadge: 'Categories',
    categoriesTitle: 'Browse by Category',
    categoriesSubtitle: 'Discover our bags, clothes, hats, and small everyday crochet accessories.',
    backToHome: 'Back to Home',
    piecesCount: 'Products',
    exploreThisFamily: 'View Products',
    familyTagline: 'Handmade with Care',

    collectionHeroTitle: 'Our Collection',
    collectionHeroSubtitle: 'Handmade with soft cotton and durable cords in Jordan, packaged carefully and delivered to Kuwait.',
    searchCollectionPlaceholder: 'Search by product name, color, or yarn...',
    searchCountWorks: 'products',
    allCategories: 'All',
    filtersButton: 'Filters',
    saleFilter: 'Sale',
    showingOf: 'Showing',
    pieces: 'products',
    sortLabel: 'Sort',
    sortFeatured: 'Featured',
    sortPriceAsc: 'Price: Low to High',
    sortPriceDesc: 'Price: High to Low',
    sortNameAsc: 'Alphabetical',
    noMatchTitle: 'No Products Found',
    noMatchSubtitle: 'We could not find any items matching your current filters. Try changing your search keywords.',
    clearAllFilters: 'Clear All Filters',
    resetFilters: 'Reset',
    filterDrawerTitle: 'Filter Products',
    priceCeiling: 'Price Limit',
    allFibers: 'All Materials',
    allColors: 'All Colors',
    applyFilters: 'Apply Filters',

    studioOriginal: 'Original Design',
    inspectStitch: 'View Close-Up Texture',
    showFullPiece: 'View Full Item',
    artisanSpecifications: 'Product Details',
    yarnMaterial: 'Yarn Material',
    stitchPattern: 'Crochet Stitch',
    colorPalette: 'Color',
    handmakingTime: 'Making Time',
    craftHeritage: 'Craftsmanship',
    craftHeritageDesc: '100% handmade crochet from our home studio in Jordan, shipped straight to you in Kuwait.',
    freeShippingNote: 'Free shipping to Kuwait on orders over 25 KWD.',
    addedToBagNotification: 'Added to your bag',

    storyBadge: 'Our Story & Purpose',
    storyMainTitle: 'A home brand inspired by the beauty of',
    storyMainHighlight: 'small details',
    storyHeroDesc: 'At HADAB, we are an independent home business founded in Jordan. Every bag, hat, and accessory is lovingly crocheted by hand and sent to our cherished customers in Kuwait and Jordan.',
    storyNounLabel: 'Arabic Meaning',
    storyCraftLabel: 'Handmade Craft',
    storyQuote: 'HADAB (هَدَب) is the delicate fringe or thread along the edge of woven fabric. Small, gentle details that give an item warmth, character, and uniqueness.',
    storyPronounceAria: 'Listen to pronunciation',
    actIHeadline: 'Handmade in a Fast-Paced World',
    actISub: 'Why we still make every single piece by hand',
    actIP1: 'HADAB was born from a passion for mindful handcraft. Rather than buying factory mass-produced items, we believe everyday bags and pieces should feel personal, warm, and durable.',
    actIP2: 'When you hold a HADAB piece, you feel the soft strength of quality cotton yarn and the care placed into every single loop. No two handmade pieces are ever completely identical.',
    dualCitiesBadge: 'Based in Jordan • Shipping to Kuwait',
    dualCitiesTitle: 'Handmade in Jordan, Delivered to Kuwait',
    dualCitiesSubtitle: 'Carefully made at home in Amman and shipped quickly and safely to your doorstep in Kuwait.',
    ammanTab: 'Made in Jordan',
    kuwaitTab: 'Shipping to Kuwait',
    ammanDesc: 'All our crochet items are designed and crocheted in Jordan with pure natural cotton, soft linen, and durable cords.',
    kuwaitDesc: 'We regularly pack and ship directly to our wonderful community of customers in Kuwait with secure delivery.',
    craftPhilosophyTitle: 'What We Stand For',
    craftItem1Title: 'Natural & Safe Materials',
    craftItem1Desc: 'We use high quality 100% cotton cords and soft natural fibers that hold their shape naturally.',
    craftItem2Title: 'Made by One Pair of Hands',
    craftItem2Desc: 'Each item is crocheted from the first loop to the final fringe by one maker with patience.',
    craftItem3Title: 'Small, Thoughtful Batches',
    craftItem3Desc: 'We make in limited numbers to maintain top quality and personal care for every customer.',
    storyCtaTitle: 'Explore Our Handmade Pieces',
    storyCtaDesc: 'Browse our latest bags, tops, hats, and small accessories.',

    footerDesc: 'Independent handmade crochet shop founded in Jordan, happily shipping to Kuwait. Made with pure cotton yarn.',
    footerExplore: 'Explore',
    footerCareJournal: 'Care Instructions',
    footerNewsletterTitle: 'Stay in Touch',
    footerNewsletterDesc: 'Receive updates when we release new handmade drops and seasonal colors.',
    footerEmailPlaceholder: 'Enter your email...',
    footerJoin: 'Subscribe',
    footerSubscribed: 'Thank you for joining our community.',
    footerRights: 'All rights reserved. HADAB Handmade Crochet.',
    footerCareHandwash: 'Hand wash gently in cool water',
    footerCareDrying: 'Reshape and dry flat in shade',
    footerCareStorage: 'Fold neatly, avoid sharp hangers',

    // Auth Pages
    authBadge: 'HADAB Community • Member Sign In',
    signInTitle: 'Welcome Back',
    signInSubtitle: 'Sign in to access your saved items, cart, and past orders.',
    signUpTitle: 'Create an Account',
    signUpSubtitle: 'Join HADAB to save your favorite pieces, track orders, and get drop updates.',
    signInTab: 'Sign In',
    signUpTab: 'Sign Up',
    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'e.g. Layla Al-Sabah',
    emailLabel: 'Email Address',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••',
    confirmPasswordLabel: 'Confirm Password',
    confirmPasswordPlaceholder: '••••••••',
    phoneLabel: 'Phone Number (Optional)',
    phonePlaceholder: '+965 9999 8888 / +962 7 9999 8888',
    rememberMe: 'Remember this device',
    forgotPassword: 'Forgot password?',
    signInButton: 'Sign In',
    signUpButton: 'Create Account',
    dontHaveAccount: "Don't have an account yet?",
    alreadyHaveAccount: 'Already have an account?',
    switchToSignUp: 'Sign Up',
    switchToSignIn: 'Sign In',
    termsNotice: 'By creating an account, you agree to our',
    termsLink: 'Terms of Service',
    privacyLink: 'Privacy Policy',
    loginSuccess: 'Welcome back to HADAB',
    registerSuccess: 'Your account has been created successfully',
    atelierMemberBadge: 'Member Benefits',
    memberBenefit1: 'Save your favorite items to your wishlist',
    memberBenefit2: 'Sync your shopping bag across all your devices',
    memberBenefit3: 'Easily track your handmade order until delivery',
    orContinueWith: 'Or continue with',
  },
  ar: {
    tickerLocation: 'صُنع في الأردن • شحن إلى الكويت',
    tickerCraft: 'مشروع كروشيه منزلي • كل قطعة مصنوعة يدوياً بحب وإتقان',
    tickerArchive: 'تغليف أنيق ومتقن مع كل طلب',
    navCollection: 'جميع المنتجات',
    navCategories: 'التصنيفات',
    navStory: 'قصتنا',
    searchPlaceholder: 'ابحث عن منتج، لون أو نوع خيط...',
    searchAria: 'البحث في المتجر',
    bagAria: 'سلة المشتريات',
    toggleLangAria: 'تبديل اللغة',
    toggleMenuAria: 'فتح قائمة التنقل',
    accountAria: 'حسابي',
    closeMenuAria: 'إغلاق قائمة التنقل',
    switchLanguageName: 'English',

    yourBag: 'سلة التسوق',
    itemsCount: 'قطع',
    emptyBagTitle: 'سلتك فارغة حالياً',
    emptyBagSubtitle: 'تصفحي منتجات الكروشيه اليدوية لتختاري قطعتك المميزة.',
    discoverCollection: 'تصفح المتجر',
    complimentaryShippingUnlocked: 'تهانينا! حصلتِ على شحن مجاني إلى الكويت',
    addForFreeDelivery: 'أضيفي بقيمة {amount} د.ك للحصول على شحن مجاني',
    subtotal: 'المجموع الفرعي',
    shipping: 'الشحن',
    free: 'مجاني',
    checkoutSecurely: 'متابعة الدفع بأمان',
    remove: 'حذف',

    heroEyebrow: 'كروشيه يدوي • مجموعة ٢٠٢٦',
    heroTagline: 'صُنعت بحب. غرزة تلو الأخرى.',
    heroSubtitle: 'مشروع منزلي في الأردن، نصنع كل قطعة بعناية ونشحنها مباشرة إلى الكويت.',
    exploreWorks: 'تصفح المجموعة',
    beat1Title1: 'غرزة تلو الأخرى.',
    beat1Title2: 'صنعت لرفقة يومك.',
    archiveBadge: 'المجموعة اليدوية',
    curatedTitle: 'قطع يدوية صنعت لرفقة يومك',
    curatedSubtitle: 'محبوكة يدوياً بدفعات محدودة باستخدام خيوط قطنية طبيعية ناعمة ومتينة.',
    viewMore: 'عرض كل المنتجات',
    addToBag: 'أضف إلى السلة',
    inspect: 'تفاصيل',
    details: 'معاينة',
    craftFamiliesBadge: 'تصنيفاتنا',
    craftFamiliesTitle: 'تسوقي حسب',
    craftFamiliesHighlight: 'التصنيف',
    craftFamiliesSubtitle: 'أربعة تصنيفات أساسية من الكروشيه اليدوي المصنوع من خيوط القطن الطبيعي.',
    family01Tab: 'الحقائب والملابس',
    family02Tab: 'القبعات والإكسسوارات',
    familyPrefix: 'تصنيف',
    viewCollection: 'عرض المنتجات',

    categoriesBadge: 'التصنيفات',
    categoriesTitle: 'تصفحي حسب التصنيف',
    categoriesSubtitle: 'اكتشفي تشكيلتنا من الحقائب، الملابس، القبعات، والإكسسوارات اليومية.',
    backToHome: 'العودة للرئيسية',
    piecesCount: 'منتجات',
    exploreThisFamily: 'عرض المنتجات',
    familyTagline: 'صنع يدوي بكل حب',

    collectionHeroTitle: 'المجموعة الكاملة',
    collectionHeroSubtitle: 'محبوكة يدوياً في الأردن من خيوط القطن الطبيعي والكتان، مغلفة بعناية وجاهزة للشحن إلى الكويت.',
    searchCollectionPlaceholder: 'ابحثي باسم المنتج، الغرزة، نوع الخيط، أو اللون...',
    searchCountWorks: 'منتجات',
    allCategories: 'الكل',
    filtersButton: 'تصفية',
    saleFilter: 'تخفيضات',
    showingOf: 'عرض',
    pieces: 'منتجات',
    sortLabel: 'ترتيب',
    sortFeatured: 'المميزة',
    sortPriceAsc: 'السعر: من الأقل للأعلى',
    sortPriceDesc: 'السعر: من الأعلى للأقل',
    sortNameAsc: 'أبجدياً',
    noMatchTitle: 'لم نجد منتجات تطابق بحثك',
    noMatchSubtitle: 'لا توجد منتجات تطابق خيارات التصفية الحالية. جربي تغيير كلمات البحث.',
    clearAllFilters: 'مسح كل الفلاتر',
    resetFilters: 'إعادة ضبط',
    filterDrawerTitle: 'تصفية المنتجات',
    priceCeiling: 'الحد الأقصى للسعر',
    allFibers: 'جميع الخامات',
    allColors: 'جميع الألوان',
    applyFilters: 'تطبيق الفلاتر',

    studioOriginal: 'تصميم أصلي',
    inspectStitch: 'معاينة تفاصيل الغرزة والخيط',
    showFullPiece: 'عرض القطعة كاملة',
    artisanSpecifications: 'تفاصيل المنتج',
    yarnMaterial: 'نوع الخيط',
    stitchPattern: 'تقنية الغرزة',
    colorPalette: 'اللون',
    handmakingTime: 'وقت العمل اليدوي',
    craftHeritage: 'طريقة الصنع',
    craftHeritageDesc: '١٠٠٪ كروشيه يدوي من منزلنا في الأردن، مشحون بأمان إلى الكويت والأردن.',
    freeShippingNote: 'شحن مجاني للكويت على الطلبات أكثر من ٢٥ د.ك.',
    addedToBagNotification: 'تمت الإضافة إلى سلتك',

    storyBadge: 'قصتنا وهدفنا',
    storyMainTitle: 'مشروع منزلي مستلهم من سحر',
    storyMainHighlight: 'التفاصيل الصغيرة',
    storyHeroDesc: 'هَدَب هو مشروع كروشيه منزلي تأسس في الأردن بدافع الحب للحرفة اليدوية. نصنع كل حقيبة وقبعة وإكسسوار يدوي خطوة بخطوة، ونرسلها لعملائنا في الكويت والأردن.',
    storyNounLabel: 'معنى هَدَب',
    storyCraftLabel: 'حرفة يدوية',
    storyQuote: 'الهَدَب هو الخيوط والزوائد الناعمة المتدلية من أطراف الثوب أو المنسوجة. تفاصيل صغيرة تمنح الشيء روحه وتميّزه.',
    storyPronounceAria: 'استمعي إلى النطق',
    actIHeadline: 'صنع يدوي في عالم سريع',
    actISub: 'لماذا نحيك كل قطعة بأيدينا؟',
    actIP1: 'بدأت هَدَب من شغف بالحياكة اليدوية الأصيلة. نؤمن بأن الحقائب والإكسسوارات اليومية يجب أن تكون ذات طابع شخصي دافئ ويدوم طويلاً بعيداً عن المنتجات المصنعية المكررة.',
    actIP2: 'عندما تقتنين قطعة من هَدَب، ستشعرين بنعومة وقوة خيوط القطن العالية واهتمامنا بكل غرزة. كل قطعة يدوية لها بصمتها الخاصة.',
    dualCitiesBadge: 'صنع في الأردن • شحن إلى الكويت',
    dualCitiesTitle: 'من الأردن بكل حب، إلى باب بيتك في الكويت',
    dualCitiesSubtitle: 'نصنعها بكل عناية في عمّان ونشحنها سريعاً ومباشرة إلى عملائنا الأعزاء في الكويت.',
    ammanTab: 'صنع في الأردن',
    kuwaitTab: 'شحن للكويت',
    ammanDesc: 'نصمم ونحيك جميع القطع في الأردن باستخدام خيوط قطنية صافية وحبال متينة بألوان دافئة.',
    kuwaitDesc: 'نشحن بشكل دوري وسريع إلى كافة مناطق الكويت مع تغليف آمن وأنيق.',
    craftPhilosophyTitle: 'ما يميزنا',
    craftItem1Title: 'خامات طبيعية متينة',
    craftItem1Desc: 'نختار حبال قطنية ممتازة وخيوط ناعمة تحافظ على قوام القطعة وشكلها الطبيعي.',
    craftItem2Title: 'صنع يدوي بحت',
    craftItem2Desc: 'تُحاك القطعة من أول حلقة وحتى آخر شرّابة بأيدينا وبكامل الصبر والاهتمام.',
    craftItem3Title: 'دفعات صغيرة متقنة',
    craftItem3Desc: 'ننتج كميات محدودة للحفاظ على أعلى مستوى من الإتقان والاهتمام بكل زبونة.',
    storyCtaTitle: 'تصفحي منتجاتنا اليدوية',
    storyCtaDesc: 'اكتشفي تشكيلتنا المميزة من الحقائب، الملابس، القبعات، والإكسسوارات.',

    footerDesc: 'مشروع كروشيه منزلي مستقل في الأردن، نشحن بكل حب إلى الكويت. مصنوعة من خيوط قطنية طبيعية.',
    footerExplore: 'استكشاف',
    footerCareJournal: 'طريقة العناية',
    footerNewsletterTitle: 'خليكِ على تواصل',
    footerNewsletterDesc: 'اشتركي لمعرفة كل ما ننزل قطع أو ألوان يدوية جديدة.',
    footerEmailPlaceholder: 'أدخلي بريدك الإلكتروني...',
    footerJoin: 'اشتراك',
    footerSubscribed: 'شكراً لانضمامك إلى مجتمع هَدَب.',
    footerRights: 'جميع الحقوق محفوظة. هَدَب للمشغولات اليدوية.',
    footerCareHandwash: 'غسيل يدوي لطيف بماء بارد',
    footerCareDrying: 'فرد القطعة وتجفيفها أفقياً في الظل',
    footerCareStorage: 'طيّ أنيق وتجنب التعليق على أطراف حادة',

    // Auth Pages
    authBadge: 'دائرة الأتيليه • بوابة الأعضاء',
    signInTitle: 'أهلاً بعودتك',
    signInSubtitle: 'سجّلي دخولك للوصول إلى حقيبتك المحفوظة، وتتبّع قطعك المنسوجة، والأرشيف الحصري.',
    signUpTitle: 'إنشاء حساب جديد',
    signUpSubtitle: 'انضمي إلى دائرة مشغلنا للاطلاع المبكر على القطع المحدودة، وحفظ تفضيلاتك الحرفية.',
    signInTab: 'تسجيل الدخول',
    signUpTab: 'إنشاء حساب',
    fullNameLabel: 'الاسم الكامل',
    fullNamePlaceholder: 'مثال: ليلى الصباح',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'كلمة المرور',
    passwordPlaceholder: '••••••••',
    confirmPasswordLabel: 'تأكيد كلمة المرور',
    confirmPasswordPlaceholder: '••••••••',
    phoneLabel: 'رقم الهاتف (اختياري)',
    phonePlaceholder: '+965 9999 8888 / +962 7 9999 8888',
    rememberMe: 'تذكّر هذا الجهاز',
    forgotPassword: 'نسيت كلمة المرور؟',
    signInButton: 'دخول إلى المشغل',
    signUpButton: 'إنشاء حساب في هَدَب',
    dontHaveAccount: 'ليس لديكِ حساب بعد؟',
    alreadyHaveAccount: 'لديكِ حساب في المشغل بالفعل؟',
    switchToSignUp: 'انضمي الآن',
    switchToSignIn: 'تسجيل الدخول',
    termsNotice: 'بإنشاء الحساب، أنتِ توافقين على',
    termsLink: 'شروط المشغل الحرفية',
    privacyLink: 'سياسة الخصوصية',
    loginSuccess: 'أهلاً بعودتكِ إلى مشغل هَدَب',
    registerSuccess: 'تم إنشاء حسابكِ الحرفي بنجاح',
    atelierMemberBadge: 'مزايا دائرة المشغل',
    memberBenefit1: 'أسبقية الحجز في مجموعات الدفعات المحدودة والمرقمة',
    memberBenefit2: 'مزامنة الحقيبة وقائمة المفضلات عبر جميع أجهزتكِ',
    memberBenefit3: 'تتبّع دقيق لكل مرحلة حياكة حتى وصول الصندوق لبابكِ',
    orContinueWith: 'أو المتابعة باستخدام',
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
