import { Router } from 'express';
import {
  getAdminFeaturedRepositories,
  createAdminFeaturedRepository,
  updateAdminFeaturedRepository,
  deleteAdminFeaturedRepository,
  syncGitHubRepositories,
} from '../controllers/adminGithubController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Protect all admin GitHub routes
router.use(authenticate);
router.use(requireAdmin);

router.get('/featured', getAdminFeaturedRepositories);
router.post('/featured', createAdminFeaturedRepository);
router.put('/featured/:id', updateAdminFeaturedRepository);
router.delete('/featured/:id', deleteAdminFeaturedRepository);
router.post('/sync', syncGitHubRepositories);

export default router;
