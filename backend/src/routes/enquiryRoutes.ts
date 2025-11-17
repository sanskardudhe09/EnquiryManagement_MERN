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

router.use(authenticate); // All enquiry routes require authentication

router.post('/', createEnquiry);
router.get('/', getEnquiries);
router.get('/:id', getEnquiryById);
router.put('/:id', updateEnquiry);
router.delete('/:id', deleteEnquiry);

export default router;
