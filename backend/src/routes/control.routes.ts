import { Router } from 'express';
import { getControls, createControl } from '../controllers/control.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Controls
 *   description: Inspection control management
 */

/**
 * @swagger
 * /controls:
 *   get:
 *     summary: List all controls
 *     tags: [Controls]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of controls
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Control'
 */
router.get('/', getControls);

/**
 * @swagger
 * /controls:
 *   post:
 *     summary: Create a new control
 *     tags: [Controls]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Control'
 *     responses:
 *       201:
 *         description: Control created
 */
router.post('/', createControl);

export default router;
