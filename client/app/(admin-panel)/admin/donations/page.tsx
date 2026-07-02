'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Download, Eye, X, User, CreditCard, FileText, Building2 } from 'lucide-react';
import { getValidAccessToken } from '../login/actions';
import DataTable, { TableColumn } from 'react-data-table-component';

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

const customStyles = {
  headRow: {
    style: {
      backgroundColor: '#f9fafb',
      borderBottom: '1px solid #e5e7eb',
    },
  },
  headCells: {
    style: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#111827',
      paddingLeft: '24px',
      paddingRight: '24px',
    },
  },
  cells: {
    style: {
      paddingLeft: '24px',
      paddingRight: '24px',
      paddingTop: '16px',
      paddingBottom: '16px',
    },
  },
  rows: {
    style: {
      '&:hover': {
        backgroundColor: '#f9fafb',
      },
    },
  },
};

export default function DonationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-500">Loading...</div>}>
      <DonationsPageInner />
    </Suspense>
  );
}

function DonationsPageInner() {
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
        limit: pagination.limit.toString(),
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

  const exportCSV = async () => {
    try {
      const token = await getValidAccessToken();

      const params = new URLSearchParams({
        page: '1',
        limit: '10000',
        ...(filter.status && { status: filter.status }),
        ...(filter.type && { donationType: filter.type }),
        ...(filter.startDate && { startDate: filter.startDate }),
        ...(filter.endDate && { endDate: filter.endDate }),
        ...(filter.search && { search: filter.search }),
      });

      const res = await fetch(`${API_URL}/api/donation?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!data.success) return;

      const rows: Donation[] = data.donations;

      const headers = ['Date', 'Donor Name', 'Email', 'Phone', 'Amount', 'Currency', 'Mode', 'Type', 'Status', 'Receipt Number'];
      const csvLines = [
        headers.join(','),
        ...rows.map((d) => [
          new Date(d.createdAt).toLocaleDateString('en-IN'),
          `"${d.donorName.replace(/"/g, '""')}"`,
          `"${d.email.replace(/"/g, '""')}"`,
          d.phone || '',
          d.amount,
          d.currency,
          d.isOffline ? 'Offline' : 'Online',
          d.donationType,
          d.paymentStatus,
          d.receiptNumber || '',
        ].join(',')),
      ];

      const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `donations_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('CSV export failed:', err);
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
  }, [pagination.page, pagination.limit, filter]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      SUCCESS: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      REFUNDED: 'bg-gray-100 text-gray-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const columns: TableColumn<Donation>[] = [
    {
      name: 'Donor',
      cell: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.donorName}</p>
          <p className="text-sm text-gray-500">{row.email}</p>
        </div>
      ),
      minWidth: '200px',
    },
    {
      name: 'Phone',
      cell: (row) => (
        <span className="text-gray-700 text-sm">{row.phone || '—'}</span>
      ),
      minWidth: '130px',
    },
    {
      name: 'Amount',
      cell: (row) => (
        <span className="font-semibold text-gray-900">
          {row.currency} {row.amount.toLocaleString()}
        </span>
      ),
      sortable: true,
      selector: (row) => row.amount,
    },
    {
      name: 'Type',
      cell: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.isOffline ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
          {row.isOffline ? 'Offline' : 'Online'} - {row.donationType}
        </span>
      ),
    },
    {
      name: 'Status',
      cell: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(row.paymentStatus)}`}>
          {row.paymentStatus}
        </span>
      ),
    },
    {
      name: 'Date',
      cell: (row) => (
        <span className="text-gray-600">
          {new Date(row.createdAt).toLocaleDateString('en-IN')}
        </span>
      ),
      sortable: true,
      selector: (row) => row.createdAt,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => viewDetails(row._id)}
            title="View full transaction details"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            Details
          </button>
          {row.paymentStatus === 'SUCCESS' && (
            <button
              onClick={() => viewReceipt(row)}
              disabled={generatingReceipt === row._id}
              title={row.receiptUrl ? 'View receipt' : 'Generate & view receipt'}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              {generatingReceipt === row._id ? 'Generating...' : row.receiptUrl ? 'Receipt' : 'Get Receipt'}
            </button>
          )}
        </div>
      ),
      minWidth: '200px',
    },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Donations</h1>
          <p className="text-gray-600 mt-1">View and manage all donation records</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
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
            placeholder="Search by name, email or phone..."
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
          />
          <input
            type="date"
            value={filter.endDate}
            onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
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

      {/* DataTable */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : (
          <DataTable
            columns={columns}
            data={donations}
            progressPending={loading}
            progressComponent={<div className="py-12 text-gray-500">Loading...</div>}
            noDataComponent={<div className="py-12 text-gray-500">No donations found.</div>}
            pagination
            paginationServer
            paginationTotalRows={pagination.total}
            paginationDefaultPage={pagination.page}
            paginationPerPage={pagination.limit}
            onChangePage={(page) => setPagination(prev => ({ ...prev, page }))}
            onChangeRowsPerPage={(newLimit) => setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }))}
            customStyles={customStyles}
          />
        )}
      </div>

      {/* Transaction Details Modal */}
      {(loadingDetails || selectedDonation) && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => { setSelectedDonation(null); setLoadingDetails(false); }}
          />
          <div className="relative z-10 w-full max-w-xl h-full bg-white shadow-2xl overflow-y-auto">
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

                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Donor Information</h3>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                    <Row label="Name" value={selectedDonation.donorName} />
                    <Row label="Email" value={selectedDonation.email} />
                    {selectedDonation.phone && <Row label="Phone" value={selectedDonation.phone} />}
                    {selectedDonation.address && <Row label="Address" value={selectedDonation.address} />}
                    {selectedDonation.panNumber && <Row label="PAN" value={selectedDonation.panNumber} />}
                  </div>
                </section>

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
