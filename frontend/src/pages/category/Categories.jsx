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
      <nav className="hidden lg:block bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                FashionReels
              </span>
            </Link>

            <div className="flex items-center gap-6">
              <Link to="/profile">
              <div className="flex items-center gap-2 text-gray-600 bg-blue-200 px-4 py-2 rounded-lg">
                <User className="w-5 h-5" />
                <span className="font-medium">MY ORDERS</span>
              </div></Link>

              <Link
                to="/cart"
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-2 rounded-lg text-white font-medium hover:shadow-lg transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{cartItemCount}</span>
              </Link>

              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 rounded-lg text-white font-medium hover:shadow-lg transition-all"
                >
                  <Settings className="w-5 h-5" />
                  Admin
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 px-4 py-2 rounded-lg text-white font-medium hover:shadow-lg transition-all"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold text-indigo-600">
              FashionReels
            </Link>
            
            <div className="flex items-center gap-4">
              <Link
                to="/cart"
                className="relative p-2 bg-indigo-50 rounded-full"
              >
                <ShoppingCart className="w-6 h-6 text-indigo-600" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 text-gray-600"
                aria-label="Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {showMobileMenu && (
          <div className="absolute w-full bg-white shadow-lg py-4 px-4 space-y-4">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-5 h-5" />
              <span className="font-medium truncate">{userName}</span>
            </div>
            
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-2 text-gray-600 p-2 hover:bg-gray-50 rounded-lg"
              >
                <Settings className="w-5 h-5" />
                Admin Panel
              </Link>
            )}
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 text-red-600 p-2 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="pt-16 lg:pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Web Heading */}
        <div className="hidden lg:block text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Discover Your Style
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our curated collections and find the perfect look for every occasion
          </p>
        </div>

        {/* Mobile Heading */}
        <h1 className="lg:hidden text-3xl font-bold text-gray-800 mb-6 text-center">
          Shop by Category
        </h1>

        {/* Category Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/categories/${category.name.toLowerCase()}/sizes`}
              className="group relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-md lg:shadow-xl hover:shadow-lg lg:hover:shadow-2xl transition-all duration-300"
            >
              <div className="aspect-square">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className={`absolute inset-0 bg-gradient-to-b ${category.color} opacity-70 lg:opacity-0 lg:group-hover:opacity-90 transition-opacity duration-300 flex items-center justify-center`}>
                <div className="text-center text-white opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
                  <h2 className="text-2xl lg:text-3xl font-bold mb-2">{category.name}</h2>
                  <p className="text-lg hidden lg:block">Explore Collection →</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="flex justify-around items-center h-16">
            <Link to="/" className="text-gray-600 p-2">
              Home
            </Link>
            <Link to="/cart" className="text-gray-600 p-2 relative">
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button className="text-gray-600 p-2">
              <User className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Web Footer */}
        <footer className="hidden lg:block mt-16 border-t border-gray-200 pt-8 text-center">
          <p className="text-gray-600">
            © 2024 FashionReels. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Categories;