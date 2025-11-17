/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
  _id: any;
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
}

export interface Enquiry {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'in_progress' | 'closed';
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryFormData {
  customerName: string;
  email: string;
  phone: string;
  message: string;
  status?: 'new' | 'in_progress' | 'closed';
  assignedTo?: string;
}
