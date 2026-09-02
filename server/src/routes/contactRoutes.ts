import { Router } from 'express';
import { contactController } from '../controllers/contactController.js';
import { contactLimiter } from '../middleware/rateLimiter.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public submission with rate limiting
router.post('/', contactLimiter, contactController.submitContact);

// Admin management
router.get('/', authenticate, requireAdmin, contactController.getMessages);
router.patch('/:id', authenticate, requireAdmin, contactController.updateStatus);
router.patch('/:id/read', authenticate, requireAdmin, (req, res) => {
  req.body.status = 'READ';
  return contactController.updateStatus(req, res);
});
router.delete('/:id', authenticate, requireAdmin, contactController.deleteMessage);

export default router;
