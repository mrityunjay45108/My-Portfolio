import { Router } from 'express';
import { ProjectController } from '../controllers/projectController.js';
import { authenticate, requireAdmin, optionalAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { projectSchema, projectImageSchema, imageReorderSchema } from '../validators/index.js';

const router = Router();

// Public routes
router.get('/', optionalAuth, ProjectController.getProjects);
router.get('/featured', ProjectController.getFeaturedProjects);
router.get('/:slugOrId', optionalAuth, ProjectController.getProject);

// Admin protected routes
router.post('/', authenticate, requireAdmin, validateRequest(projectSchema), ProjectController.createProject);
router.put('/:id', authenticate, requireAdmin, validateRequest(projectSchema.partial()), ProjectController.updateProject);
router.delete('/:id', authenticate, requireAdmin, ProjectController.deleteProject);

// Project image routes
router.post('/:id/images', authenticate, requireAdmin, validateRequest(projectImageSchema), ProjectController.addImage);
router.delete('/:id/images/:imageId', authenticate, requireAdmin, ProjectController.deleteImage);
router.put('/:id/images/reorder', authenticate, requireAdmin, validateRequest(imageReorderSchema), ProjectController.reorderImages);

export default router;
