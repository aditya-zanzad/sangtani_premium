import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Video, TrendingUp, Smartphone, Menu, X } from "lucide-react";
import demo from "../../assets/demo.mp4";

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed w-full top-0 bg-white shadow-sm z-50">
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">FashionReels</span>
          </div>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-600"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute w-full bg-white shadow-lg py-4 px-4 space-y-4">
            <Link
              to="/login"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="block px-4 py-2 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-lg font-medium"
            >
              Sign Up
            </Link>
          </div>
        )}
      </nav>

      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed w-full top-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">FashionReels</span>
          </div>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-5 py-2 text-gray-600 font-medium hover:text-blue-600 transition-all"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-lg font-medium 
                         hover:shadow-lg hover:shadow-blue-100 transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 lg:pt-32 pb-12 lg:pb-20 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Fashion Revolution Through Reels
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover, shop, and style yourself with the latest trends through immersive video experiences.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-gradient-to-br from-blue-600 to-purple-600 text-white px-6 py-3 lg:px-8 lg:py-4 
                      rounded-lg lg:rounded-xl text-base lg:text-lg font-semibold hover:shadow-lg lg:hover:shadow-xl hover:scale-105 transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            Start Shopping Now
          </Link>
          
          {/* Video Preview */}
          <div className="mt-12 lg:mt-16 relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 blur-3xl opacity-30 rounded-full" />
            <div className="relative bg-white p-1 lg:p-2 rounded-xl lg:rounded-3xl shadow-lg lg:shadow-2xl">
              <div className="aspect-video bg-gray-100 rounded-xl lg:rounded-2xl overflow-hidden">
                <video 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                  className="w-full h-full object-cover"
                  poster="https://assets.materialup.com/uploads/5d5a5803-6ff4-4716-bbf3-681efea97b8c/preview.jpg"
                >
                  <source src={demo} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
            {[
              {
                icon: <TrendingUp className="w-7 h-7 text-blue-600" />,
                title: "Trend Discovery",
                content: "Explore the latest fashion trends through curated video reels updated daily.",
                bg: "bg-blue-50"
              },
              {
                icon: <Video className="w-7 h-7 text-purple-600" />,
                title: "Immersive Shopping",
                content: "Shop directly from video content with seamless product integration.",
                bg: "bg-purple-50"
              },
              {
                icon: <Smartphone className="w-7 h-7 text-pink-600" />,
                title: "Mobile First",
                content: "Optimized for mobile viewing with swipe-friendly interface.",
                bg: "bg-pink-50"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`p-6 lg:p-8 rounded-xl lg:rounded-2xl hover:shadow-lg transition-all ${feature.bg}`}
              >
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-lg lg:rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm lg:text-base">{feature.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 lg:py-20">
        <div className="max-w-4xl mx-auto text-center px-4 lg:px-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 lg:mb-6">Ready to Join the Fashion Revolution?</h2>
          <p className="text-gray-600 mb-6 lg:mb-8">Sign up now and get early access to exclusive collections and offers.</p>
          <div className="flex flex-col lg:flex-row justify-center gap-3 lg:gap-4">
            <Link
              to="/register"
              className="px-6 py-3 lg:px-8 lg:py-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-lg lg:rounded-xl 
                        text-base lg:text-lg font-semibold hover:shadow-lg transition-all"
            >
              Get Started Free
            </Link>
            <Link
              to="/categories"
              className="px-6 py-3 lg:px-8 lg:py-4 border-2 border-gray-200 text-gray-700 rounded-lg lg:rounded-xl text-base lg:text-lg 
                        font-semibold hover:border-purple-400 hover:text-purple-600 transition-all"
            >
              Browse Collections
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
          <div className="text-center text-gray-600 text-sm lg:text-base">
            © 2024 FashionReels. All rights reserved. 
            <div className="mt-2 flex flex-col lg:flex-row justify-center gap-2 lg:gap-4">
              <a href="#" className="hover:text-blue-600">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;