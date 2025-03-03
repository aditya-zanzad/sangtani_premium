import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CreditCard, Truck, ShieldCheck, ArrowLeft, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";


const loadRazorpay = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    pincode: "",
    city: "",
    phone: "",
    paymentMethod: "Online Payment",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  const calculateSubtotal = () => parseFloat(cartItems
    .reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0))
    .toFixed(2);

  const calculateTax = () => (calculateSubtotal() * 0.02).toFixed(2);
  const calculateTotal = () => (parseFloat(calculateSubtotal()) + parseFloat(calculateTax())).toFixed(2);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Full Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.pincode?.match(/^\d{6}$/)) newErrors.pincode = "Valid 6-digit Pincode required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.phone?.match(/^\d{10}$/)) newErrors.phone = "Valid 10-digit Phone required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const navigate = useNavigate();

  const handlePayment = async () => {
    if (!validateForm()) {
      alert("Please fix form errors before proceeding");
      return;
    }

    try {
      if (!await loadRazorpay("https://checkout.razorpay.com/v1/checkout.js")) {
        alert("Failed to load payment gateway");
        return;
      }

      const backend = import.meta.env.VITE_BACKEND_URL;
      const userId = localStorage.getItem("userId");
      
      if (!userId) {
        alert("Please login to continue");
        return;
      }

      const { data } = await axios.post(`${backend}/api/payment/create-order`, {
        amount: calculateTotal() * 100,
        user_id: userId,
        products: cartItems.map(item => ({
          videoUrl: item.videoUrl,
          price: item.price,
          quantity: item.quantity,
          category: item.category,
          size: item.size,
        })),
        shippingAddress: {
          name: formData.name,
          email: formData.email,
          street: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          phone: formData.phone
        }
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.amount,
        currency: data.currency,
        name: "Video Store",
        description: "Video Purchase",
        order_id: data.id,
        handler: async (response) => {
          try {
            await axios.post(`${backend}/api/payment/confirm`, {
              order_id: data.id,
              payment_id: response.razorpay_payment_id
            });
            localStorage.removeItem("cart");
            window.location.href = `/order-confirmation/${data.id}`;
          } catch (error) {
            console.error("Confirmation failed:", error);
            alert("Payment succeeded but confirmation failed. Contact support.");
          }
        },
        prefill: formData,
        theme: { color: "#10b981" },
        modal: { ondismiss: () => alert("Payment cancelled") }
      };

      new window.Razorpay(options).open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/cart" className="flex items-center text-emerald-600 hover:text-emerald-800">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Cart
          </Link>
        </div>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center">
          <Package className="w-8 h-8 mr-3 text-emerald-600" />
          Checkout
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-emerald-200">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Truck className="w-7 h-7 mr-3 text-emerald-600" />
                Delivery Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(formData).map(([key, value]) => (
                  key !== "paymentMethod" && (
                    <div key={key} className={key === "address" ? "md:col-span-2" : ""}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {key.charAt(0).toUpperCase() + key.slice(1)} *
                      </label>
                      {key === "address" ? (
                        <textarea
                          name={key}
                          value={value}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                          rows="4"
                          required
                        />
                      ) : (
                        <input
                          type={key === "email" ? "email" : "text"}
                          name={key}
                          value={value}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      )}
                      {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
                    </div>
                  )
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-emerald-200 mt-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <CreditCard className="w-7 h-7 mr-3 text-emerald-600" />
                Payment Method
              </h2>
              <div className="space-y-4">
                <label className="flex items-center p-4 border border-emerald-500 bg-emerald-50 rounded-lg">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Online Payment"
                    checked
                    className="h-4 w-4 text-emerald-600"
                  />
                  <span className="ml-3 text-sm font-medium">Online Payment</span>
                </label>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-emerald-200 sticky top-6">
              <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-start border-b pb-4">
                    <span className="text-gray-700">
                      {item.category} ({item.size})<br />
                      <small className="text-gray-500">Qty: {item.quantity || 1}</small>
                    </span>
                    <span className="ml-auto font-medium">
                      ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>₹{calculateSubtotal()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (2%):</span>
                  <span>₹{calculateTax()}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-4">
                  <span>Total:</span>
                  <span className="text-emerald-600">₹{calculateTotal()}</span>
                </div>

                <div className="flex items-center text-sm text-emerald-600">
                  <ShieldCheck className="w-5 h-5 mr-2" />
                  Secure SSL Encryption
                </div>

                <button
                  onClick={handlePayment}
                  className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-md"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
