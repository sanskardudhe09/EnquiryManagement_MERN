import { Request, Response } from 'express';
import { z } from 'zod';
import Enquiry from '../models/Enquiry';

const createEnquirySchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  message: z.string().min(1, 'Message is required'),
  assignedTo: z
    .string()
    .optional()
    .nullable()
    .transform(val => (val === '' || !val ? null : val)),
});

const updateEnquirySchema = z.object({
  customerName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(1).optional(),
  message: z.string().min(1).optional(),
  status: z.enum(['new', 'in_progress', 'closed']).optional(),
  assignedTo: z
    .string()
    .nullable()
    .transform(val => (val === '' ? null : val)),
});

export const createEnquiry = async (req: Request, res: Response) => {
  try {
    const validatedData = createEnquirySchema.parse(req.body);

    const enquiry = await Enquiry.create(validatedData);
    await enquiry.populate('assignedTo', 'name email');

    res.status(201).json(enquiry);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Create enquiry error:', error);
    res.status(500).json({ message: 'Failed to create enquiry' });
  }
};

export const getEnquiries = async (req: Request, res: Response) => {
  try {
    const { status, search, assignedTo } = req.query;
    const query: any = { deletedAt: null };

    if (status) {
      query.status = status;
    }

    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const enquiries = await Enquiry.find(query)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(enquiries);
  } catch (error) {
    console.error('Get enquiries error:', error);
    res.status(500).json({ message: 'Failed to fetch enquiries' });
  }
};

export const getEnquiryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const enquiry = await Enquiry.findOne({ _id: id, deletedAt: null }).populate(
      'assignedTo',
      'name email'
    );

    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    res.json(enquiry);
  } catch (error) {
    console.error('Get enquiry error:', error);
    res.status(500).json({ message: 'Failed to fetch enquiry' });
  }
};

export const updateEnquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateEnquirySchema.parse(req.body);

    const enquiry = await Enquiry.findOneAndUpdate({ _id: id, deletedAt: null }, validatedData, {
      new: true,
      runValidators: true,
    }).populate('assignedTo', 'name email');

    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    res.json(enquiry);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Update enquiry error:', error);
    res.status(500).json({ message: 'Failed to update enquiry' });
  }
};

export const deleteEnquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const enquiry = await Enquiry.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    res.json({ message: 'Enquiry deleted successfully' });
  } catch (error) {
    console.error('Delete enquiry error:', error);
    res.status(500).json({ message: 'Failed to delete enquiry' });
  }
};
