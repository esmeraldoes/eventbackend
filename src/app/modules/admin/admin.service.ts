import Admin, { UserRole, IAdmin } from './admin.model'; 
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { asyncForEach, excludePassword } from '../../../shared/utils';
import { adminSearchableFields } from './admin.constant';
import { IAdminFilters, IMakeAdmin, MakeAdminInfo } from './admin.interface';


const getAdmins = async (
  filters: IAdminFilters,
): Promise<{ data: IAdmin[] }> => {
  const { query, ...filtersData } = filters;
  const andConditions: any[] = [{ role: UserRole.ADMIN }]; 

  if (query) {
    andConditions.push({
      $or: adminSearchableFields.map(field => ({
        [field]: {
          $regex: query,
          $options: 'i', 
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push(
      ...Object.keys(filtersData).map((key) => ({
        [key]: filtersData[key as keyof typeof filtersData], 
      }))
    );
  }

  const result: IAdmin[] = await Admin.find({ $and: andConditions });

  const newResult: IAdmin[] = result.map(admin => {
    const { password, ...adminData } = admin.toObject(); 
    return adminData as IAdmin; 
  });

  return {
    data: newResult,
  };
};


const makeAdmin = async (data: IMakeAdmin): Promise<void> => {
  if (data?.users.length) {
    await asyncForEach(data.users, async (user: MakeAdminInfo) => {
      const isAdminExist = await Admin.findOne({ email: user.email });

      if (!isAdminExist) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'The admin does not exist. To make admin, the user must be registered first.'
        );
      }

      await Admin.updateOne(
        { email: user.email },
        { role: UserRole.ADMIN }
      );
    });
  }
};


const deleteAdmin = async (adminId: string): Promise<IAdmin | null> => {
  const admin = await Admin.findById(adminId);

  if (!admin || admin.role !== UserRole.ADMIN) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'The admin does not exist.');
  }

  return await Admin.findByIdAndDelete(adminId);
};


const updateAdmin = async (
  adminId: string,
  data: Partial<IAdmin>
): Promise<Partial<IAdmin> | null> => {
  const isAdminExist = await Admin.findById(adminId);

  if (!isAdminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'The admin does not exist.');
  }

  const result = await Admin.findByIdAndUpdate(adminId, data, { new: true });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin update failed.');
  }

  return excludePassword(result.toObject(), ['password']);
};


export const AdminService = {
  getAdmins,
  makeAdmin,
  deleteAdmin,
  updateAdmin,
};
