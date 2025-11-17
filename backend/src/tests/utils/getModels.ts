/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose, { model } from 'mongoose';
import { IUser } from '../../models/User';
import { IEnquiry } from '../../models/Enquiry';

// Import the schemas to ensure they're registered
import '../../models/User';
import '../../models/Enquiry';

// Get the model instances
export const UserModel = mongoose.model<IUser>('User');
export const EnquiryModel = mongoose.model<IEnquiry>('Enquiry');
