import { UserRole } from './admin.model'; 
import { z } from 'zod';

const makeAdminZodSchema = z.object({
  body: z.object({
    users: z
      .object({
        email: z.string().email('Provide a valid email'), 
      })
      .array(),
  }),
});

const updateAdminZodSchema = z.object({
  body: z.object({
    firstName: z.string().optional(), 
    lastName: z.string().optional(), 
    role: z
      .enum([...Object.values(UserRole)] as [string, ...string[]], {
        required_error: 'Role is required', 
      })
      .optional(),
  }),
});

export const AdminValidation = {
  makeAdminZodSchema,
  updateAdminZodSchema,
};
