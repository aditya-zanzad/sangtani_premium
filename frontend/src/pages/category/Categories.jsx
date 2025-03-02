import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Settings, LogOut, User, Menu } from "lucide-react";
import men from "../../assets/man.png";
import women from "../../assets/women.png";
import kids from "../../assets/kids.png";

const categories = [
  { name: "Men", image: men, color: "from-blue-500 to-blue-600" },
  { name: "Women", image: women, color: "from-pink-500 to-rose-600" },
  { name: "Kids", image: kids, color: "from-green-500 to-emerald-600" },
];

const Categories = () => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("userRole") === "admin";
  const [cartItemCount, setCartItemCount] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const userName = localStorage.getItem("userName") || "User";

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItemCount(cart.length);

    const handleStorageChange = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItemCount(cart.length);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Web Navigation */}
      <nav className="hidden md:block bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                FashionReels
              </span>
            </Link>

            <div className="flex items-center gap-4 md:gap-6">
              <Link
                to="/profile"
                className="flex items-center gap-2 text-gray-600 bg-blue-200 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-sm md:text-base"
              >
                <User className="w-4 h-4 md:w-5 md:h-5" />
                <span className="font-medium">My Orders</span>
              </Link>

              <Link
                to="/cart"
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-white font-medium hover:shadow-lg transition-all text-sm md:text-base"
              >
                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                <span>{cartItemCount}</span>
              </Link>

              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-white font-medium hover:shadow-lg transition-all text-sm md:text-base"
                >
                  <Settings className="w-4 h-4 md:w-5 md:h-5" />
                  Admin
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-white font-medium hover:shadow-lg transition-all text-sm md:text-base"
              >
                <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-indigo-600">
            FashionReels
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              className="relative p-2 bg-indigo-50 rounded-full"
            >
              <ShoppingCart className="w-5 h-5 text-indigo-600" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-600"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {showMobileMenu && (
          <div className="absolute w-full bg-white shadow-lg py-4 px-4 space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4" />
              <span className="font-medium text-sm truncate">{userName}</span>
            </div>

            <Link
              to="/profile"
              className="flex items-center gap-2 text-gray-600 p-2 hover:bg-gray-50 rounded-lg text-sm"
            >
              <User className="w-4 h-4" />
              My Orders
            </Link>

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-2 text-gray-600 p-2 hover:bg-gray-50 rounded-lg text-sm"
              >
                <Settings className="w-4 h-4" />
                Admin Panel
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 text-red-600 p-2 hover:bg-red-50 rounded-lg text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="pt-16 md:pt-20 pb-20 md:pb-8 px-4 sm:px-6 md:px-8">
        {/* Web Heading */}
        <div className="hidden md:block text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 md:mb-4">
            Discover Your Style
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-xl md:max-w-2xl mx-auto">
            Explore our curated collections and find the perfect look for every occasion
          </p>
        </div>

        {/* Mobile Heading */}
        <h1 className="md:hidden text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
          Shop by Category
        </h1>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/categories/${category.name.toLowerCase()}/sizes`}
              className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-lg md:rounded-3xl md:shadow-xl md:hover:shadow-2xl transition-all duration-300"
            >
              <div className="aspect-square">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div
                className={`absolute inset-0 bg-gradient-to-b ${category.color} opacity-70 md:opacity-0 md:group-hover:opacity-90 transition-opacity duration-300 flex items-center justify-center`}
              >
                <div className="text-center text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-1 md:mb-2">
                    {category.name}
                  </h2>
                  <p className="text-base md:text-lg hidden md:block">
                    Explore Collection →
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="flex justify-around items-center h-14">
            <Link to="/" className="text-gray-600 p-2 text-sm">
              Home
            </Link>
            <Link to="/cart" className="text-gray-600 p-2 relative">
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <Link to="/profile" className="text-gray-600 p-2">
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Web Footer */}
        <footer className="hidden md:block mt-12 md:mt-16 border-t border-gray-200 pt-6 md:pt-8 text-center">
          <p className="text-gray-600 text-sm md:text-base">
            © 2024 FashionReels. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Categories;
