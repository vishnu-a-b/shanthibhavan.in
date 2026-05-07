'use client';

import { useState, useEffect } from 'react';
import { History, Download, Filter } from 'lucide-react';
import { getValidAccessToken } from '../../login/actions';
import DataTable, { TableColumn } from 'react-data-table-component';

interface Donation {
  _id: string;
  donorName: string;
  email: string;
  amount: number;
  currency: string;
  donationType: string;
  offlinePaymentMethod?: string;
  approvalStatus: string;
  paymentStatus: string;
  receiptNumber?: string;
  createdAt: string;
  addedBy?: { username: string };
  approvedBy?: { username: string };
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

export default function DonationHistoryPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ approvalStatus: '' });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

  const fetchHistory = async () => {
    try {
      const token = await getValidAccessToken();
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filter.approvalStatus && { approvalStatus: filter.approvalStatus }),
      });

      const res = await fetch(`${API_URL}/api/donation/offline/history?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        setDonations(data.donations);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [pagination.page, pagination.limit, filter]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const columns: TableColumn<Donation>[] = [
    {
      name: 'Receipt #',
      cell: (row) => (
        <span className="font-mono text-sm text-gray-900">{row.receiptNumber || '-'}</span>
      ),
    },
    {
      name: 'Donor',
      cell: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.donorName}</p>
          <p className="text-sm text-gray-500">{row.email}</p>
        </div>
      ),
      minWidth: '180px',
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
      name: 'Method',
      cell: (row) => (
        <span className="capitalize text-gray-700">
          {row.offlinePaymentMethod?.replace('_', ' ') || '-'}
        </span>
      ),
    },
    {
      name: 'Status',
      cell: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(row.approvalStatus)}`}>
          {row.approvalStatus}
        </span>
      ),
    },
    {
      name: 'Added By',
      cell: (row) => (
        <span className="text-gray-600">{row.addedBy?.username || '-'}</span>
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
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <History className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Offline Donation History</h1>
            <p className="text-gray-600">Track all offline payment records</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filter.approvalStatus}
            onChange={(e) => setFilter({ ...filter, approvalStatus: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
          >
            <option value="">All Status</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
      </div>

      {/* DataTable */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <DataTable
          columns={columns}
          data={donations}
          progressPending={loading}
          progressComponent={<div className="py-12 text-gray-500">Loading...</div>}
          noDataComponent={<div className="py-12 text-gray-500">No history found.</div>}
          pagination
          paginationServer
          paginationTotalRows={pagination.total}
          paginationDefaultPage={pagination.page}
          paginationPerPage={pagination.limit}
          onChangePage={(page) => setPagination(prev => ({ ...prev, page }))}
          onChangeRowsPerPage={(newLimit) => setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }))}
          customStyles={customStyles}
        />
      </div>
    </div>
  );
}
