import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, Download } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const { data } = await axios.get(`${backend}/api/users/orders`);

        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received from server');
        }

        setOrders(data); // Corrected: Use parentheses, not colon
      } catch (error) {
        setError(error.message || 'Failed to fetch orders');
      } finally {
        setLoading(false); // Ensure loading state is cleared
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on status
  const filteredOrders = filterStatus === 'All'
    ? orders
    : orders.filter(order => order.status === filterStatus);

  // Export to CSV
  const exportToCSV = () => {
    const csvContent = [
      ['Order ID', 'Customer', 'Date', 'Amount', 'Status'],
      ...filteredOrders.map(order => [
        order.order_id,
        order.shippingAddress?.name || 'N/A',
        new Date(order.createdAt).toLocaleDateString(),
        `₹${(order.amount / 100).toFixed(2)}`,
        order.status,
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'orders.csv';
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
        <p className="ml-4 text-lg text-gray-700 font-medium">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <div className="text-red-500 text-5xl mb-4 animate-pulse">⚠️</div>
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 flex items-center">
            <Package className="w-10 h-10 mr-3 text-indigo-600 animate-bounce" />
            Orders Dashboard
          </h1>
          <button
            onClick={exportToCSV}
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all shadow-md"
          >
            <Download className="w-5 h-5 mr-2" />
            Export CSV
          </button>
        </div>

        <div className="mb-6 flex space-x-4">
          {['All', 'Processing', 'Shipped'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                filterStatus === status
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-indigo-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <p className="text-gray-500 text-xl font-medium">No orders found for this filter.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="p-4 font-semibold">Order ID</th>
                    <th className="p-4 font-semibold">Customer</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Amount</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr
                      key={order.order_id}
                      className={`border-b hover:bg-indigo-50 transition-all ${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <td className="p-4 font-medium text-gray-800">{order.order_id}</td>
                      <td className="p-4 text-gray-700">
                        {order.shippingAddress?.name || 'N/A'}
                      </td>
                      <td className="p-4 text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 font-medium text-gray-800">
                        ₹{(order.amount / 100).toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-sm ${
                            order.status === 'Shipped'
                              ? 'bg-green-100 text-green-700'
                              : order.status === 'Processing'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {order.status === 'Shipped' && (
                            <CheckCircle className="w-4 h-4 mr-2 animate-pulse" />
                          )}
                          {order.status === 'Processing' && (
                            <Clock className="w-4 h-4 mr-2 animate-spin-slow" />
                          )}
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <Link
                          to={`/payment_success`}
                          className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;