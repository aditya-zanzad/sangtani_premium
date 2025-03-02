import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  const updateCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const removeFromCart = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    updateCart(updatedCart);
  };

  const increaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = (updatedCart[index].quantity || 1) + 1;
    updateCart(updatedCart);
  };

  const decreaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      updateCart(updatedCart);
    }
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0)
      .toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center">
          <ShoppingBag className="w-8 h-8 mr-3 text-emerald-600" />
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-emerald-200">
            <p className="text-gray-600 text-xl mb-6 font-medium">Your cart is empty</p>
            <Link
              to="/categories"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white text-lg font-medium rounded-lg hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-emerald-200 overflow-hidden">
            {/* Cart Header */}
            <div className="hidden sm:grid grid-cols-12 bg-emerald-50 p-4 border-b border-emerald-100">
              <div className="col-span-5 font-semibold text-gray-700">PRODUCT</div>
              <div className="col-span-2 font-semibold text-gray-700">PRICE</div>
              <div className="col-span-3 font-semibold text-gray-700">QUANTITY</div>
              <div className="col-span-2 font-semibold text-gray-700">SUBTOTAL</div>
            </div>

            {/* Cart Items */}
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-12 items-center p-4 border-b border-gray-100 hover:bg-emerald-50 transition-all duration-200"
              >
                {/* Product Info */}
                <div className="col-span-12 sm:col-span-5 flex items-center space-x-4">
                  <video
                    src={item.videoUrl}
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                    muted
                    loop
                    playsInline
                    onMouseOver={(e) => e.target.play()}
                    onMouseOut={(e) => e.target.pause()}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{item.category}</h3>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-4 sm:col-span-2 mt-3 sm:mt-0">
                  <span className="text-gray-700 font-medium">₹{(item.price || 0).toFixed(2)}</span>
                </div>

                {/* Quantity Controls */}
                <div className="col-span-6 sm:col-span-3 mt-3 sm:mt-0">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => decreaseQuantity(index)}
                      className="p-2 border border-gray-300 rounded-full hover:bg-emerald-100 hover:border-emerald-400 transition-colors"
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="px-4 py-1 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 font-medium">
                      {item.quantity || 1}
                    </span>
                    <button
                      onClick={() => increaseQuantity(index)}
                      className="p-2 border border-gray-300 rounded-full hover:bg-emerald-100 hover:border-emerald-400 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Subtotal & Remove */}
                <div className="col-span-2 sm:col-span-2 mt-3 sm:mt-0 flex items-center justify-between">
                  <span className="font-semibold text-emerald-600">
                    ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(index)}
                    className="text-red-500 hover:text-red-600 flex items-center text-sm font-medium transition-colors"
                  >
                    <Trash2 className="w-5 h-5 mr-1" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Checkout Section */}
            <div className="p-6 bg-emerald-50 border-t border-emerald-100">
              <div className="max-w-xs ml-auto space-y-6">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-700 font-medium">Total:</span>
                  <span className="font-bold text-emerald-600 text-xl">₹{calculateTotal()}</span>
                </div>
                <p className="text-sm text-emerald-600 text-right font-medium">
                  Free delivery on orders above ₹500
                </p>
                <Link
                  to="/checkout"
                  className="block w-full py-3 bg-emerald-600 text-white text-center font-semibold rounded-lg hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
                >
                  Proceed to Checkout
                </Link>
                <div className="text-center">
                  <Link
                    to="/categories"
                    className="text-emerald-600 hover:text-emerald-800 text-sm font-medium transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;