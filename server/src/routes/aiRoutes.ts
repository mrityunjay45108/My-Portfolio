import { Router } from 'express';
import { aiController } from '../controllers/aiController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public Visitor Endpoints
router.post('/chat', aiController.chat);
router.post('/chat/stream', aiController.streamChat);
router.get('/suggested-questions', aiController.getSuggestedQuestions);

// Protected Admin Endpoints
router.get('/admin/stats', authenticate, requireAdmin, aiController.getAdminStats);
router.put('/admin/settings', authenticate, requireAdmin, aiController.updateSettings);
router.delete('/admin/conversations', authenticate, requireAdmin, aiController.clearConversations);

export default router;
