import { Router } from 'express';
import { TechnologyController } from '../controllers/technologyController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { technologySchema } from '../validators/index.js';

const router = Router();

router.get('/', TechnologyController.getTechnologies);
router.post('/', authenticate, requireAdmin, validateRequest(technologySchema), TechnologyController.createTechnology);
router.put('/:id', authenticate, requireAdmin, validateRequest(technologySchema.partial()), TechnologyController.updateTechnology);
router.delete('/:id', authenticate, requireAdmin, TechnologyController.deleteTechnology);

export default router;
