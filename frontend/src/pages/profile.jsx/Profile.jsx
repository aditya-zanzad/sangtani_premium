import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaBox, 
  FaShoppingCart, 
  FaRupeeSign, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope,
  FaTruck
} from "react-icons/fa";
import { MdPayment, MdDoneAll } from "react-icons/md";
import { GiClothes } from "react-icons/gi";
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const UserDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ 
    totalOrders: 0, 
    totalSpent: 0,
    totalProducts: 0,
    categoryStats: {}
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("User not logged in");
        
        const backend = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${backend}/api/orders/user/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch orders");
        
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);

        // Calculate enhanced statistics
        const categoryStats = {};
        data.forEach(order => {
          order.products.forEach(product => {
            categoryStats[product.category] = (categoryStats[product.category] || 0) + (product.quantity || 1);
          });
        });

        setStats({
          totalOrders: data.length,
          totalSpent: data.reduce((sum, order) => sum + (order.amount / 100), 0),
          totalProducts: data.reduce((sum, order) => sum + order.products.length, 0),
          categoryStats
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Chart Data
  const spendingData = {
    labels: ['Total Spent', 'Remaining Budget'],
    datasets: [{
      data: [stats.totalSpent, Math.max(50000 - stats.totalSpent, 0)],
      backgroundColor: ['#4F46E5', '#E5E7EB'],
      borderWidth: 0,
    }]
  };

  const categoryData = {
    labels: Object.keys(stats.categoryStats),
    datasets: [{
      label: 'Items Purchased',
      data: Object.values(stats.categoryStats),
      backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
    }]
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <FaTruck className="mr-2 text-indigo-600 animate-bounce" />
              My Account
            </h2>
            <nav className="space-y-3">
              <Link to="" className="flex items-center p-3 rounded-lg bg-indigo-100 text-indigo-600 font-medium hover:bg-indigo-200 transition-colors">
                <FaBox className="mr-3" />
                My Orders
              </Link>
              <Link to="/cart" className="flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition-colors">
                <FaShoppingCart className="mr-3" />
                My Cart
              </Link>
            </nav>
          </div>

          {/* Quick Stats with Animation */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Shopping Analytics</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                <span className="text-gray-600">Orders</span>
                <span className="font-bold text-indigo-600 animate-pulse">{stats.totalOrders}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-600">Products</span>
                <span className="font-bold text-green-600 animate-pulse">{stats.totalProducts}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-gray-600">Spent</span>
                <span className="font-bold text-purple-600 animate-pulse">
                  ₹{stats.totalSpent.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Analytics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Spending Overview</h3>
              <Doughnut 
                data={spendingData}
                options={{
                  plugins: {
                    legend: { position: 'bottom' },
                    tooltip: { backgroundColor: '#4F46E5' }
                  }
                }}
              />
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Category Distribution</h3>
              <Bar 
                data={categoryData}
                options={{
                  plugins: {
                    legend: { display: false },
                    tooltip: { backgroundColor: '#10B981' }
                  },
                  scales: {
                    y: { beginAtZero: true }
                  }
                }}
              />
            </div>
          </div>

          {/* Order List */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <MdPayment className="mr-2 text-green-600 animate-spin-slow" />
              Recent Orders
            </h2>

            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500 animate-pulse">{error}</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No orders yet? Start shopping now!</p>
                <Link to="/shop" className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors">
                  Shop Now
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="border rounded-xl p-6 hover:shadow-lg transition-all bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Order # {order.order_id.slice(-8).toUpperCase()}</p>
                        <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-gray-800">₹{(order.amount / 100).toLocaleString()}</p>
                        <div className="flex items-center text-green-600">
                          <MdDoneAll className="mr-1" />
                          <span className="text-sm">Completed</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                      <h3 className="font-semibold mb-2 text-indigo-700">Shipping To</h3>
                      <p>{order.shippingAddress?.name}</p>
                      <p>{order.shippingAddress?.street}, {order.shippingAddress?.city} - {order.shippingAddress?.pincode}</p>
                    </div>

                    <h3 className="font-semibold mb-3">Items</h3>
                    <div className="space-y-3">
                      {order.products.map((product, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <p className="text-gray-600">{product.category} (Size: {product.size})</p>
                          <p className="text-gray-800">₹{product.price} x {product.quantity || 1}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
