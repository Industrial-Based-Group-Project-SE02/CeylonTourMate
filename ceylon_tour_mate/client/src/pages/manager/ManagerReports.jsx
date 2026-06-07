import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import { useNavigate } from 'react-router-dom';

export default function ManagerReports() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const confirmDownload = () => setShowConfirm(true);

  const cancelDownload = () => setShowConfirm(false);

  const downloadBookingsPdf = async () => {
    try {
      setDownloading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ startDate, endDate, includeStatuses: 'confirmed,completed' });
      const res = await axios.get(`${API_BASE_URL}/api/reports/manager/confirmed-bookings-pdf?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'manager_bookings_report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setShowConfirm(false);
      alert('Bookings PDF downloaded');
    } catch (err) {
      console.error('Download failed', err);
      if (err.response && err.response.status === 403) {
        alert('Access denied: You are not authorized to download this report.');
      } else {
        alert('Failed to download PDF');
      }
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manager Reports - Bookings</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1 block w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1 block w-full border rounded px-2 py-1" />
        </div>
        <div className="flex items-end">
          <button onClick={confirmDownload} disabled={downloading} className="px-4 py-2 bg-blue-600 text-white rounded">{downloading ? 'Preparing...' : 'Download Bookings PDF'}</button>
        </div>
      </div>
      <p className="text-sm text-gray-600">This page allows managers to download booking details (confirmed/completed).</p>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3">
            <h2 className="text-lg font-semibold mb-2">Confirm Download</h2>
            <p className="mb-4">Do you want to download booking details for the selected date range?</p>
            <div className="flex justify-end gap-2">
              <button onClick={cancelDownload} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button onClick={downloadBookingsPdf} className="px-4 py-2 bg-blue-600 text-white rounded">Yes, Download</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
