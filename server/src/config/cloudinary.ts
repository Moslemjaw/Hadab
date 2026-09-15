import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'melvk5od',
  api_key: process.env.CLOUDINARY_API_KEY || '971785786979724',
  api_secret: process.env.CLOUDINARY_API_SECRET || '5XAU8fxOz1mjX2fJHNculkwE9HM',
  secure: true,
});

export { cloudinary };
