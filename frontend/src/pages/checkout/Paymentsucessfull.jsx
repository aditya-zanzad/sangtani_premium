import React, { useEffect, useState } from "react";
import { CheckCircle, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const PaymentSuccessful = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paymentId = queryParams.get("payment_id");
  const urlOrderId = queryParams.get("order_id");

  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputOrderId, setInputOrderId] = useState(urlOrderId || "");

  useEffect(() => {
    if (urlOrderId) {
      fetchOrderDetails(urlOrderId);
    } else {
      setLoading(false);
    }
  }, [urlOrderId]);

  const fetchOrderDetails = async (orderIdToFetch, retries = 3, delay = 2000) => {
    if (!orderIdToFetch) {
      setError("Please enter an Order ID");
      return;
    }

    setLoading(true);
    setError(null);

    const attemptFetch = async (attempt) => {
      try {
        const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const { data } = await axios.get(`${backend}/api/orders/${orderIdToFetch}`);

        if (!data) {
          throw new Error("Order not found");
        }

        setOrder(data);
        fetchProductDetails(data.products);
        setLoading(false);
      } catch (err) {
        if (attempt < retries && err.message === "Order not found") {
          setError("Order not found yet. Retrying...");
          setTimeout(() => attemptFetch(attempt + 1), delay);
        } else {
          setError(err.message || "Failed to fetch order details");
          setOrder(null);
          setLoading(false);
        }
      }
    };

    attemptFetch(0);
  };

  const fetchProductDetails = async (productIds) => {
    try {
      const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const { data } = await axios.post(`${backend}/api/products/details`, { productIds });
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch product details", err);
    }
  };

  const handleFetchOrder = () => {
    fetchOrderDetails(inputOrderId);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-lg w-full">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
        <h1 className="text-3xl font-bold text-gray-800 mt-4">Payment Successful!</h1>
        <p className="text-gray-600 mt-2">Thank you for your purchase.</p>

        {!urlOrderId && (
          <div className="mt-6 space-y-4">
            <input
              type="text"
              value={inputOrderId}
              onChange={(e) => setInputOrderId(e.target.value)}
              placeholder="Enter Order ID (e.g., order_Q1S5ZBWKe1dBGT)"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleFetchOrder}
              disabled={loading}
              className={`w-full px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all shadow-md ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Fetching..." : "Fetch Order Details"}
            </button>
          </div>
        )}

        {loading && urlOrderId ? (
          <div className="mt-6 animate-pulse text-gray-500">Loading order details...</div>
        ) : error ? (
          <div className="mt-6 text-red-500">{error}</div>
        ) : (
          order && (
            <div className="mt-6 space-y-4">
              {paymentId && (
                <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
                  <span className="font-medium">Payment ID:</span> {paymentId}
                </div>
              )}

              <div className="bg-green-50 p-4 rounded-md text-left">
                <h2 className="text-lg font-semibold text-green-700 mb-2">Order Summary</h2>
                <p className="text-sm">
                  <span className="font-medium">Order ID:</span> {order.order_id}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Total Amount:</span> ₹{(order.amount / 100).toFixed(2)}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              {order.shippingAddress && (
                <div className="bg-gray-50 p-4 rounded-md text-left">
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">Shipping Address</h2>
                  <p className="text-sm">{order.shippingAddress.name}</p>
                  <p className="text-sm">{order.shippingAddress.street}</p>
                  <p className="text-sm">
                    {order.shippingAddress.city}, {order.shippingAddress.pincode}
                  </p>
                  <p className="text-sm">📞 {order.shippingAddress.phone}</p>
                  <p className="text-sm">📧 {order.shippingAddress.email}</p>
                </div>
              )}

              {products.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-md text-left">
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">Products</h2>
                  {products.map((product) => (
                    <div key={product.id} className="border-b py-2">
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-sm">Price: ₹{(product.price / 100).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        )}

        <Link
          to="/"
          className="mt-6 inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700"
        >
          <Home className="mr-2" /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccessful;
