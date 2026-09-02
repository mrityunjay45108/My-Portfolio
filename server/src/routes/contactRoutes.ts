import { Router } from 'express';
import { ContactController } from '../controllers/contactController.js';
import { contactLimiter } from '../middleware/rateLimiter.js';
import { validateRequest } from '../middleware/validate.js';
import { contactSchema } from '../validators/index.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public submission with rate limiting
router.post('/', contactLimiter, validateRequest(contactSchema), ContactController.sendMessage);

// Admin management
router.get('/', authenticate, requireAdmin, ContactController.getMessages);
router.patch('/:id/read', authenticate, requireAdmin, ContactController.markAsRead);
router.delete('/:id', authenticate, requireAdmin, ContactController.deleteMessage);

export default router;
