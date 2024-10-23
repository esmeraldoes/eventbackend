import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdValidation = z
  .string()
  .refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: 'Invalid ObjectId format',
  });

const createEventZodSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'Event title is required',
      })
      .min(3, 'Event title must be at least 3 characters long')
      .max(100, 'Event title must not exceed 100 characters'),
    description: z
      .string({
        required_error: 'Event description is required',
      })
      .min(10, 'Description must be at least 10 characters long')
      .max(1000, 'Description must not exceed 1000 characters'),
    date: z
      .string({
        required_error: 'Event date is required',
      })
      .refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
      }),
    time: z
      .string({
        required_error: 'Event time is required',
      })
      .regex(/^(0[0-9]|1[0-2]|[0-9]):[0-5][0-9] [AP]M$/, 'Time must be in hh:mm AM/PM format'),
    location: z
      .string({
        required_error: 'Location is required',
      })
      .min(3, 'Location must be at least 3 characters long'),
    userId: objectIdValidation,
    eventStatus: z
      .enum(['DRAFT', 'PUBLISHED', 'CANCELLED'], {
        required_error: 'Event status is required',
      })
      .default('DRAFT'), 
  }),
});

const updateEventZodSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100).optional(),
    description: z.string().min(10).max(1000).optional(),
    date: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
      })
      .optional(),
    time: z
      .string()
      .regex(/^(0[0-9]|1[0-2]|[0-9]):[0-5][0-9] [AP]M$/, 'Time must be in hh:mm AM/PM format')
      .optional(),
    location: z.string().min(3).optional(),
    userId: objectIdValidation.optional(),
    eventStatus: z
      .enum(['DRAFT', 'PUBLISHED', 'CANCELLED'])
      .optional(),
  }),
});

export const EventValidation = {
  createEventZodSchema,
  updateEventZodSchema,
};
