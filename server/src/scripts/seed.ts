import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { Order } from '../models/Order';

dotenv.config();

const INITIAL_CATEGORIES = [
  {
    name: 'Bags & Totes',
    nameAr: 'الحقائب والشنط',
    slug: 'bags',
    description: 'Cotton and cord totes made to carry your everyday essentials.',
    descriptionAr: 'حقائب كتف وتسوق مصنوعة من حبال القطن المتينة لحمل احتياجاتك اليومية.',
    count: 14,
    color: '#D9B99B',
    image: '/products/hadab-bag.jpg',
    accentBg: 'bg-blush-100/70',
    accentBorder: 'border-blush-300',
  },
  {
    name: 'Wearables',
    nameAr: 'الملابس',
    slug: 'clothing',
    description: 'Light cardigans, mesh tops, and waistcoats crocheted from soft natural fibers.',
    descriptionAr: 'كارديجان خفيف وقطع محبوكة ناعمة من ألياف البامبو والكتان الطبيعي.',
    count: 8,
    color: '#A3B99B',
    image: '/products/hadab-cardigan.jpg',
    accentBg: 'bg-sage-100/70',
    accentBorder: 'border-sage-300',
  },
  {
    name: 'Hats & Headwear',
    nameAr: 'القبعات والأغطية',
    slug: 'headwear',
    description: 'Bucket hats, fitted hats, and beanies crocheted from pure cotton.',
    descriptionAr: 'قبعات بحافة متماسكة وطواقي مريحة محبوكة من خيوط القطن الصافي.',
    count: 11,
    color: '#C9B99B',
    image: '/products/hadab-hat.jpg',
    accentBg: 'bg-cream-100',
    accentBorder: 'border-brown-200',
  },
  {
    name: 'Accessories',
    nameAr: 'الإكسسوارات',
    slug: 'pouches',
    description: 'Clutches, small pouches, and crochet accessories with handmade trims.',
    descriptionAr: 'كلاتشات ومحافظ صغيرة وحافظات يومية مزينة بشرّابات هَدَب اليدوية.',
    count: 12,
    color: '#B9C9CB',
    image: '/products/hadab-pouch.jpg',
    accentBg: 'bg-burgundy-50/70',
    accentBorder: 'border-burgundy-200',
  },
];

const INITIAL_PRODUCTS = [
  {
    name: 'The Trapillo Shoulder Tote',
    nameArabic: 'حقيبة هَدَب المجدولة',
    price: 135,
    category: 'bags',
    image: '/products/hadab-bag.jpg',
    textureImage: '/products/hadab-bag.jpg',
    tag: 'Signature Piece',
    tagArabic: 'قطعة مميزة',
    description: 'Made from charcoal and cream cotton cord, with loop handles and a strong base.',
    descriptionArabic: 'مصنوعة من حبال القطن الفاخرة بلوني الفحم والكريم، مع مقابض حلقية وقاعدة متينة.',
    stitchDetail: 'Single crochet ribbed wall with continuous braided handle',
    stitchDetailArabic: 'جدار مضلع بغرزة الحشو مع مقبض مجدول متصل',
    yarnType: '100% Recycled Cotton Cord (5mm)',
    yarnTypeArabic: 'خيط قطن معاد تدويره ١٠٠٪ (٥ ملم)',
    colorName: 'Charcoal & Cream Fleck',
    colorNameArabic: 'فحم وكريم منقط',
    colorHex: '#4A382F',
    isFeatured: true,
    isSale: false,
    stockCount: 15,
  },
  {
    name: 'The Slouchy Market Net',
    nameArabic: 'حقيبة السوق المنسوجة',
    price: 95,
    originalPrice: 120,
    category: 'bags',
    image: '/products/hadab-bag.jpg',
    textureImage: '/products/hadab-bag.jpg',
    tag: 'Archive Drop',
    tagArabic: 'إصدار الأرشيف',
    description: 'An expansive open-lace market bag handcrafted from twisted linen cord with reinforced base gusset.',
    descriptionArabic: 'حقيبة تسوق شبكية واسعة محبوكة يدوياً من خيوط الكتان المجدولة مع قاعدة معززة.',
    stitchDetail: 'Open trellis knotting with double-thick base',
    stitchDetailArabic: 'عقد شبكية مفتوحة مع قاعدة مزدوجة السماكة',
    yarnType: 'Braided Linen & Raw Cotton',
    yarnTypeArabic: 'كتان مجدول وقطن خام',
    colorName: 'Unbleached Flax',
    colorNameArabic: 'كتان طبيعي خام',
    colorHex: '#D8CAB8',
    isFeatured: false,
    isSale: true,
    stockCount: 8,
  },
  {
    name: 'The Sculpted Cylinder Tote',
    nameArabic: 'حقيبة الأسطوانة الهيكلية',
    price: 145,
    category: 'bags',
    image: '/products/hadab-bag.jpg',
    textureImage: '/products/hadab-bag.jpg',
    tag: 'Architectural Cut',
    tagArabic: 'قصة معمارية',
    description: 'A rigid cylindrical body constructed from high-twist cotton cable with integrated shoulder strap.',
    descriptionArabic: 'هيكل أسطواني متماسك محبوك من كابلات القطن عالي الشد مع حزام كتف مدمج.',
    stitchDetail: 'Dense waffle stitch on circular wooden base',
    stitchDetailArabic: 'غرزة الوافل الكثيفة على قاعدة خشبية دائرية',
    yarnType: 'High-Twist Cable Cotton',
    yarnTypeArabic: 'قطن كابلي عالي الشد',
    colorName: 'Oatmeal Tweed',
    colorNameArabic: 'توييد الشوفان',
    colorHex: '#C5B59E',
    isFeatured: true,
    isSale: false,
    stockCount: 12,
  },
  {
    name: 'The Knotted Fringe Shopper',
    nameArabic: 'حقيبة الشرّابات العريضة',
    price: 165,
    category: 'bags',
    image: '/products/hadab-bag.jpg',
    textureImage: '/products/hadab-bag.jpg',
    tag: 'Signature Hadab',
    tagArabic: 'هَدَب الأصيل',
    description: 'Deep rectangular silhouette crowned with full hand-tied hadab fringe on both side seams.',
    descriptionArabic: 'هيكل مستطيل رحب متوج بشرّابات هَدَب المعقودة يدوياً على جانبي الحقيبة.',
    stitchDetail: 'Double-threaded Tunisian rib with 18cm hand-tied fringe',
    stitchDetailArabic: 'تضليع تونسي مزدوج الخيط مع شرّابات ١٨ سم',
    yarnType: 'Organic Combed Cotton Ribbon',
    yarnTypeArabic: 'شريط قطن ممشط عضوي',
    colorName: 'Raw Bone & Walnut',
    colorNameArabic: 'عاجي وجوزي',
    colorHex: '#EAE3D6',
    isFeatured: true,
    isSale: false,
    stockCount: 6,
  },
  {
    name: 'Open-Stitch Crop Cardigan',
    nameArabic: 'كارديجان صيفي مخرم',
    price: 185,
    category: 'clothing',
    image: '/products/hadab-cardigan.jpg',
    textureImage: '/products/hadab-cardigan.jpg',
    tag: 'Handmade Wearable',
    tagArabic: 'ملبوسات يدوية',
    description: 'Breezy boxy silhouette with dropped shoulders and natural shell-button closure.',
    descriptionArabic: 'قصة فضفاضة مريحة مع أكتاف منسدلة وأزرار صدف طبيعي مصقولة يدوياً.',
    stitchDetail: 'Filagree lace-crochet blocks with scallop edges',
    stitchDetailArabic: 'مربعات مفرغة بغرزة الفيليه مع حواف صدفية',
    yarnType: 'Silk-Bamboo & Egyptian Mako Cotton',
    yarnTypeArabic: 'حرير البامبو وقطن ماكو المصري',
    colorName: 'Pale Sage',
    colorNameArabic: 'ميرمية هادئة',
    colorHex: '#C8D5C0',
    isFeatured: true,
    isSale: false,
    stockCount: 7,
  },
  {
    name: 'The Structured Wide-Brim Sun Hat',
    nameArabic: 'قبعة الشمس عريضة الحافة',
    price: 78,
    category: 'headwear',
    image: '/products/hadab-hat.jpg',
    textureImage: '/products/hadab-hat.jpg',
    tag: 'Summer Edition',
    tagArabic: 'إصدار الصيف',
    description: 'Firm yet foldable sun shield crocheted with raffia-blend yarn and a wire-free moldable brim.',
    descriptionArabic: 'حماية أنيقة من الشمس قابلة للطي برفق، محبوكة من خيوط الرافيا والقطن.',
    stitchDetail: 'Concentric single-crochet spirals with memory brim',
    stitchDetailArabic: 'حلزونات متحدة المركز بغرزة الحشو الدقيقة',
    yarnType: 'Cotton-Linen Cord',
    yarnTypeArabic: 'حبال الكتان والقطن الصافي',
    colorName: 'Desert Dune',
    colorNameArabic: 'كثبان الصحراء',
    colorHex: '#DECBB5',
    isFeatured: false,
    isSale: false,
    stockCount: 14,
  },
  {
    name: 'The Archival Cosmetic Pouch',
    nameArabic: 'حقيبة مستحضرات الزينة',
    price: 48,
    category: 'pouches',
    image: '/products/hadab-pouch.jpg',
    textureImage: '/products/hadab-pouch.jpg',
    tag: 'Everyday Essential',
    tagArabic: 'أساسيات يومية',
    description: 'Compact zip pouch with thick tactile ribbing, waterproof linen liner, and hand-braided zip pull.',
    descriptionArabic: 'حقيبة صغيرة مع سحاب مدمج وبطانة كتان عازلة ومقبض سحاب مجدول يدوياً.',
    stitchDetail: 'Crossed treble ribs with hand-sewn YKK brass zip',
    stitchDetailArabic: 'أعمدة ثلاثية متقاطعة مع سحاب نحاسي متين',
    yarnType: '100% Recycled Cotton Thread',
    yarnTypeArabic: 'خيط قطن طبيعي ١٠٠٪',
    colorName: 'Terracotta Clay',
    colorNameArabic: 'طين فخاري',
    colorHex: '#C27D66',
    isFeatured: false,
    isSale: false,
    stockCount: 20,
  },
];

const INITIAL_ORDERS = [
  {
    orderNumber: 'HDB-2026-089',
    customerName: 'Layla Al-Sabah',
    customerEmail: 'layla.s@example.kw',
    customerPhone: '+965 9912 3456',
    destination: 'Kuwait',
    destinationArabic: 'الكويت',
    items: [
      {
        name: 'The Trapillo Shoulder Tote',
        nameArabic: 'حقيبة هَدَب المجدولة',
        price: 135,
        image: '/products/hadab-bag.jpg',
        quantity: 1,
      },
    ],
    total: 135,
    status: 'hooking',
    statusArabic: 'قيد الحياكة اليدوية',
    artisan: 'Noor (Amman Workshop)',
  },
  {
    orderNumber: 'HDB-2026-088',
    customerName: 'Tariq Al-Majali',
    customerEmail: 'tariq.m@example.jo',
    customerPhone: '+962 7 9876 5432',
    destination: 'Jordan',
    destinationArabic: 'الأردن',
    items: [
      {
        name: 'The Slouchy Market Net',
        nameArabic: 'حقيبة السوق المنسوجة',
        price: 95,
        image: '/products/hadab-bag.jpg',
        quantity: 1,
      },
      {
        name: 'The Knotted Fringe Shopper',
        nameArabic: 'حقيبة الشرّابات العريضة',
        price: 165,
        image: '/products/hadab-bag.jpg',
        quantity: 1,
      },
    ],
    total: 260,
    status: 'finishing',
    statusArabic: 'تشطيب الأطراف والأرشيف',
    artisan: 'Rania (Kuwait Workshop)',
  },
  {
    orderNumber: 'HDB-2026-087',
    customerName: 'Mona Al-Ghanim',
    customerEmail: 'mona.g@example.kw',
    customerPhone: '+965 5543 2109',
    destination: 'Kuwait',
    destinationArabic: 'الكويت',
    items: [
      {
        name: 'The Archival Cosmetic Pouch',
        nameArabic: 'حقيبة مستحضرات الزينة',
        price: 48,
        image: '/products/hadab-pouch.jpg',
        quantity: 1,
      },
    ],
    total: 48,
    status: 'shipped',
    statusArabic: 'تم الشحن مع الشحن السريع',
    artisan: 'Noor (Amman Workshop)',
  },
  {
    orderNumber: 'HDB-2026-086',
    customerName: 'Zeinab Farhan',
    customerEmail: 'zeinab.f@example.ae',
    customerPhone: '+971 50 123 4567',
    destination: 'UAE',
    destinationArabic: 'الإمارات',
    items: [
      {
        name: 'The Trapillo Shoulder Tote',
        nameArabic: 'حقيبة هَدَب المجدولة',
        price: 135,
        image: '/products/hadab-bag.jpg',
        quantity: 2,
      },
    ],
    total: 270,
    status: 'delivered',
    statusArabic: 'تم التسليم بنجاح',
    artisan: 'Hala (Amman Workshop)',
  },
];

async function seed() {
  try {
    await connectDB();
    console.log('[Seed] Database connected, initiating seeding sequence...');

    // 1. Seed Admin Account
    const adminEmail = 'byhadab@gmail.com';
    const adminPassword = 'Byhadab2026@';

    let admin = await User.findOne({ email: adminEmail });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    if (admin) {
      admin.password = hashedPassword;
      admin.role = 'admin';
      admin.name = 'HADAB Admin';
      admin.status = 'vip';
      await admin.save();
      console.log(`[Seed] Admin account updated: ${adminEmail}`);
    } else {
      admin = await User.create({
        name: 'HADAB Admin',
        email: adminEmail,
        password: hashedPassword,
        phone: '+965 9900 0000',
        role: 'admin',
        status: 'vip',
        country: 'Kuwait',
      });
      console.log(`[Seed] Admin account created: ${adminEmail}`);
    }

    // 2. Seed Categories
    for (const cat of INITIAL_CATEGORIES) {
      await Category.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true, new: true });
    }
    console.log(`[Seed] ${INITIAL_CATEGORIES.length} Categories seeded.`);

    // 3. Seed Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(INITIAL_PRODUCTS);
      console.log(`[Seed] ${INITIAL_PRODUCTS.length} Signature Products seeded.`);
    } else {
      console.log(`[Seed] Products already present (${productCount} found).`);
    }

    // 4. Seed Initial Orders
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      await Order.insertMany(INITIAL_ORDERS);
      console.log(`[Seed] ${INITIAL_ORDERS.length} Bespoke Orders seeded.`);
    } else {
      console.log(`[Seed] Orders already present (${orderCount} found).`);
    }

    // 5. Seed Customer profiles from orders
    for (const order of INITIAL_ORDERS) {
      const existingCustomer = await User.findOne({ email: order.customerEmail.toLowerCase() });
      if (!existingCustomer) {
        const dummyPw = await bcrypt.hash('HadabGuest2026!', salt);
        await User.create({
          name: order.customerName,
          email: order.customerEmail.toLowerCase(),
          password: dummyPw,
          phone: order.customerPhone,
          role: 'customer',
          status: 'active',
          country: order.destination,
          totalOrders: 1,
          totalSpent: order.total,
          lastOrderDate: 'Recent',
        });
      }
    }
    console.log('[Seed] Verified initial Customer records.');

    console.log('[Seed] Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    process.exit(1);
  }
}

seed();
