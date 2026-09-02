import { Router } from 'express';
import { CaseStudyController } from '../controllers/caseStudyController.js';
import { authenticate, requireAdmin, optionalAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { caseStudySchema } from '../validators/index.js';

const router = Router();

// Public routes
router.get('/', optionalAuth, CaseStudyController.getCaseStudies);
router.get('/:slug', optionalAuth, CaseStudyController.getCaseStudy);

// Admin protected routes
router.post('/', authenticate, requireAdmin, validateRequest(caseStudySchema), CaseStudyController.createCaseStudy);
router.put('/:id', authenticate, requireAdmin, validateRequest(caseStudySchema.partial()), CaseStudyController.updateCaseStudy);
router.delete('/:id', authenticate, requireAdmin, CaseStudyController.deleteCaseStudy);

export default router;
