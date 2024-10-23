import User, { IUser } from '../user/user.model';
import bcrypt from 'bcrypt';
import config from '../../../config';
import { excludePassword, isPasswordMatch } from '../../../shared/utils';
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { JwtPayload, Secret } from 'jsonwebtoken';

const signup = async (data: IUser): Promise<Partial<IUser>> => {
  const hashedPassword = await bcrypt.hash(
    data.password,
    Number(config.bycrypt_salt_rounds),
  );

  const newUser = new User({
    ...data,
    password: hashedPassword,
  });

  const result = await newUser.save();
  return excludePassword(result.toObject(), ['password']);
};

const login = async (data: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = data;

  // Check if user exists
  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  if (
    isUserExist.password &&
    !(await isPasswordMatch(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password does not match');
  }

  const { _id, role } = isUserExist;

  const userId = _id as unknown as string;

  const accessToken = jwtHelpers.createToken(
    { id: userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );
  const refreshToken = jwtHelpers.createToken(
    { id: userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    userId: userId.toString(),
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken: JwtPayload | null = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret,
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid refresh token');
  }

  const { id } = verifiedToken;

  // Check if user exists
  const isUserExist = await User.findById(id);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // Generate new access token
  const newAccessToken = jwtHelpers.createToken(
    { id: isUserExist._id, role: isUserExist.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  user: JwtPayload | null,
  payload: IChangePassword,
): Promise<Partial<IUser>> => {
  const { currentPassword, newPassword } = payload;

  // Check if user exists
  const isUserExist = await User.findById(user?.id);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // Check current password
  if (
    isUserExist.password &&
    !(await isPasswordMatch(currentPassword, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Current Password is incorrect');
  }

  // Check if new password is same as old
  if (
    isUserExist.password &&
    (await isPasswordMatch(newPassword, isUserExist.password))
  ) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Current password cannot be the same as old password!',
    );
  }

  // Hash new password
  const newHashPassword = await bcrypt.hash(
    newPassword,
    Number(config.bycrypt_salt_rounds),
  );

  isUserExist.password = newHashPassword;
  const result = await isUserExist.save(); 

  return excludePassword(result.toObject(), ['password']);
};

export const AuthService = {
  signup,
  login,
  refreshToken,
  changePassword,
};
