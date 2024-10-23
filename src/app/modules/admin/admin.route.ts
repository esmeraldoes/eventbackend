import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from './admin.model'; 
import { AdminController } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AdminValidation } from './admin.validation';

const router = express.Router();

/**
 * @swagger
 * /admin/make-admin:
 *   post:
 *     summary: Make a user an admin
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user to be made an admin
 *     responses:
 *       200:
 *         description: User successfully made an admin
 *       403:
 *         description: Forbidden - not a SUPER_ADMIN
 *       400:
 *         description: Bad Request - invalid input
 */
router.post(
  '/make-admin',
  auth(UserRole.SUPER_ADMIN), 
  validateRequest(AdminValidation.makeAdminZodSchema), 
  AdminController.makeAdminController,
);

/**
 * @swagger
 * /admin/{id}:
 *   patch:
 *     summary: Update an admin's details
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the admin to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin details updated successfully
 *       403:
 *         description: Forbidden - not a SUPER_ADMIN
 *       404:
 *         description: Not Found - admin does not exist
 */
router.patch(
  '/:id',
  auth(UserRole.SUPER_ADMIN), 
  validateRequest(AdminValidation.updateAdminZodSchema), 
  AdminController.updateAdminController,
);

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Get a list of admins
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of admins retrieved successfully
 *       403:
 *         description: Forbidden - not a SUPER_ADMIN
 */
router.get(
  '/',
  auth(UserRole.SUPER_ADMIN), 
  AdminController.getAdminsController, 
);

/**
 * @swagger
 * /admin/{id}:
 *   delete:
 *     summary: Delete an admin
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the admin to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *       403:
 *         description: Forbidden - not a SUPER_ADMIN
 *       404:
 *         description: Not Found - admin does not exist
 */
router.delete(
  '/:id',
  auth(UserRole.SUPER_ADMIN), 
  AdminController.deleteAdminController, 
);

export const AdminRoutes = router;
