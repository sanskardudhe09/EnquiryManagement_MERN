import mongoose from 'mongoose';
import { IEnquiry } from '../../../../models/Enquiry';
import { createTestUser } from '../../../utils/testUtils';
import { Types } from 'mongoose';

describe('Enquiry Model', () => {
  let testUser: any;

  beforeAll(async () => {
    if (!mongoose.connection.db) {
      await mongoose.connect(global.__MONGO_URI__);
    }
  });

  beforeEach(async () => {
    // Create a test user for assignedTo reference
    testUser = await createTestUser({ role: 'staff' });
  });

  afterEach(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('Enquiry Creation', () => {
    it('should create a new enquiry with required fields', async () => {
      const enquiryData = {
        customerName: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        message: 'Test enquiry message',
        status: 'new' as const,
      };

      const Enquiry = mongoose.model<IEnquiry>('Enquiry');
      const enquiry = new Enquiry(enquiryData);
      const savedEnquiry = await enquiry.save();

      expect(savedEnquiry._id).toBeDefined();
      expect(savedEnquiry.customerName).toBe(enquiryData.customerName);
      expect(savedEnquiry.email).toBe(enquiryData.email);
      expect(savedEnquiry.phone).toBe(enquiryData.phone);
      expect(savedEnquiry.message).toBe(enquiryData.message);
      expect(savedEnquiry.status).toBe('new');
      expect(savedEnquiry.createdAt).toBeInstanceOf(Date);
      expect(savedEnquiry.updatedAt).toBeInstanceOf(Date);
    });

    it('should set default status to new if not provided', async () => {
      const enquiryData = {
        customerName: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1987654321',
        message: 'Another test enquiry',
      };

      const Enquiry = mongoose.model<IEnquiry>('Enquiry');
      const enquiry = new Enquiry(enquiryData);
      const savedEnquiry = await enquiry.save();

      expect(savedEnquiry.status).toBe('new');
    });

    it('should allow assignment to a staff user', async () => {
      const enquiryData = {
        customerName: 'Assigned Enquiry',
        email: 'assigned@example.com',
        phone: '+1122334455',
        message: 'This enquiry should be assigned',
        assignedTo: testUser._id,
      };

      const Enquiry = mongoose.model<IEnquiry>('Enquiry');
      const enquiry = new Enquiry(enquiryData);
      const savedEnquiry = await enquiry.save();

      expect(savedEnquiry.assignedTo?.toString()).toBe(testUser._id.toString());
    });
  });

  describe('Validation', () => {
    it('should require customerName', async () => {
      const enquiryData = {
        email: 'test@example.com',
        phone: '+1234567890',
        message: 'Missing name',
      };

      const Enquiry = mongoose.model<IEnquiry>('Enquiry');
      const enquiry = new Enquiry(enquiryData);

      let error: mongoose.Error.ValidationError | null = null;
      try {
        await enquiry.validate();
      } catch (err) {
        error = err as mongoose.Error.ValidationError;
      }

      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error?.errors.customerName).toBeDefined();
    });

    it('should require valid email', async () => {
      const enquiryData = {
        customerName: 'Invalid Email',
        email: 'invalid-email',
        phone: '+1234567890',
        message: 'Test with invalid email',
      };

      const Enquiry = mongoose.model<IEnquiry>('Enquiry');
      const enquiry = new Enquiry(enquiryData);

      let error: mongoose.Error.ValidationError | null = null;
      try {
        await enquiry.validate();
      } catch (err) {
        error = err as mongoose.Error.ValidationError;
      }

      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error?.errors.email).toBeDefined();
    });

    it('should require phone', async () => {
      const enquiryData = {
        customerName: 'No Phone',
        email: 'nophone@example.com',
        message: 'No phone number provided',
      };

      const Enquiry = mongoose.model<IEnquiry>('Enquiry');
      const enquiry = new Enquiry(enquiryData);

      let error: mongoose.Error.ValidationError | null = null;
      try {
        await enquiry.validate();
      } catch (err) {
        error = err as mongoose.Error.ValidationError;
      }

      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error?.errors.phone).toBeDefined();
    });
  });

  describe('Status Transitions', () => {
    it('should allow valid status transitions', async () => {
      const Enquiry = mongoose.model<IEnquiry>('Enquiry');

      // Create a new enquiry
      const enquiry = new Enquiry({
        customerName: 'Status Test',
        email: 'status@example.com',
        phone: '+1122334455',
        message: 'Testing status transitions',
      });

      await enquiry.save();

      // Update status to in_progress
      enquiry.status = 'in_progress';
      await enquiry.save();
      expect(enquiry.status).toBe('in_progress');

      // Update status to closed
      enquiry.status = 'closed';
      await enquiry.save();
      expect(enquiry.status).toBe('closed');
    });
  });
});
