import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { validateRequest } from '../middleware/validate.js';
import { loginSchema } from '../validators/index.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/login', authLimiter, validateRequest(loginSchema), AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/me', authenticate, AuthController.getMe);

export default router;
