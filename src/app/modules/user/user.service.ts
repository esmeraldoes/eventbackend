import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import User, { IUser } from './user.model';
import { excludePassword } from '../../../shared/utils';
import { IUserFilters } from './user.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { userSearchableFields } from './user.constant';
import { paginationHelpers } from '../../../helpers/paginationHelper';

const getProfile = async (
  user: JwtPayload | null,
): Promise<Partial<IUser> | null> => {
  const result = await User.findById(user?.id);

  if (result?.email) {
    return excludePassword(result.toObject(), ['password']);
  }
  return null;
};

// Get All Users
const getAllUsers = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions,
) => {
  const { query, ...filtersData } = filters;

  const andConditions: any[] = [];

  if (query) {
    andConditions.push({
      $or: userSearchableFields.map(field => ({
        [field]: {
          $regex: query,
          $options: 'i', 
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.keys(filtersData).map(key => ({
        [key]: (filtersData as any)[key],
      })),
    });
  }

  const { page, limit, skip } = paginationHelpers.calculatePagination(paginationOptions);

  const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await User.find(whereConditions)
    .skip(skip)
    .limit(limit)
    .populate('events');

  const total = await User.countDocuments(whereConditions);

  const newResult = result.map(user => excludePassword(user.toObject(), ['password']));

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: newResult,
  };
};

// Get User By ID
const getUserById = async (userId: string): Promise<Partial<IUser> | null> => {
  const result = await User.findById(userId);

  if (result?.email) {
    return excludePassword(result.toObject(), ['password']);
  }
  return null;
};

// Update Profile
const updateProfile = async (
  user: JwtPayload | null,
  data: Partial<IUser>,
): Promise<Partial<IUser> | null> => {
  const isUserExist = await User.findById(user?.id);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const result = await User.findByIdAndUpdate(user?.id, data, {
    new: true,
    runValidators: true,
  });

  if (result?.email) {
    return excludePassword(result.toObject(), ['password']);
  }
  return null;
};

// Update User
const updateUser = async (
  userId: string,
  data: Partial<IUser>,
): Promise<Partial<IUser> | null> => {
  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const result = await User.findByIdAndUpdate(userId, data, {
    new: true,
    runValidators: true,
  });

  if (result?.email) {
    return excludePassword(result.toObject(), ['password']);
  }
  return null;
};

// Delete User
const deleteUser = async (userId: string): Promise<IUser | null> => {
  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'The user does not exist.');
  }

  const user = await User.findByIdAndDelete(userId);

  if (user) {
    return user;
  }

  throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to delete user');
};

export const UserService = {
  getProfile,
  getAllUsers,
  getUserById,
  updateProfile,
  updateUser,
  deleteUser,
};
