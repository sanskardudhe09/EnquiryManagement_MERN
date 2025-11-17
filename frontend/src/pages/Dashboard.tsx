import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  X,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Filter,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { api } from '../utils/api';
import { auth } from '../utils/auth';
import type { Enquiry, EnquiryFormData, User } from '../types';
import { useToast } from '../hooks/useToast';
import EnquiryForm from '../components/EnquiryForm';

type StatusFilter = 'all' | 'new' | 'in_progress' | 'closed';

export default function Dashboard() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingEnquiry, setEditingEnquiry] = useState<Enquiry | null>(null);
  const [viewingEnquiry, setViewingEnquiry] = useState<Enquiry | null>(null);
  const { showToast, ToastComponent } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const token = auth.getToken();

  useEffect(() => {
    fetchEnquiries();
    fetchUsers();
  }, [statusFilter, searchTerm]);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      const queryString = params.toString();
      const dataPromise = await api.get(
        `/enquiries${queryString ? `?${queryString}` : ''}`,
        token as string
      );
      await Promise.all([dataPromise, new Promise(resolve => setTimeout(resolve, 400))]);
      const data = await dataPromise;
      setEnquiries(data);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to fetch enquiries', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      // Fetch staff users for assignment (accessible to all authenticated users)
      const data = await api.get('/users/staff', token as string);
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleCreate = async (formData: EnquiryFormData) => {
    try {
      await api.post('/enquiries', formData, token as string);
      showToast('Enquiry created successfully', 'success');
      setShowForm(false);
      fetchEnquiries();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to create enquiry', 'error');
    }
  };

  const handleUpdate = async (formData: EnquiryFormData) => {
    if (!editingEnquiry) return;
    try {
      await api.put(`/enquiries/${editingEnquiry._id}`, formData, token as string);
      showToast('Enquiry updated successfully', 'success');
      setEditingEnquiry(null);
      fetchEnquiries();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to update enquiry', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      await api.delete(`/enquiries/${id}`, token as string);
      showToast('Enquiry deleted successfully', 'success');
      fetchEnquiries();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to delete enquiry', 'error');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'in_progress':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'closed':
        return 'bg-green-100 text-green-800 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Filter enquiries based on search term and status
  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesSearch =
      searchTerm === '' ||
      enquiry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (enquiry.message && enquiry.message.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || enquiry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEnquiries.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="px-0">
      {ToastComponent}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Enquiry Management</h1>
          <p className="text-xs sm:text-sm text-gray-500">Manage and track customer enquiries</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-6 right-6 sm:static z-10 w-14 h-14 sm:w-auto sm:h-auto sm:px-5 sm:py-2.5 flex items-center justify-center sm:justify-start rounded-full sm:rounded-lg shadow-lg sm:shadow-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
          aria-label="Add new enquiry"
        >
          <Plus className="w-6 h-6 sm:w-5 sm:h-5 sm:mr-2" />
          <span className="sr-only sm:not-sr-only">Add Enquiry</span>
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search enquiries..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 text-sm sm:text-base"
            />
          </div>
          <div className="grid grid-cols-2 sm:flex gap-2">
            {(['all', 'new', 'in_progress', 'closed'] as StatusFilter[]).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md scale-105'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm hover:scale-105 active:scale-95'
                }`}
              >
                {status === 'in_progress'
                  ? 'In Progress'
                  : status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enquiries List */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-500 font-medium">Loading enquiries...</p>
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-inner">
            <Search className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          </div>
          <p className="text-gray-700 font-semibold text-base sm:text-lg mb-1">
            No enquiries found
          </p>
          <p className="text-gray-500 text-xs sm:text-sm">Try adjusting your search or filters</p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-3 text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-4 mb-6">
            {currentItems.map(enquiry => (
              <div
                key={enquiry._id}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-medium text-gray-900 truncate">
                        {enquiry.customerName}
                      </h3>
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(enquiry.status)} border border-opacity-30`}
                      >
                        {enquiry.status === 'in_progress'
                          ? 'In Progress'
                          : enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span className="truncate">{enquiry.email}</span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <Phone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {enquiry.phone}
                    </div>
                    {enquiry.assignedTo && (
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <UserIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {enquiry.assignedTo.name}
                      </div>
                    )}
                    <div className="mt-1 text-xs text-gray-400">
                      {formatDate(enquiry.createdAt)}
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-1">
                    <button
                      onClick={() => setViewingEnquiry(enquiry)}
                      className="text-blue-600 hover:text-blue-900 p-1.5 rounded-full hover:bg-blue-50"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingEnquiry(enquiry)}
                      className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-full hover:bg-indigo-50"
                      title="Edit enquiry"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(enquiry._id)}
                      className="text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-red-50"
                      title="Delete enquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {enquiry.message && (
                  <div className="mt-2 text-sm text-gray-600 line-clamp-2">{enquiry.message}</div>
                )}
              </div>
            ))}
            {/* Mobile Pagination */}
            {totalPages >= 1 && (
              <div className="flex justify-between items-center mt-4 px-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-white text-blue-600 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  Previous
                </button>

                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-white text-blue-600 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <style>{`
                table {
                  border-collapse: separate;
                  border-spacing: 0;
                }
                th {
                  background-color: #f9fafb;
                }
                tr:not(:last-child) {
                  border-bottom: 1px solid #e5e7eb;
                }
                th:first-child, td:first-child {
                  padding-left: 1.5rem;
                }
                th:last-child, td:last-child {
                  padding-right: 1.5rem;
                }
              `}</style>
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      <span>Customer</span>
                    </div>
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </div>
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>Phone</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Status
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      Assigned To
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map(enquiry => (
                  <tr key={enquiry._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {enquiry.customerName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 truncate max-w-[180px] sm:max-w-none">
                        {enquiry.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{enquiry.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(
                          enquiry.status
                        )} border border-opacity-30`}
                      >
                        {enquiry.status === 'in_progress'
                          ? 'In Progress'
                          : enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {enquiry.assignedTo?.name || (
                          <span className="text-gray-400 italic">Unassigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(enquiry.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setViewingEnquiry(enquiry)}
                          className="text-blue-600 hover:text-blue-900 p-1.5 rounded-full hover:bg-blue-50"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingEnquiry(enquiry)}
                          className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-full hover:bg-indigo-50"
                          title="Edit enquiry"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(enquiry._id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-sm"
                          title="Delete Enquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages >= 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastItem, filteredEnquiries.length)}
                      </span>{' '}
                      of <span className="font-medium">{filteredEnquiries.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">First</span>
                        <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === pageNum
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages
                            ? 'text-gray-300'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages
                            ? 'text-gray-300'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Last</span>
                        <ChevronsRight className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Enquiry Modal */}
      {viewingEnquiry && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Enquiry Details</h2>
              </div>
              <button
                onClick={() => setViewingEnquiry(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <UserIcon className="w-4 h-4 text-gray-500" />
                    Customer Name
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-100 border border-gray-200 p-3 rounded-lg">
                    {viewingEnquiry.customerName}
                  </p>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    Email
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-100 border border-gray-200 p-3 rounded-lg">
                    {viewingEnquiry.email}
                  </p>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    Phone
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-100 border border-gray-200 p-3 rounded-lg">
                    {viewingEnquiry.phone}
                  </p>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    Status
                  </label>
                  <span
                    className={`inline-flex px-3 py-1.5 mt-1.5 text-xs font-semibold rounded-full shadow-sm ${getStatusBadgeColor(
                      viewingEnquiry.status
                    )}`}
                  >
                    {viewingEnquiry.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  Message
                </label>
                <p className="text-sm text-gray-900 bg-gray-100 border border-gray-200 p-4 rounded-lg whitespace-pre-wrap">
                  {viewingEnquiry.message}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <UserIcon className="w-4 h-4 text-gray-500" />
                    Assigned To
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-100 border border-gray-200 p-3 rounded-lg">
                    {viewingEnquiry.assignedTo?.name || (
                      <span className="text-gray-400 italic">Unassigned</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    Created At
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-100 border border-gray-200 p-3 rounded-lg">
                    {new Date(viewingEnquiry.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <EnquiryForm onSubmit={handleCreate} onClose={() => setShowForm(false)} users={users} />
      )}

      {editingEnquiry && (
        <EnquiryForm
          enquiry={editingEnquiry}
          onSubmit={handleUpdate}
          onClose={() => setEditingEnquiry(null)}
          users={users}
        />
      )}
    </div>
  );
}
