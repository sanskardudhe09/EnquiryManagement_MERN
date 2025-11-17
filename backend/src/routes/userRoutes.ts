import { Router } from 'express';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getStaffUsers,
} from '../controllers/userController';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

// Get staff users for assignment - accessible to all authenticated users
router.get('/staff', authenticate, getStaffUsers);

// Admin-only routes
router.use(authenticate);
router.use(authorize('admin'));

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
