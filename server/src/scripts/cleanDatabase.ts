import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { Order } from '../models/Order';

// 1. Load environment from server/.env using dotenv
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const cleanDatabase = async () => {
  try {
    // 2. Connect to MongoDB Atlas using MONGODB_URL and dbName: 'hadab_atelier'
    const mongoURI = process.env.MONGODB_URL;
    if (!mongoURI) {
      throw new Error('MONGODB_URL is not defined in environment variables');
    }

    console.log('[MongoDB] Connecting to MongoDB Atlas (dbName: hadab_atelier)...');
    await mongoose.connect(mongoURI, {
      dbName: 'hadab_atelier',
    });
    console.log('[MongoDB] Connected successfully.\n');

    // 3. Count products, orders, categories, and users (both admins and customers)
    console.log('=== BEFORE CLEANUP COUNTS ===');
    const initialProductCount = await Product.countDocuments();
    const initialOrderCount = await Order.countDocuments();
    const initialCategoryCount = await Category.countDocuments();
    const initialAdminCount = await User.countDocuments({ role: 'admin' });
    const initialCustomerCount = await User.countDocuments({ role: { $ne: 'admin' } });
    const initialTotalUserCount = await User.countDocuments();

    console.log(`- Products: ${initialProductCount}`);
    console.log(`- Orders: ${initialOrderCount}`);
    console.log(`- Categories: ${initialCategoryCount}`);
    console.log(`- Total Users: ${initialTotalUserCount} (Admins: ${initialAdminCount}, Customers: ${initialCustomerCount})\n`);

    console.log('Cleaning database...');

    // 4. Delete ALL products using Product.deleteMany({})
    const productDeleteResult = await Product.deleteMany({});
    console.log(`✓ Deleted ${productDeleteResult.deletedCount} products.`);

    // 5. Delete ALL orders using Order.deleteMany({})
    const orderDeleteResult = await Order.deleteMany({});
    console.log(`✓ Deleted ${orderDeleteResult.deletedCount} orders.`);

    // 6. Delete ALL non-admin users using User.deleteMany({ $and: [{ role: { $ne: 'admin' } }, { email: { $ne: 'byhadab@gmail.com' } }] })
    const userDeleteResult = await User.deleteMany({
      $and: [
        { role: { $ne: 'admin' } },
        { email: { $ne: 'byhadab@gmail.com' } },
      ],
    });
    console.log(`✓ Deleted ${userDeleteResult.deletedCount} non-admin users.\n`);

    // 7 & 8. Categories and Admin User kept intact

    // 9. Log detailed before and after counts and list of remaining categories and admin user
    console.log('=== AFTER CLEANUP COUNTS ===');
    const finalProductCount = await Product.countDocuments();
    const finalOrderCount = await Order.countDocuments();
    const finalCategoryCount = await Category.countDocuments();
    const finalAdminCount = await User.countDocuments({ role: 'admin' });
    const finalCustomerCount = await User.countDocuments({ role: { $ne: 'admin' } });
    const finalTotalUserCount = await User.countDocuments();

    console.log(`- Products: ${finalProductCount}`);
    console.log(`- Orders: ${finalOrderCount}`);
    console.log(`- Categories: ${finalCategoryCount}`);
    console.log(`- Total Users: ${finalTotalUserCount} (Admins: ${finalAdminCount}, Customers: ${finalCustomerCount})\n`);

    console.log('=== REMAINING CATEGORIES ===');
    const remainingCategories = await Category.find({}).lean();
    if (remainingCategories.length === 0) {
      console.log('No categories found.');
    } else {
      remainingCategories.forEach((cat, index) => {
        console.log(`  ${index + 1}. [${cat.slug}] "${cat.name}" / "${cat.nameAr}" (color: ${cat.color})`);
      });
    }

    console.log('\n=== REMAINING ADMIN USERS ===');
    const remainingUsers = await User.find({}).lean();
    if (remainingUsers.length === 0) {
      console.log('No users found.');
    } else {
      remainingUsers.forEach((usr, index) => {
        console.log(`  ${index + 1}. Name: ${usr.name} | Email: ${usr.email} | Role: ${usr.role} | Status: ${usr.status}`);
      });
    }

    console.log('\n[Success] Database cleanup completed.');
  } catch (error) {
    console.error('[Error] Database cleanup failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('[MongoDB] Disconnected.');
  }
};

cleanDatabase();
