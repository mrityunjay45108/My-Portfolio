import { Router } from 'express';
import authRoutes from './authRoutes.js';
import projectRoutes from './projectRoutes.js';
import blogRoutes from './blogRoutes.js';
import caseStudyRoutes from './caseStudyRoutes.js';
import technologyRoutes from './technologyRoutes.js';
import contactRoutes from './contactRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import mediaRoutes from './mediaRoutes.js';
import githubRoutes from './githubRoutes.js';
import adminGithubRoutes from './adminGithubRoutes.js';
import aiRoutes from './aiRoutes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/projects', projectRoutes);
apiRouter.use('/blog', blogRoutes);
apiRouter.use('/case-studies', caseStudyRoutes);
apiRouter.use('/technologies', technologyRoutes);
apiRouter.use('/contact', contactRoutes);
apiRouter.use('/analytics', analyticsRoutes);
apiRouter.use('/media', mediaRoutes);
apiRouter.use('/github', githubRoutes);
apiRouter.use('/admin/github', adminGithubRoutes);
apiRouter.use('/ai', aiRoutes);

// Health check endpoint
apiRouter.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Portfolio API is operating smoothly',
    timestamp: new Date().toISOString(),
  });
});

export default apiRouter;
