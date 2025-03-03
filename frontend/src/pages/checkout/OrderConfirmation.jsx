import React from "react";
import { CheckCircle, Home, Package } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const OrderConfirmation = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paymentId = queryParams.get("payment_id");
  const orderId = queryParams.get("order_id");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full transform transition-all hover:scale-105">
        {/* Success Icon */}
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto animate-pulse" />

        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-gray-800 mt-6 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 text-lg">Thank you for your purchase. Your order is confirmed!</p>

        {/* Order Summary Card */}
        {(paymentId || orderId) && (
          <div className="mt-8 bg-green-50 p-6 rounded-lg shadow-inner text-left">
            <h2 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
              <Package className="mr-2" /> Order Summary
            </h2>
            {orderId && (
              <p className="text-sm text-gray-700">
                <span className="font-medium">Order ID:</span> {orderId}
              </p>
            )}
            {paymentId && (
              <p className="text-sm text-gray-700">
                <span className="font-medium">Payment ID:</span> {paymentId}
              </p>
            )}
          </div>
        )}

        {/* Message if no query params */}
        {!paymentId && !orderId && (
          <p className="mt-6 text-gray-500">No order details provided.</p>
        )}

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/profile"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            <Package className="mr-2" /> My Orders
          </Link>
          <Link
            to="/categories"
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-all shadow-md hover:shadow-lg"
          >
            <Home className="mr-2" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
