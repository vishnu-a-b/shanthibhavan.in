'use client';

import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { getValidAccessToken } from '../../login/actions';

interface Donation {
  _id: string;
  donorName: string;
  email: string;
  phone: string;
  amount: number;
  currency: string;
  donationType: string;
  offlinePaymentMethod: string;
  notes?: string;
  createdAt: string;
  addedBy?: { username: string };
}

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';
const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl.slice(0, -4) : rawApiUrl;


export default function PendingApprovalsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const fetchPending = async () => {
    try {
      const token = await getValidAccessToken();
      const res = await fetch(`${API_URL}/api/donation/pending-approvals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setDonations(data.donations);
        setSelectedIds(new Set());
      }
    } catch (error) {
      console.error('Failed to fetch pending approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

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
        setDonations(prev => prev.filter(d => d._id !== id));
        setSelectedIds(prev => { const s = new Set(prev); s.delete(id); return s; });
      }
    } catch (error) {
      console.error('Failed to approve:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.size === 0) return;
    setBulkLoading(true);
    const token = await getValidAccessToken();
    const ids = Array.from(selectedIds);
    let approved = 0;
    for (const id of ids) {
      try {
        const res = await fetch(`${API_URL}/api/donation/${id}/approve`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) approved++;
      } catch {
        // continue with rest
      }
    }
    setDonations(prev => prev.filter(d => !selectedIds.has(d._id)));
    setSelectedIds(new Set());
    setBulkLoading(false);
    if (approved < ids.length) {
      alert(`${approved} of ${ids.length} donations approved. Some may have failed.`);
    }
  };

  const handleReject = async () => {
    if (!selectedDonation || !rejectReason) return;
    setActionLoading(selectedDonation._id);
    try {
      const token = await getValidAccessToken();
      const res = await fetch(`${API_URL}/api/donation/${selectedDonation._id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: rejectReason }),
      });
      const data = await res.json();
      if (data.success) {
        setDonations(prev => prev.filter(d => d._id !== selectedDonation._id));
        setSelectedIds(prev => { const s = new Set(prev); s.delete(selectedDonation._id); return s; });
        setShowRejectModal(false);
        setSelectedDonation(null);
        setRejectReason('');
      }
    } catch (error) {
      console.error('Failed to reject:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const allSelected = donations.length > 0 && selectedIds.size === donations.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(donations.map(d => d._id)));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id); else s.add(id);
      return s;
    });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
            <p className="text-gray-600">Review and approve offline donations</p>
          </div>
        </div>

        {selectedIds.size > 0 && (
          <button
            onClick={handleBulkApprove}
            disabled={bulkLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 font-medium"
          >
            {bulkLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            Approve Selected ({selectedIds.size})
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border p-6 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-40 mb-3" />
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, j) => <div key={j} className="h-4 bg-gray-100 rounded" />)}
              </div>
            </div>
          ))}
        </div>
      ) : donations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">All caught up!</h3>
          <p className="text-gray-600">No pending donations to review.</p>
        </div>
      ) : (
        <>
          {/* Select all bar */}
          <div className="flex items-center gap-3 mb-3 px-1">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 select-none">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="w-4 h-4 rounded border-gray-300"
              />
              {allSelected ? 'Deselect all' : `Select all (${donations.length})`}
            </label>
          </div>

          <div className="space-y-4">
            {donations.map((donation) => (
              <div
                key={donation._id}
                className={`bg-white rounded-xl shadow-sm border p-6 transition-colors ${selectedIds.has(donation._id) ? 'border-green-300 bg-green-50/40' : ''}`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedIds.has(donation._id)}
                    onChange={() => toggleOne(donation._id)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 cursor-pointer shrink-0"
                  />

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{donation.donorName}</h3>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        Pending
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{donation.email}{donation.phone ? ` · ${donation.phone}` : ''}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Amount</p>
                        <p className="font-semibold text-gray-900">{donation.currency} {donation.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Payment Method</p>
                        <p className="font-medium text-gray-900 capitalize">{donation.offlinePaymentMethod.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Type</p>
                        <p className="font-medium text-gray-900 capitalize">{donation.donationType}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Added By</p>
                        <p className="font-medium text-gray-900">{donation.addedBy?.username || 'N/A'}</p>
                      </div>
                    </div>
                    {donation.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">{donation.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-2 shrink-0">
                    <button
                      onClick={() => handleApprove(donation._id)}
                      disabled={actionLoading === donation._id || bulkLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
                    >
                      {actionLoading === donation._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDonation(donation);
                        setShowRejectModal(true);
                      }}
                      disabled={actionLoading === donation._id || bulkLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedDonation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reject Donation</h3>
            <p className="text-gray-600 text-sm mb-4">
              Provide a reason for rejecting <strong>{selectedDonation.donorName}</strong>&apos;s donation of{' '}
              <strong>{selectedDonation.currency} {selectedDonation.amount.toLocaleString()}</strong>.
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
                disabled={!rejectReason || actionLoading === selectedDonation._id}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium text-sm"
              >
                {actionLoading === selectedDonation._id ? 'Rejecting...' : 'Confirm Reject'}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedDonation(null);
                  setRejectReason('');
                }}
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
