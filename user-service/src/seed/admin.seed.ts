import bcrypt from 'bcrypt';
import { MONGO_URI, ADMIN_CREDENTIALS } from '../config/envConfig';
import { connectDB, disconnectDB } from '../config/dbConfig';
import { User } from '../models/userModel';
import { logger } from '../utils/logger';

const seedAdmin = async () => {
  try {
    await connectDB(MONGO_URI);

    const existingAdmin = await User.findOne({ email: ADMIN_CREDENTIALS.email });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(ADMIN_CREDENTIALS.password, 10);

      await User.create({
        name: 'Admin',
        email: ADMIN_CREDENTIALS.email,
        password: hashedPassword,
        role: 'admin',
      });
      logger.info('Admin user created');
    } else {
      logger.info('Admin already exists');
    }
  } catch (error: any) {
    logger.error('Error seeding admin:', error.message);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
};

seedAdmin();
