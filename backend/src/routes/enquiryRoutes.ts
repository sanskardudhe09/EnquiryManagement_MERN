import { Router } from 'express';
import {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
} from '../controllers/enquiryController';
import { authenticate } from '../middlewares/auth';

const router = Router();

// All enquiry routes require authentication
router.use(authenticate);

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
 */
router.post('/', createEnquiry);

/**
 * @swagger
 * /api/enquiries:
 *   get:
 *     summary: Get all enquiries
 *     tags: [Enquiries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of enquiries
 */
router.get('/', getEnquiries);

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
 *     responses:
 *       200:
 *         description: Enquiry details
 *       404:
 *         description: Enquiry not found
 */
router.get('/:id', getEnquiryById);

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EnquiryUpdate'
 *     responses:
 *       200:
 *         description: Enquiry updated successfully
 *       404:
 *         description: Enquiry not found
 */
router.put('/:id', updateEnquiry);

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
 *     responses:
 *       200:
 *         description: Enquiry deleted successfully
 *       404:
 *         description: Enquiry not found
 */
router.delete('/:id', deleteEnquiry);

export default router;
