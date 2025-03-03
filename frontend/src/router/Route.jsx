import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "../pages/landing/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Categories from "../pages/category/Categories";
import Size from "../pages/sizes/Size";
import Reels from "../pages/reels/CloudinaryPlayer";
import Dashboard from "../admin/Dashboard";
import Upload from "../admin/pages/Upload";
import CloudinaryPlayer from "../pages/reels/CloudinaryPlayer";
import Cart from "../pages/cart/Cart";
import Checkout from "../pages/checkout/CheckOut";
import Allusers from "../admin/pages/users/Allusers";
import Verifiedusers from "../admin/pages/users/Verifiedusers";
import ProfileDashboard from "../pages/profile.jsx/Profile";
import ForgetPassword from "../pages/auth/Forgetpassword";
import CreatePassword from "../pages/auth/CreatePassword";
import PaymentSuccessful from "../pages/checkout/Paymentsucessfull";
import OrderConfirmation from "../pages/checkout/OrderConfirmation";
import Orders from "../pages/profile.jsx/Orders";
import AllVideos from "../admin/Allvideos";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Admin Protected Route Component
const AdminRoute = ({ children }) => {
  const userRole = localStorage.getItem("userRole");
  const location = useLocation();

  if (userRole !== "admin") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <Categories />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories/:category/sizes"
        element={
          <ProtectedRoute>
            <Size />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfileDashboard />
          </ProtectedRoute>
        }
      />

      {/* Public Routes */}
      <Route path="/api/cloudinary/videos" element={<CloudinaryPlayer />} />
      <Route path="/payment_success" element={<PaymentSuccessful/>} />
      <Route path="/order-confirmation/:orderId" element={<OrderConfirmation/>} />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/dashboard/upload"
        element={
          <AdminRoute>
            <Upload />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/all-users"
        element={
          <AdminRoute>
            <Allusers />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <AdminRoute>
            <Orders/>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/verified-users"
        element={
          <AdminRoute>
            <Verifiedusers />
          </AdminRoute>
        }
      />

<Route
        path="/admin/all-videos"
        element={
          
            <AllVideos/>
          
        }
      />

      <Route path="/login/forgot-password" element={<ForgetPassword />} />
      <Route path="/reset-password" element={<CreatePassword/>} />
    </Routes>
  );
};

export default AppRoutes;
