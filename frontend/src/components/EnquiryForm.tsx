import { useState } from 'react';
import type { EnquiryFormData, Enquiry, User } from '../types';
import { X, User as UserIcon, Mail, Phone, MessageSquare, UserCheck, Tag } from 'lucide-react';

interface EnquiryFormProps {
  enquiry?: Enquiry;
  users?: User[];
  onSubmit: (data: EnquiryFormData) => Promise<void>;
  onClose: () => void;
}

export default function EnquiryForm({ enquiry, users = [], onSubmit, onClose }: EnquiryFormProps) {
  const [formData, setFormData] = useState<EnquiryFormData>({
    customerName: enquiry?.customerName || '',
    email: enquiry?.email || '',
    phone: enquiry?.phone || '',
    message: enquiry?.message || '',
    status: enquiry?.status || 'new',
    assignedTo: enquiry?.assignedTo?._id || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {enquiry ? 'Edit Enquiry' : 'Add New Enquiry'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
          <div>
            <label
              htmlFor="customerName"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
            >
              <UserIcon className="w-4 h-4 text-gray-500" />
              Customer Name *
            </label>
            <input
              type="text"
              id="customerName"
              value={formData.customerName}
              onChange={e => setFormData({ ...formData, customerName: e.target.value })}
              className={`block w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.customerName
                  ? 'border-red-300 focus:ring-red-500 focus:border-transparent'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-transparent hover:border-gray-400'
              }`}
            />
            {errors.customerName && (
              <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.customerName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
            >
              <Mail className="w-4 h-4 text-gray-500" />
              Email *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className={`block w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.email
                  ? 'border-red-300 focus:ring-red-500 focus:border-transparent'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-transparent hover:border-gray-400'
              }`}
            />
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
            >
              <Phone className="w-4 h-4 text-gray-500" />
              Phone *
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              maxLength={10}
              className={`block w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.phone
                  ? 'border-red-300 focus:ring-red-500 focus:border-transparent'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-transparent hover:border-gray-400'
              }`}
            />
            {errors.phone && (
              <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.phone}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="message"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
            >
              <MessageSquare className="w-4 h-4 text-gray-500" />
              Message *
            </label>
            <textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              className={`block w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 resize-none ${
                errors.message
                  ? 'border-red-300 focus:ring-red-500 focus:border-transparent'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-transparent hover:border-gray-400'
              }`}
            />
            {errors.message && (
              <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.message}</p>
            )}
          </div>

          {/* Status field - only shown when editing */}
          {enquiry && (
            <div>
              <label
                htmlFor="status"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
              >
                <Tag className="w-4 h-4 text-gray-500" />
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={e =>
                  setFormData({
                    ...formData,
                    status: e.target.value as 'new' | 'in_progress' | 'closed',
                  })
                }
                className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
              >
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          )}

          {/* Assignment field - shown for both create and edit */}
          {users.length > 0 && (
            <div>
              <label
                htmlFor="assignedTo"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
              >
                <UserCheck className="w-4 h-4 text-gray-500" />
                Assign To
              </label>
              <select
                id="assignedTo"
                value={formData.assignedTo || ''}
                onChange={e =>
                  setFormData({ ...formData, assignedTo: e.target.value || undefined })
                }
                className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
              >
                <option value="">Unassigned</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
            >
              {enquiry ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
