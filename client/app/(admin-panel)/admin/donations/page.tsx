'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Download, Eye, X, User, CreditCard, FileText, Building2 } from 'lucide-react';
import { getValidAccessToken } from '../login/actions';

interface Donation {
  _id: string;
  donorName: string;
  email: string;
  phone: string;
  amount: number;
  currency: string;
  donationType: string;
  paymentStatus: string;
  isOffline: boolean;
  approvalStatus?: string;
  receiptNumber?: string;
  receiptUrl?: string;
  receiptGenerated: boolean;
  createdAt: string;
}

interface DonationDetail extends Donation {
  countryCode?: string;
  panNumber?: string;
  address?: string;
  notes?: string;
  transactionId?: string;
  gatewayOrderId?: string;
  razorpayOrderId?: string;
  bankReferenceNumber?: string;
  paymentMethod?: string;
  authStatus?: string;
  checksumVerified?: boolean;
  offlinePaymentMethod?: string;
  rejectionReason?: string;
  approvalDate?: string;
  addedBy?: { username: string; email: string };
  approvedBy?: { username: string; email: string };
  updatedAt?: string;
}

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';
const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl.slice(0, -4) : rawApiUrl;


export default function DonationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingReceipt, setGeneratingReceipt] = useState<string | null>(null);
  const [selectedDonation, setSelectedDonation] = useState<DonationDetail | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [filter, setFilter] = useState({ status: '', type: searchParams.get('type') || '', startDate: '', endDate: '', search: '' });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

  const fetchDonations = async () => {
    setError(null);
    try {
      const token = await getValidAccessToken();

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: '20',
        ...(filter.status && { status: filter.status }),
        ...(filter.type && { donationType: filter.type }),
        ...(filter.startDate && { startDate: filter.startDate }),
        ...(filter.endDate && { endDate: filter.endDate }),
        ...(filter.search && { search: filter.search }),
      });

      const res = await fetch(`${API_URL}/api/donation?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }

      const data = await res.json();

      if (data.success) {
        setDonations(data.donations);
        setPagination(data.pagination);
      } else {
        setError(data.error || 'Failed to load donations.');
      }
    } catch (error) {
      console.error('Failed to fetch donations:', error);
      setError('Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const viewReceipt = async (donation: Donation) => {
    // If already generated, open directly
    if (donation.receiptUrl) {
      window.open(donation.receiptUrl, '_blank');
      return;
    }

    if (donation.paymentStatus !== 'SUCCESS') return;

    setGeneratingReceipt(donation._id);
    try {
      const token = await getValidAccessToken();
      const res = await fetch(`${API_URL}/api/donation/${donation._id}/receipt`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.receiptUrl) {
        // Update local state so button reflects generated state immediately
        setDonations(prev =>
          prev.map(d => d._id === donation._id ? { ...d, receiptUrl: data.receiptUrl, receiptGenerated: true } : d)
        );
        window.open(data.receiptUrl, '_blank');
      }
    } catch (err) {
      console.error('Failed to get receipt:', err);
    } finally {
      setGeneratingReceipt(null);
    }
  };

  const viewDetails = async (donationId: string) => {
    setLoadingDetails(true);
    setSelectedDonation(null);
    try {
      const token = await getValidAccessToken();
      const res = await fetch(`${API_URL}/api/donation/${donationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSelectedDonation(data.donation);
      }
    } catch (err) {
      console.error('Failed to fetch donation details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [pagination.page, filter]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      SUCCESS: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      REFUNDED: 'bg-gray-100 text-gray-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const showingFrom = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const showingTo = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Donations</h1>
          <p className="text-gray-600 mt-1">View and manage all donation records</p>
        </div>
        <button
          disabled
          title="CSV export coming soon"
          className="flex items-center gap-2 px-4 py-2 bg-primary/40 text-white rounded-lg cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex gap-4 flex-wrap">
          <input
            type="text"
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            placeholder="Search by name or email..."
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary flex-1 min-w-[200px]"
          />
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
          >
            <option value="">All Status</option>
            <option value="SUCCESS">Success</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
          <select
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
          >
            <option value="">All Types</option>
            <option value="general">General</option>
            <option value="fellowship">Fellowship</option>
            <option value="campaign">Campaign</option>
          </select>
          <input
            type="date"
            value={filter.startDate}
            onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={filter.endDate}
            onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="End Date"
          />
          {(filter.startDate || filter.endDate) && (
            <button
              onClick={() => setFilter({ ...filter, startDate: '', endDate: '' })}
              className="px-4 py-2 text-sm text-gray-600 border rounded-lg hover:bg-gray-50"
            >
              Clear Dates
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Donor', 'Amount', 'Type', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {[...Array(6)].map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mb-1.5" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-44" />
                  </td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-20" /></td>
                  <td className="px-6 py-4"><div className="h-5 bg-gray-200 rounded-full animate-pulse w-24" /></td>
                  <td className="px-6 py-4"><div className="h-5 bg-gray-200 rounded-full animate-pulse w-16" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-20" /></td>
                  <td className="px-6 py-4"><div className="h-7 bg-gray-200 rounded-lg animate-pulse w-16" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Donor</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {donations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No donations found.</td>
                </tr>
              ) : donations.map((donation) => (
                <tr key={donation._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{donation.donorName}</p>
                      <p className="text-sm text-gray-500">{donation.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {donation.currency} {donation.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${donation.isOffline ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                      {donation.isOffline ? 'Offline' : 'Online'} - {donation.donationType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(donation.paymentStatus)}`}>
                      {donation.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(donation.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => viewDetails(donation._id)}
                        title="View full transaction details"
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Details
                      </button>
                      {donation.paymentStatus === 'SUCCESS' && (
                        <button
                          onClick={() => viewReceipt(donation)}
                          disabled={generatingReceipt === donation._id}
                          title={donation.receiptUrl ? 'View receipt' : 'Generate & view receipt'}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          {generatingReceipt === donation._id ? 'Generating...' : donation.receiptUrl ? 'Receipt' : 'Get Receipt'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {pagination.total > 0 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {showingFrom}–{showingTo} of {pagination.total} donations
            </p>
            {pagination.pages > 1 && (
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Transaction Details Modal */}
      {(loadingDetails || selectedDonation) && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => { setSelectedDonation(null); setLoadingDetails(false); }}
          />

          {/* Slide-in panel */}
          <div className="relative z-10 w-full max-w-xl h-full bg-white shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-gray-900">Transaction Details</h2>
              <button
                onClick={() => { setSelectedDonation(null); setLoadingDetails(false); }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {loadingDetails ? (
              <div className="p-8 text-center text-gray-500">Loading details...</div>
            ) : selectedDonation && (
              <div className="p-6 space-y-6">

                {/* Donor Info */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Donor Information</h3>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                    <Row label="Name" value={selectedDonation.donorName} />
                    <Row label="Email" value={selectedDonation.email} />
                    {selectedDonation.phone && <Row label="Phone" value={`${selectedDonation.countryCode || ''} ${selectedDonation.phone}`} />}
                    {selectedDonation.address && <Row label="Address" value={selectedDonation.address} />}
                    {selectedDonation.panNumber && <Row label="PAN" value={selectedDonation.panNumber} />}
                  </div>
                </section>

                {/* Donation Details */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Donation Details</h3>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                    <Row label="Amount" value={`${selectedDonation.currency} ${selectedDonation.amount.toLocaleString('en-IN')}`} />
                    <Row label="Type" value={selectedDonation.donationType} capitalize />
                    <Row label="Mode" value={selectedDonation.isOffline ? 'Offline' : 'Online'} />
                    <Row label="Status" value={selectedDonation.paymentStatus} badge statusBadge={selectedDonation.paymentStatus} />
                    {selectedDonation.notes && <Row label="Notes" value={selectedDonation.notes} />}
                    <Row label="Date" value={new Date(selectedDonation.createdAt).toLocaleString('en-IN')} />
                  </div>
                </section>

                {/* Transaction / Gateway Info */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Transaction Info</h3>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                    {selectedDonation.transactionId && <Row label="Transaction ID" value={selectedDonation.transactionId} mono />}
                    {selectedDonation.gatewayOrderId && <Row label="Order ID" value={selectedDonation.gatewayOrderId} mono />}
                    {selectedDonation.razorpayOrderId && <Row label="Razorpay Order ID" value={selectedDonation.razorpayOrderId} mono />}
                    {selectedDonation.bankReferenceNumber && <Row label="Bank Reference" value={selectedDonation.bankReferenceNumber} mono />}
                    {selectedDonation.paymentMethod && <Row label="Payment Method" value={selectedDonation.paymentMethod} capitalize />}
                    {selectedDonation.authStatus && <Row label="Auth Status" value={selectedDonation.authStatus} mono />}
                    {selectedDonation.checksumVerified !== undefined && (
                      <Row label="Checksum Verified" value={selectedDonation.checksumVerified ? 'Yes' : 'No'} />
                    )}
                  </div>
                </section>

                {/* Offline Workflow */}
                {selectedDonation.isOffline && (
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Offline Workflow</h3>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                      {selectedDonation.offlinePaymentMethod && <Row label="Payment Method" value={selectedDonation.offlinePaymentMethod.replace('_', ' ')} capitalize />}
                      {selectedDonation.approvalStatus && <Row label="Approval Status" value={selectedDonation.approvalStatus} capitalize />}
                      {selectedDonation.addedBy && <Row label="Added By" value={`${selectedDonation.addedBy.username} (${selectedDonation.addedBy.email})`} />}
                      {selectedDonation.approvedBy && <Row label="Approved/Rejected By" value={`${selectedDonation.approvedBy.username} (${selectedDonation.approvedBy.email})`} />}
                      {selectedDonation.approvalDate && <Row label="Approval Date" value={new Date(selectedDonation.approvalDate).toLocaleString('en-IN')} />}
                      {selectedDonation.rejectionReason && <Row label="Rejection Reason" value={selectedDonation.rejectionReason} />}
                    </div>
                  </section>
                )}

                {/* Receipt */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Receipt</h3>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                    {selectedDonation.receiptNumber && <Row label="Receipt No." value={selectedDonation.receiptNumber} mono />}
                    <Row label="Generated" value={selectedDonation.receiptGenerated ? 'Yes' : 'No'} />
                    {selectedDonation.receiptUrl && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-gray-500">Receipt PDF</span>
                        <a
                          href={selectedDonation.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                        >
                          <Eye className="w-3 h-3" /> View PDF
                        </a>
                      </div>
                    )}
                  </div>
                </section>

              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  mono = false,
  capitalize = false,
  badge = false,
  statusBadge,
}: {
  label: string;
  value: string;
  mono?: boolean;
  capitalize?: boolean;
  badge?: boolean;
  statusBadge?: string;
}) {
  const statusColors: Record<string, string> = {
    SUCCESS: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    REFUNDED: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-gray-500 shrink-0">{label}</span>
      {badge && statusBadge ? (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[statusBadge] || 'bg-gray-100 text-gray-700'}`}>
          {value}
        </span>
      ) : (
        <span className={`text-gray-900 text-right break-all ${mono ? 'font-mono text-xs' : ''} ${capitalize ? 'capitalize' : ''}`}>
          {value}
        </span>
      )}
    </div>
  );
}
