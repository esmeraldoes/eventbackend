import { UserRole } from '../user/user.model';
import { z } from 'zod';

const signupZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email address is required',
      })
      .email({
        message: 'Use a valid email address',
      }),
    password: z.string({
      required_error: 'Password is required',
    }),
    // firstName: z.string({
    //   required_error: 'First name is required',
    // }),
    // lastName: z.string({
    //   required_error: 'Last name is required',
    // }),
    role: z
      .enum([...Object.values(UserRole)] as [string, ...string[]], {
        required_error: 'User role is required',
      })
      .default(UserRole.USER),
  }),
});

const loginZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email address is required',
      })
      .email({
        message: 'Use a valid email address',
      }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required',
    }),
  }),
});

const changePasswordZodSchema = z.object({
  body: z.object({
    currentPassword: z.string({
      required_error: 'Current password is required',
    }),
    newPassword: z.string({
      required_error: 'New password is required',
    }),
  }),
});

export const AuthValidation = {
  signupZodSchema,
  loginZodSchema,
  refreshTokenZodSchema,
  changePasswordZodSchema,
};
