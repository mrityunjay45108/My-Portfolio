import { Router } from 'express';
import { SettingsController } from '../controllers/settingsController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public: Get current active resume URL
router.get('/resume', SettingsController.getResume);

// Admin: Update resume URL (e.g. Cloudinary PDF link)
router.put('/resume', authenticate, requireAdmin, SettingsController.updateResume);
router.post('/resume', authenticate, requireAdmin, SettingsController.updateResume);

// Admin: Get all settings
router.get('/', authenticate, requireAdmin, SettingsController.getSettings);

export default router;
