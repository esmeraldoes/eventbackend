import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { adminFilterableFields } from './admin.constant';
import { AdminService } from './admin.service'; 


const getAdminsController = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, adminFilterableFields);
 
  const result = await AdminService.getAdmins(filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admins retrieved successfully',
    data: result.data,
  });
});

const makeAdminController = catchAsync(async (req: Request, res: Response) => {
  await AdminService.makeAdmin(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED, 
    success: true,
    message: 'Admin created successfully',
  });
});

const deleteAdminController = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.deleteAdmin(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin deleted successfully',
    data: result,
  });
});

const updateAdminController = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.updateAdmin(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin updated successfully',
    data: result,
  });
});

export const AdminController = {
  getAdminsController,
  makeAdminController,
  deleteAdminController,
  updateAdminController,
};
