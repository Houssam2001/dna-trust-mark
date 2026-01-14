import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getUsers, addUserRole, removeUserRole, getStats } from '../controllers/admin.controller';

const router = Router();

// Allow request to proceed if authenticated. 
// Ideally we should add 'checkRole(["admin"])' middleware here too.
router.use(authenticate);

// Users
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management endpoints
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: List all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/users', getUsers);

/**
 * @swagger
 * /admin/users/{userId}/roles:
 *   post:
 *     summary: Add role to user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, agent, owner]
 *     responses:
 *       200:
 *         description: Role added
 */
router.post('/users/:userId/roles', addUserRole);

/**
 * @swagger
 * /admin/users/{userId}/roles/{role}:
 *   delete:
 *     summary: Remove role from user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role removed
 */
router.delete('/users/:userId/roles/:role', removeUserRole);

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics data
 */
router.get('/stats', getStats);

export default router;
