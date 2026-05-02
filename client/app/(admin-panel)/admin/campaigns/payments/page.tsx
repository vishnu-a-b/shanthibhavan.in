'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Target, Search, Filter, Eye, FileText, X, User, CreditCard, Building2, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getValidAccessToken } from '../../login/actions';

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';
const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl.slice(0, -4) : rawApiUrl;

interface Campaign {
  _id: string;
  title: string;
}

interface Donation {
  _id: string;
  donorName: string;
  email: string;
  phone?: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  isOffline: boolean;
  approvalStatus?: string;
  receiptUrl?: string;
  receiptGenerated: boolean;
  offlinePaymentMethod?: string;
  createdAt: string;
  campaignId?: { _id: string; title: string };
}

interface DonationDetail extends Donation {
  panNumber?: string;
  address?: string;
  notes?: string;
  transactionId?: string;
  razorpayOrderId?: string;
  bankReferenceNumber?: string;
  paymentMethod?: string;
  addedBy?: { username: string; email: string };
  approvedBy?: { username: string; email: string };
  approvalDate?: string;
  rejectionReason?: string;
}

const statusBadge: Record<string, string> = {
  SUCCESS: 'bg-green-100 text-green-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  FAILED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
};

export default function CampaignPaymentsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState<DonationDetail | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [generatingReceipt, setGeneratingReceipt] = useState<string | null>(null);
  const [filter, setFilter] = useState({ campaignId: '', status: '', search: '' });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

  // Approval state
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<Donation | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    fetchDonations();
  }, [pagination.page, filter]);

  const fetchCampaigns = async () => {
    try {
      const token = await getValidAccessToken();
      const res = await fetch(`${API_URL}/api/campaign?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setCampaigns(data.campaigns);
    } catch (err) {
      console.error('Failed to fetch campaigns:', err);
    }
  };

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const token = await getValidAccessToken();
      const params = new URLSearchParams({
        donationType: 'campaign',
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filter.status && { status: filter.status }),
        ...(filter.search && { search: filter.search }),
      });
      // Backend doesn't support campaignId filter in listDonations yet — we filter client-side below

      const res = await fetch(`${API_URL}/api/donation?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) { router.push('/admin/login'); return; }

      const data = await res.json();
      if (data.success) {
        setDonations(data.donations);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch donations:', err);
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = async (id: string) => {
    setLoadingDetails(true);
    setSelectedDonation(null);
    try {
      const token = await getValidAccessToken();
      const res = await fetch(`${API_URL}/api/donation/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setSelectedDonation(data.donation);
    } catch (err) {
      console.error('Failed to fetch details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const viewReceipt = async (donation: Donation) => {
    if (donation.receiptUrl) { window.open(donation.receiptUrl, '_blank'); return; }
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

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      const token = await getValidAccessToken();
      const res = await fetch(`${API_URL}/api/donation/${id}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setDonations(prev => prev.map(d =>
          d._id === id ? { ...d, approvalStatus: 'approved', paymentStatus: 'SUCCESS' } : d
        ));
      }
    } catch (err) {
      console.error('Failed to approve:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectTarget || !rejectReason) return;
    setActionLoading(rejectTarget._id);
    try {
      const token = await getValidAccessToken();
      const res = await fetch(`${API_URL}/api/donation/${rejectTarget._id}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: rejectReason }),
      });
      const data = await res.json();
      if (data.success) {
        setDonations(prev => prev.map(d =>
          d._id === rejectTarget._id ? { ...d, approvalStatus: 'rejected', paymentStatus: 'FAILED' } : d
        ));
        setShowRejectModal(false);
        setRejectTarget(null);
        setRejectReason('');
      }
    } catch (err) {
      console.error('Failed to reject:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Client-side campaign filter
  const displayed = filter.campaignId
    ? donations.filter(d => d.campaignId?._id === filter.campaignId)
    : donations;

  const showingFrom = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const showingTo = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campaign Payments</h1>
            <p className="text-gray-600 mt-1">All donations received for campaigns</p>
          </div>
        </div>
        <Link
          href="/admin/campaigns/add-payment"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium"
        >
          + Add Offline Payment
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filter.campaignId}
              onChange={(e) => setFilter({ ...filter, campaignId: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            >
              <option value="">All Campaigns</option>
              {campaigns.map(c => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>
          </div>
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
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Campaign', 'Donor', 'Amount', 'Method', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-4 text-left text-sm font-semibold text-gray-900">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[...Array(7)].map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-900">Campaign</th>
                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-900">Donor</th>
                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-900">Method</th>
                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                    No campaign payments found.
                  </td>
                </tr>
              ) : displayed.map((d) => (
                <tr key={d._id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-primary">
                      {d.campaignId?.title || '—'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900 text-sm">{d.donorName}</p>
                    <p className="text-xs text-gray-500">{d.email}</p>
                  </td>
                  <td className="px-5 py-4 font-semibold text-gray-900 text-sm">
                    {d.currency} {d.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700 capitalize">
                    {d.isOffline
                      ? (d.offlinePaymentMethod?.replace('_', ' ') || 'Offline')
                      : 'Online'}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge[d.paymentStatus] || 'bg-gray-100 text-gray-700'}`}>
                      {d.paymentStatus}
                    </span>
                    {d.isOffline && d.approvalStatus === 'pending' && (
                      <span className="ml-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                        Awaiting Approval
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {new Date(d.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => viewDetails(d._id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Details
                      </button>
                      {d.paymentStatus === 'SUCCESS' && (
                        <button
                          onClick={() => viewReceipt(d)}
                          disabled={generatingReceipt === d._id}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg disabled:opacity-50"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          {generatingReceipt === d._id ? 'Generating...' : d.receiptUrl ? 'Receipt' : 'Get Receipt'}
                        </button>
                      )}
                      {/* Approve / Reject for pending offline payments */}
                      {d.isOffline && d.approvalStatus === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(d._id)}
                            disabled={actionLoading === d._id}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg disabled:opacity-50"
                          >
                            {actionLoading === d._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                            Approve
                          </button>
                          <button
                            onClick={() => { setRejectTarget(d); setShowRejectModal(true); }}
                            disabled={actionLoading === d._id}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {pagination.total > 0 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {showingFrom}–{showingTo} of {pagination.total} payments
            </p>
            {pagination.pages > 1 && (
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 text-sm"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 text-sm"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Details Slide-in Panel */}
      {(loadingDetails || selectedDonation) && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setSelectedDonation(null); setLoadingDetails(false); }} />
          <div className="relative z-10 w-full max-w-xl h-full bg-white shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-gray-900">Payment Details</h2>
              <button onClick={() => { setSelectedDonation(null); setLoadingDetails(false); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            {loadingDetails ? (
              <div className="p-8 text-center text-gray-500">Loading details...</div>
            ) : selectedDonation && (
              <div className="p-6 space-y-6">
                {/* Campaign */}
                {selectedDonation.campaignId && (
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-4 h-4 text-primary" />
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Campaign</h3>
                    </div>
                    <div className="bg-primary/5 rounded-xl p-4 text-sm font-medium text-primary">
                      {selectedDonation.campaignId.title}
                    </div>
                  </section>
                )}

                {/* Donor Info */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Donor</h3>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                    <Row label="Name" value={selectedDonation.donorName} />
                    <Row label="Email" value={selectedDonation.email} />
                    {selectedDonation.phone && <Row label="Phone" value={selectedDonation.phone} />}
                    {selectedDonation.address && <Row label="Address" value={selectedDonation.address} />}
                    {selectedDonation.panNumber && <Row label="PAN" value={selectedDonation.panNumber} />}
                  </div>
                </section>

                {/* Payment */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Payment</h3>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                    <Row label="Amount" value={`${selectedDonation.currency} ${selectedDonation.amount.toLocaleString('en-IN')}`} />
                    <Row label="Mode" value={selectedDonation.isOffline ? `Offline — ${selectedDonation.offlinePaymentMethod?.replace('_', ' ') || ''}` : 'Online'} />
                    <Row label="Status" value={selectedDonation.paymentStatus} />
                    {selectedDonation.approvalStatus && <Row label="Approval" value={selectedDonation.approvalStatus} />}
                    {selectedDonation.notes && <Row label="Notes" value={selectedDonation.notes} />}
                    <Row label="Date" value={new Date(selectedDonation.createdAt).toLocaleString('en-IN')} />
                  </div>
                </section>

                {/* Transaction */}
                {(selectedDonation.transactionId || selectedDonation.razorpayOrderId || selectedDonation.bankReferenceNumber) && (
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Transaction</h3>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                      {selectedDonation.transactionId && <Row label="Transaction ID" value={selectedDonation.transactionId} mono />}
                      {selectedDonation.razorpayOrderId && <Row label="Razorpay Order" value={selectedDonation.razorpayOrderId} mono />}
                      {selectedDonation.bankReferenceNumber && <Row label="Bank Reference" value={selectedDonation.bankReferenceNumber} mono />}
                    </div>
                  </section>
                )}

                {/* Offline Workflow */}
                {selectedDonation.isOffline && selectedDonation.addedBy && (
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Offline Workflow</h3>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                      <Row label="Added By" value={selectedDonation.addedBy.username} />
                      {selectedDonation.approvedBy && <Row label="Approved By" value={selectedDonation.approvedBy.username} />}
                      {selectedDonation.approvalDate && <Row label="Approval Date" value={new Date(selectedDonation.approvalDate).toLocaleString('en-IN')} />}
                      {selectedDonation.rejectionReason && <Row label="Rejection Reason" value={selectedDonation.rejectionReason} />}
                    </div>
                  </section>
                )}

                {/* Receipt */}
                {selectedDonation.paymentStatus === 'SUCCESS' && (
                  <div className="pt-2">
                    <button
                      onClick={() => viewReceipt(selectedDonation)}
                      disabled={generatingReceipt === selectedDonation._id}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50"
                    >
                      <Eye className="w-4 h-4" />
                      {generatingReceipt === selectedDonation._id ? 'Generating...' : selectedDonation.receiptUrl ? 'View Receipt PDF' : 'Generate & View Receipt'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Reject Modal */}
      {showRejectModal && rejectTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] px-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reject Payment</h3>
            <p className="text-gray-600 text-sm mb-4">
              Provide a reason for rejecting <strong>{rejectTarget.donorName}</strong>&apos;s payment of{' '}
              <strong>{rejectTarget.currency} {rejectTarget.amount.toLocaleString('en-IN')}</strong>.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary mb-4 text-sm"
              rows={3}
              placeholder="Enter rejection reason..."
            />
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                disabled={!rejectReason || actionLoading === rejectTarget._id}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium text-sm"
              >
                {actionLoading === rejectTarget._id ? 'Rejecting...' : 'Confirm Reject'}
              </button>
              <button
                onClick={() => { setShowRejectModal(false); setRejectTarget(null); setRejectReason(''); }}
                className="flex-1 border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className={`text-gray-900 text-right break-all ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  );
}
