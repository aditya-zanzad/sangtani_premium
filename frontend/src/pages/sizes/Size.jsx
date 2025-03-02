import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Ruler } from "lucide-react";

const sizes = ["S", "M", "L", "XL", "XXL", "XXXL"];

const Size = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const handleSizeSelect = (size) => {
    navigate(
      `/api/cloudinary/videos?category=${category.toUpperCase()}&size=${size.toUpperCase()}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 flex items-center gap-2 px-4 py-3 bg-white/90 backdrop-blur-md rounded-xl shadow-md hover:bg-white hover:scale-105 active:scale-95 transition-transform z-10 lg:absolute lg:top-6 lg:left-6 lg:py-2 lg:bg-white/70"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="sr-only sm:not-sr-only sm:inline">Back</span>
      </button>

      {/* Content Container */}
      <div className="w-full max-w-2xl space-y-6 lg:space-y-8">
        {/* Title Section */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            Select Size for{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {category.toUpperCase()}
            </span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Choose your perfect fit from our size options
          </p>
        </div>

        {/* Size Grid */}
        <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-4 sm:p-6 lg:rounded-3xl lg:p-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 lg:gap-6">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeSelect(size)}
                className="aspect-square flex items-center justify-center text-xl font-bold text-white bg-gradient-to-br from-blue-500 to-indigo-600 
                          rounded-xl shadow-lg hover:from-indigo-600 hover:to-blue-500 active:scale-95 
                          transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300/30 
                          sm:text-2xl lg:text-3xl lg:rounded-2xl"
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Size Guide */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 shadow-xl sm:p-6 lg:rounded-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Ruler className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
              Size Guide
            </h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm sm:gap-4 sm:text-base">
            {[
              { size: "S", chest: "34-36", waist: "28-30" },
              { size: "M", chest: "38-40", waist: "32-34" },
              { size: "L", chest: "42-44", waist: "36-38" },
              { size: "XL", chest: "46-48", waist: "40-42" },
              { size: "XXL", chest: "50-52", waist: "44-46", },
              { size: "XXXL", chest: "54-56", waist: "48-50",},
            ].map((item) => (
              <div 
                key={item.size}
                className={`space-y-1 p-3 rounded-lg bg-gray-50 ${item.fullWidth ? 'col-span-2' : ''}`}
              >
                <p className="font-medium text-blue-600">{item.size}</p>
                <p className="text-gray-600">Chest: {item.chest}"</p>
                <p className="text-gray-600">Waist: {item.waist}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Size;