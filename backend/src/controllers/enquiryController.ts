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

/**
 * @swagger
 * tags:
 *   name: Enquiries
 *   description: Enquiry management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Enquiry:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         customerName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         message:
 *           type: string
 *         status:
 *           type: string
 *           enum: [new, in_progress, closed]
 *           default: new
 *         assignedTo:
 *           $ref: '#/components/schemas/User'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     EnquiryCreate:
 *       type: object
 *       required:
 *         - customerName
 *         - email
 *         - phone
 *         - message
 *       properties:
 *         customerName:
 *           type: string
 *           minLength: 1
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *           minLength: 1
 *         message:
 *           type: string
 *           minLength: 1
 *         assignedTo:
 *           type: string
 *           nullable: true
 *     EnquiryUpdate:
 *       type: object
 *       properties:
 *         customerName:
 *           type: string
 *           minLength: 1
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *           minLength: 1
 *         message:
 *           type: string
 *           minLength: 1
 *         status:
 *           type: string
 *           enum: [new, in_progress, closed]
 *         assignedTo:
 *           type: string
 *           nullable: true
 */

/**
 * @swagger
 * /api/enquiries:
 *   post:
 *     summary: Create a new enquiry
 *     tags: [Enquiries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EnquiryCreate'
 *     responses:
 *       201:
 *         description: Enquiry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enquiry'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /api/enquiries:
 *   get:
 *     summary: Get all enquiries
 *     tags: [Enquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, in_progress, closed]
 *         description: Filter by status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in customer name, email, phone, or message
 *       - in: query
 *         name: assignedTo
 *         schema:
 *           type: string
 *         description: Filter by assigned user ID
 *     responses:
 *       200:
 *         description: List of enquiries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Enquiry'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /api/enquiries/{id}:
 *   get:
 *     summary: Get enquiry by ID
 *     tags: [Enquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enquiry ID
 *     responses:
 *       200:
 *         description: Enquiry details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enquiry'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Enquiry not found
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /api/enquiries/{id}:
 *   put:
 *     summary: Update an enquiry
 *     tags: [Enquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enquiry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EnquiryUpdate'
 *     responses:
 *       200:
 *         description: Enquiry updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enquiry'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Enquiry not found
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /api/enquiries/{id}:
 *   delete:
 *     summary: Delete an enquiry (soft delete)
 *     tags: [Enquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enquiry ID
 *     responses:
 *       200:
 *         description: Enquiry deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Enquiry not found
 *       500:
 *         description: Internal server error
 */
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
