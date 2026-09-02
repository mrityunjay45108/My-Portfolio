import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public event tracking
router.post('/events', analyticsController.recordEvent);
router.post('/track', analyticsController.recordEvent);

// Admin analytics endpoints
router.get('/overview', authenticate, requireAdmin, analyticsController.getOverview);
router.get('/stats', authenticate, requireAdmin, analyticsController.getOverview);
router.get('/projects', authenticate, requireAdmin, analyticsController.getProjects);
router.get('/funnel', authenticate, requireAdmin, analyticsController.getFunnel);
router.get('/sources', authenticate, requireAdmin, analyticsController.getSources);
router.get('/export', authenticate, requireAdmin, analyticsController.exportCsv);
router.post('/cleanup', authenticate, requireAdmin, analyticsController.cleanup);

export default router;
