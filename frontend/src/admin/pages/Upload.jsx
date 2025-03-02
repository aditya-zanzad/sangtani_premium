import React, { useState, useEffect, useRef } from "react";
import { UploadCloud, Shirt, Tag, IndianRupee, CheckCircle, Film, Loader, Package } from "lucide-react";

const CloudinaryUpload = () => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [selectedSize, setSelectedSize] = useState("S");
  const [selectedCategory, setSelectedCategory] = useState("MEN");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [widgetReady, setWidgetReady] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const widgetRef = useRef(null);

  useEffect(() => {
    const scriptId = "cloudinary-script";

    const initializeWidget = () => {
      if (!widgetRef.current) {
        widgetRef.current = window.cloudinary.createUploadWidget(
          {
            cloudName: "dcewyknnq",
            uploadPreset: "sangtani",
            resourceType: "video",
            multiple: false,
            tags: [selectedSize, selectedCategory],
          },
          (error, result) => {
            if (result?.event === "success") {
              setVideoUrl(result.info.secure_url);
              setIsUploading(false);
            }
            if (result?.event === "upload-added") {
              setIsUploading(true);
            }
          }
        );
        setWidgetReady(true);
      }
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
      script.async = true;
      script.onload = initializeWidget;
      document.body.appendChild(script);
    } else {
      initializeWidget();
    }

    return () => {
      if (widgetRef.current) {
        widgetRef.current.destroy();
        widgetRef.current = null;
      }
    };
  }, [selectedSize, selectedCategory]);

  const openWidget = () => {
    widgetRef.current?.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoUrl || !price || !quantity) {
      alert("Please complete all fields: upload video, set price, and enter quantity");
      return;
    }

    const parsedQuantity = Number(quantity); // ✅ Ensure quantity is a number
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      alert("Quantity must be at least 1");
      return;
    }

    try {
      console.log(videoUrl, selectedCategory, selectedSize, price, parsedQuantity);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/videos/upload`, {
        
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl,
          category: selectedCategory,
          size: selectedSize,
          price: parseFloat(price),
          quantity: parsedQuantity,  // ✅ Ensure it is a number
        }),
        
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }
      
      alert("Product uploaded successfully 🎉");
      setVideoUrl(null);
      setPrice("");
      setQuantity(""); // ✅ Reset correctly
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.message || "Error uploading product. Please try again.");
    }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Product Upload Portal
          </h1>
          <p className="text-gray-600 mt-2">Manage your fashion inventory with ease</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Size Selection */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-medium">
                <Shirt className="w-5 h-5 text-blue-500" />
                Clothing Size
              </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              >
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                  <option key={size} value={size}>
                    {size} - {{
                      S: "Small",
                      M: "Medium",
                      L: "Large",
                      XL: "Extra Large",
                      XXL: "Double XL"
                    }[size]}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-medium">
                <Tag className="w-5 h-5 text-purple-500" />
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                required
              >
                {["MEN", "WOMEN", "KIDS"].map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price and Quantity Inputs */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-medium">
                <IndianRupee className="w-5 h-5 text-green-500" />
                Price
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                placeholder="Enter price in INR"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-medium">
                <Package className="w-5 h-5 text-orange-500" />
                Stock Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="Available quantity"
                min="1"
                required
              />
            </div>
          </div>

          {/* Upload Section */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={openWidget}
              disabled={!widgetReady || isUploading}
              className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2
                ${widgetReady 
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl" 
                  : "bg-gray-300 cursor-not-allowed"}
                ${isUploading ? "opacity-75 cursor-wait" : ""}`}
            >
              {isUploading ? (
                <>
                  <Loader className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadCloud className="w-5 h-5" />
                  {widgetReady ? "Select Product Video" : "Initializing..."}
                </>
              )}
            </button>

            {videoUrl && (
              <div className="mt-4 p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Film className="w-6 h-6 text-blue-500" />
                  <h3 className="font-medium text-gray-700">Product Preview</h3>
                </div>
                <video 
                  className="w-full rounded-lg shadow-sm" 
                  controls
                  poster="https://via.placeholder.com/800x450?text=Product+Video+Preview"
                >
                  <source src={videoUrl} type="video/mp4" />
                </video>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Category</p>
                    <p className="font-medium">{selectedCategory}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Size</p>
                    <p className="font-medium">{selectedSize}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Price</p>
                    <p className="font-medium">₹{parseFloat(price).toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Available Stock</p>
                    <p className="font-medium">{quantity} units</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!videoUrl || !price || !quantity}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold
                      shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Publish Product
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Supported video formats: MP4, MOV, AVI | Max file size: 500MB
        </p>
      </div>
    </div>
  );
};

export default CloudinaryUpload;