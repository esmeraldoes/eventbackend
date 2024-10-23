import express from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.model';

const router = express.Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: User Signup
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *               password:
 *                 type: string
 *                 description: User's password
 *               name:
 *                 type: string
 *                 description: User's name
 *     responses:
 *       201:
 *         description: User signed up successfully
 *       400:
 *         description: Bad Request - invalid input
 */
router.post(
  '/signup',
  validateRequest(AuthValidation.signupZodSchema),
  AuthController.signupController,
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Access token for the authenticated user
 *                 refreshToken:
 *                   type: string
 *                   description: Refresh token for the authenticated user
 *       401:
 *         description: Unauthorized - invalid credentials
 *       400:
 *         description: Bad Request - invalid input
 */
router.post(
  '/login',
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.loginController,
);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh Access Token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token for the user
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: New access token for the authenticated user
 *       401:
 *         description: Unauthorized - invalid refresh token
 */
router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshTokenController,
);

/**
 * @swagger
 * /auth/change-password:
 *   patch:
 *     summary: Change User Password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: The user's current password
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Bad Request - invalid input
 *       401:
 *         description: Unauthorized - invalid credentials
 */
router.patch(
  '/change-password',
  validateRequest(AuthValidation.changePasswordZodSchema),
  auth(UserRole.ADMIN, UserRole.USER),
  AuthController.changePasswordController,
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User Logout
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized - user not logged in
 */
router.post(
  '/logout',
  auth(UserRole.ADMIN, UserRole.USER),
  AuthController.logoutController,
);

export const AuthRoutes = router;
