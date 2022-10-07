import mongoose from 'mongoose';

export interface UserEntity {
  email: string;
  password: string;
  role: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

const Schema = mongoose.Schema;
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: String,
    required: true,
  },
  updatedBy: {
    type: String,
    required: true,
  },
});
const Users = mongoose.model<UserEntity>('users', userSchema);
export default Users;
