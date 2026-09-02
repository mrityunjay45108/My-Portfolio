import { Router } from 'express';
import {
  getGitHubProfile,
  getGitHubRepositories,
  getGitHubRepository,
  getGitHubLanguages,
  getGitHubActivity,
  getGitHubContributions,
} from '../controllers/githubController';
import { generalLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(generalLimiter);

router.get('/profile', getGitHubProfile);
router.get('/repositories', getGitHubRepositories);
router.get('/repositories/:owner/:repo', getGitHubRepository);
router.get('/languages', getGitHubLanguages);
router.get('/activity', getGitHubActivity);
router.get('/contributions', getGitHubContributions);

export default router;
