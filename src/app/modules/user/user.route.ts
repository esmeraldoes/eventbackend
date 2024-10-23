import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '../admin/admin.model';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';

const router = express.Router();

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get User Profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       401:
 *         description: Unauthorized - user not logged in
 */
router.get(
  '/profile',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
  UserController.getProfileController,
);

/**
 * @swagger
 * /user/get-all:
 *   get:
 *     summary: Get All Users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *       401:
 *         description: Unauthorized - user not logged in
 */
router.get(
  '/get-all',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserController.getAllUsersController,
);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get User by ID
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: User not found
 */
router.get('/:id', UserController.getUserByIdController);

/**
 * @swagger
 * /user/profile:
 *   patch:
 *     summary: Update User Profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the user
 *               email:
 *                 type: string
 *                 description: Updated email of the user
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       400:
 *         description: Bad Request - invalid input
 *       401:
 *         description: Unauthorized - user not logged in
 */
router.patch(
  '/profile',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
  validateRequest(UserValidation.updateUserZodSchema),
  UserController.updateProfileController,
);

/**
 * @swagger
 * /user/{id}:
 *   patch:
 *     summary: Update User by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the user
 *               email:
 *                 type: string
 *                 description: Updated email of the user
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad Request - invalid input
 *       401:
 *         description: Unauthorized - user not logged in
 *       404:
 *         description: User not found
 */
router.patch(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
  validateRequest(UserValidation.updateUserZodSchema),
  UserController.updateUserController,
);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete User by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized - user not logged in
 *       404:
 *         description: User not found
 */
router.delete(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserController.deleteUserController,
);

export const UserRoutes = router;

