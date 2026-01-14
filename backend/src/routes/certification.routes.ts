import { Router } from 'express';
import { getCertifications } from '../controllers/certification.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Certifications
 *   description: Certification management
 */

/**
 * @swagger
 * /certifications:
 *   get:
 *     summary: List active certifications
 *     tags: [Certifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of certifications
 */
router.get('/', getCertifications);

export default router;
