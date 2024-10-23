import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { EventService } from './event.service';
import { eventFilterableFields } from './event.constant';

const createEventController = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: 'Unauthorized access. User must be logged in.',
    });
  }

  const result = await EventService.createEvent(req.user.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Event created successfully!',
    data: result,
  });
});

const getEventsController = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, eventFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await EventService.getEvents(filters, paginationOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Events retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleEventController = catchAsync(async (req: Request, res: Response) => {
  const result = await EventService.getSingleEvent(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Event retrieved successfully!',
    data: result,
  });
});

const getUserEventsController = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: 'Unauthorized access. User must be logged in.',
    });
  }

  const paginationOptions = pick(req.query, paginationFields);
  const result = await EventService.getUserEvents(req.user.id, paginationOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User events retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

const updateEventController = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: 'Unauthorized access. User must be logged in.',
    });
  }

  const userRole = req.user.role; 
  const result = await EventService.updateEvent(req.user.id, req.params.id, req.body, userRole); 

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Event updated successfully!',
    data: result,
  });
});

const deleteEventController = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: 'Unauthorized access. User must be logged in.',
    });
  }

  const userRole = req.user.role; 
  await EventService.deleteEvent(req.user.id, req.params.id, userRole); 

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Event deleted successfully!',
    data: null,
  });
});

export const EventController = {
  createEventController,
  getEventsController,
  getSingleEventController,
  getUserEventsController,  
  updateEventController,
  deleteEventController,
};
