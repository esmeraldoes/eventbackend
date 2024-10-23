import mongoose, { Document, Schema } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  SUPER_ADMIN = 'super_admin',

}

export interface IAdmin extends Document {
  _id: string;
  email: string;
  password: string;
  role: UserRole.ADMIN | UserRole.SUPER_ADMIN; 
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema: Schema<IAdmin> = new Schema(
  {
    _id:{
        type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.ADMIN,
    },
  },
  {
    timestamps: true,
  },
);

const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);
export default Admin;
