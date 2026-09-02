import { Router } from 'express';
import { BlogController } from '../controllers/blogController.js';
import { authenticate, requireAdmin, optionalAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { blogPostSchema, blogCategorySchema } from '../validators/index.js';

const router = Router();

// Public routes
router.get('/', optionalAuth, BlogController.getPosts);
router.get('/categories', BlogController.getCategories);
router.get('/tags', BlogController.getTags);
router.get('/:slug', optionalAuth, BlogController.getPost);

// Admin protected routes
router.post('/', authenticate, requireAdmin, validateRequest(blogPostSchema), BlogController.createPost);
router.put('/:id', authenticate, requireAdmin, validateRequest(blogPostSchema.partial()), BlogController.updatePost);
router.delete('/:id', authenticate, requireAdmin, BlogController.deletePost);

// Category admin routes
router.post('/categories', authenticate, requireAdmin, validateRequest(blogCategorySchema), BlogController.createCategory);
router.delete('/categories/:id', authenticate, requireAdmin, BlogController.deleteCategory);

export default router;
