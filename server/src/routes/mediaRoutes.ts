import { Router } from 'express';
import { MediaController } from '../controllers/mediaController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// Admin media upload endpoint
router.post('/upload', authenticate, requireAdmin, upload.single('file'), MediaController.uploadFile);

export default router;
