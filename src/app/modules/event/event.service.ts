import Event from './event.model';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import mongoose from 'mongoose';
import { IEvent } from './event.model';
import { UserRole } from '../user/user.model';

/**
 * Create a new event.
 * @param userId - The ID of the logged-in user creating the event.
 * @param data - The event data to be created.
 */
const createEvent = async (userId: mongoose.Types.ObjectId, data: Partial<IEvent>): Promise<IEvent> => {
  const newEvent = new Event({
    ...data,
    userId, 
  });
  console.log("DDDD: ", newEvent)

  const result = await newEvent.save();
  return result;
};

/**
 * Get all events with optional filters and pagination.
 * @param filters - Filtering options for events.
 * @param paginationOptions - Pagination options.
 */
const getEvents = async (
  filters: any,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IEvent[]>> => {
  const { query, ...filtersData } = filters;

  const andConditions: any[] = [];

  if (query) {
    andConditions.push({
      $or: [
        { title: { $regex: query, $options: 'i' } }, 
        { location: { $regex: query, $options: 'i' } }, 
      ],
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({ ...filtersData });
  }

  const { page, limit, skip } = paginationHelpers.calculatePagination(paginationOptions);

  const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};

  const events = await Event.find(whereConditions)
    .skip(skip)
    .limit(limit)
    .exec();

  const total = await Event.countDocuments(whereConditions);

  if (total === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No events found matching your search criteria');
  }

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: events,
  };
};

/**
 * Get a single event by ID.
 * @param id - Event ID.
 */
const getSingleEvent = async (id: string): Promise<IEvent | null> => {
  const event = await Event.findById(id).exec();
  
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
  }

  return event;
};

/**
 * Update an event by its ID. Only the event owner or an admin can update the event.
 * @param userId - The ID of the logged-in user attempting to update the event.
 * @param eventId - The ID of the event to update.
 * @param data - Updated event data.
 * @param userRole - The role of the user (e.g., 'admin' or 'user').
 */
const updateEvent = async (userId: mongoose.Types.ObjectId, eventId: string, data: Partial<IEvent>, userRole: UserRole): Promise<IEvent | null> => {
  const event = await Event.findById(eventId).exec();

  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
  }

  if (event.userId.toString() !== userId.toString() && userRole !== UserRole.ADMIN) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not allowed to update this event');
  }

  Object.assign(event, data);
  const updatedEvent = await event.save();
  
  return updatedEvent;
};

/**
 * Delete an event by its ID. Only the event owner or an admin can delete the event.
 * @param userId - The ID of the logged-in user attempting to delete the event.
 * @param eventId - The ID of the event to delete.
 * @param userRole - The role of the user (e.g., 'admin' or 'user').
 */
const deleteEvent = async (userId: mongoose.Types.ObjectId, eventId: string, userRole: UserRole): Promise<void> => {
  const event = await Event.findById(eventId).exec();

  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
  }

  if (event.userId.toString() !== userId.toString() && userRole !== UserRole.ADMIN) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not allowed to delete this event');
  }

  await Event.deleteOne({ _id: eventId });
};


const getUserEvents = async (
  userId: mongoose.Types.ObjectId,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IEvent[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(paginationOptions);

  const events = await Event.find({ userId })
    .skip(skip)
    .limit(limit)
    .exec();

  const total = await Event.countDocuments({ userId });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: events.length ? events : [],
  };
};


export const EventService = {
  createEvent,
  getEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
  getUserEvents,
};
