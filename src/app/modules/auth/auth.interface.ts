// auth.interface.ts

export type ILoginUser = {
  email: string;
  password: string;
};

export type ILoginUserResponse = {
  accessToken: string;
  refreshToken?: string; 
  userId: string; 
};

export type IRefreshTokenResponse = {
  accessToken: string; 
};

export type IChangePassword = {
  currentPassword: string;
  newPassword: string;
};
