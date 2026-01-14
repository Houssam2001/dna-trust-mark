import { Router } from 'express';
import { getEstablishments, createEstablishment, updateEstablishment, deleteEstablishment, verifyEstablishment, requestEstablishment } from '../controllers/establishment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
/**
 * @swagger
 * tags:
 *   name: Establishments
 *   description: Establishment management
 */

/**
 * @swagger
 * /establishments/verify/{code}:
 *   get:
 *     summary: Verify establishment by code (Public)
 *     tags: [Establishments]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: ADNGUARD Code
 *     responses:
 *       200:
 *         description: Establishment details
 *       404:
 *         description: Establishment not found
 */
router.get('/verify/:code', verifyEstablishment);

/**
 * @swagger
 * /establishments/request:
 *   post:
 *     summary: Request new establishment certification (Public)
 *     tags: [Establishments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               address: { type: string }
 *               city: { type: string }
 *               type: { type: string }
 *     responses:
 *       201:
 *         description: Request submitted
 */
router.post('/request', requestEstablishment);

// Protect all other establishment routes
router.use(authenticate);

/**
 * @swagger
 * /establishments:
 *   get:
 *     summary: List all establishments
 *     tags: [Establishments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of establishments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Establishment'
 */
router.get('/', getEstablishments);

/**
 * @swagger
 * /establishments:
 *   post:
 *     summary: Create a new establishment
 *     tags: [Establishments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Establishment'
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', createEstablishment);

/**
 * @swagger
 * /establishments/{id}:
 *   put:
 *     summary: Update an establishment
 *     tags: [Establishments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Establishment'
 *     responses:
 *       200:
 *         description: Updated
 */
router.put('/:id', updateEstablishment);

/**
 * @swagger
 * /establishments/{id}:
 *   delete:
 *     summary: Delete an establishment
 *     tags: [Establishments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete('/:id', deleteEstablishment);

export default router;
