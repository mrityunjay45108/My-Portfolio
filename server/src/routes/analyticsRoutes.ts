import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { analyticsSchema } from '../validators/index.js';

const router = Router();

// Public event tracking
router.post('/track', validateRequest(analyticsSchema), AnalyticsController.track);

// Admin dashboard statistics
router.get('/stats', authenticate, requireAdmin, AnalyticsController.getStats);

export default router;
