import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { AuthService } from './auth.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import config from '../../../config';
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';

// Signup controller
const signupController = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.signup(req.body); 

  sendResponse(res, {
    statusCode: httpStatus.CREATED, 
    success: true,
    message: 'Signed up successfully! Please login',
    data: result,
  });
});

// Login controller
const loginController = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body); 
  const { refreshToken, ...othersData } = result;

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: othersData,
  });
});

// Refresh token controller
const refreshTokenController = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken); 

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Token refreshed successfully',
    data: result,
  });
});

// Change password controller
const changePasswordController = catchAsync(async (req: Request, res: Response) => {
  const user = req.user; 
  const passwordData = req.body;

  await AuthService.changePassword(user, passwordData); 
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully',
  });
});

// Logout controller
const logoutController = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie('refreshToken'); 

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged out successfully',
  });
});

export const AuthController = {
  signupController,
  loginController,
  refreshTokenController,
  changePasswordController,
  logoutController,
};
