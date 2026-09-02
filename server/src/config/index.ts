import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod-min-32-chars',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieDomain: process.env.COOKIE_DOMAIN || undefined,
  initialAdmin: {
    email: process.env.INITIAL_ADMIN_EMAIL || 'admin@mrityunjay.dev',
    password: process.env.INITIAL_ADMIN_PASSWORD || 'AdminSecurePassword123!',
    name: process.env.INITIAL_ADMIN_NAME || 'Mrityunjay Kumar',
  },
  storage: {
    provider: process.env.STORAGE_PROVIDER || 'local',
    localDir: process.env.STORAGE_LOCAL_DIR || 'uploads',
  },
  github: {
    username: process.env.GITHUB_USERNAME || 'mrityunjay45108',
    token: process.env.GITHUB_TOKEN || '',
    apiUrl: process.env.GITHUB_API_URL || 'https://api.github.com',
  },
};
