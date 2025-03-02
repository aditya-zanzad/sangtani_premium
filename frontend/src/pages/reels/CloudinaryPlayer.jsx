import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./file.css";

const CloudinaryPlayer = () => {
  const [videoData, setVideoData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [animatedDiscount, setAnimatedDiscount] = useState(0);
  const videoRefs = useRef([]);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = (queryParams.get("category") || "MEN").toUpperCase();
  const selectedSize = (queryParams.get("size") || "M").toUpperCase();

  useEffect(() => {
    const fetchVideosAndPrices = async () => {
      try {
        const response = await fetch(
          const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
          `${backend}/api/videos/data/${selectedCategory}/${selectedSize}`
        );

        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        setVideoData(data.videoData);
        console.log("Fetched Videos & Prices:", data.videoData);
      } catch (error) {
        console.error("Error fetching videos and prices:", error);
      }
    };

    fetchVideosAndPrices();
  }, [selectedCategory, selectedSize]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch((err) => console.error("Autoplay failed:", err));
            video.muted = false;
          } else {
            video.pause();
            video.muted = true;
          }
        });
      },
      { threshold: 0.5 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [videoData]);

  useEffect(() => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(existingCart.length);
  }, []);

  const handleNextReel = () => {
    if (videoData.length === 0) {
      alert(
        `No videos available for ${selectedCategory} - Size ${selectedSize}`
      );
      return;
    }
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videoData.length);
  };

  const handleAddToCart = () => {
    if (videoData.length === 0 || videoData[currentIndex].quantity === 0) return;

    const selectedVideo = {
      id: videoData[currentIndex].id,
      videoUrl: videoData[currentIndex].videoUrl,
      category: selectedCategory,
      size: selectedSize,
      price: videoData[currentIndex].price,
      quantity: videoData[currentIndex].quantity,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = [...existingCart, selectedVideo];
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    setCartCount(updatedCart.length);
    alert("Added to cart 🛒");
    console.log("Updated Cart:", updatedCart);
  };

  useEffect(() => {
    setAnimatedDiscount(0);
    let start = 0;
    const increasePercentage =
      Math.floor(Math.random() * (80 - 50 + 1)) + 50;

    const interval = setInterval(() => {
      if (start < increasePercentage) {
        start++;
        setAnimatedDiscount(start);
      } else {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="reel-container flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {videoData.length > 0 ? (
        <div className="video-wrapper relative">
          <video
            key={videoData[currentIndex].videoUrl}
            ref={(el) => {
              if (el) videoRefs.current[currentIndex] = el;
            }}
            controls
            loop
            playsInline
            autoPlay
            className="reel-video rounded-lg shadow-md w-full max-w-md"
          >
            <source src={videoData[currentIndex].videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="absolute top-3 left-3 bg-black bg-opacity-60 text-white px-4 py-2 rounded-md">
            {videoData[currentIndex]?.price !== undefined && (() => {
              const discountedPrice = videoData[currentIndex].price;
              const increasePercentage =
                Math.floor(Math.random() * (80 - 50 + 1)) + 50;
              const originalPrice = (
                discountedPrice *
                (1 + increasePercentage / 100)
              ).toFixed(2);
              const isOutOfStock = videoData[currentIndex].quantity === 0;

              return (
                <>
                  <p className="text-md font-semibold flex items-center justify-between">
                    <span>
                      {selectedCategory} | Size: {selectedSize} |
                      <span className="text-gray-400 line-through ml-2">
                        Price: ₹{originalPrice}
                      </span> | 
                    </span>
                    <Link to='/cart'>
                      <button className="ml-2 px-3 py-2 text-sm font-bold text-white bg-blue-500 rounded-sm shadow-lg hover:bg-blue-600 hover:shadow-xl transition-all transform hover:scale-110 flex items-center gap-2 relative">
                        Cart
                        {cartCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full">
                            {cartCount}
                          </span>
                        )}
                      </button>
                    </Link>
                  </p>

                  <p className="text-lg font-bold text-yellow-600">
                    Wholesale Price: ₹{discountedPrice} (<span className="text-white text-sm">
                      {animatedDiscount}% OFF</span>)
                  </p>
                  <p className={`text-sm ${isOutOfStock ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                    {isOutOfStock ? "Out of Stock" : `Available Stocks: ${videoData[currentIndex].quantity}`}
                  </p>
                </>
              );
            })()}
          </div>

          <div className="absolute bottom-3 left-0 right-0 flex justify-between w-full px-4">
            <button
              className="text-3xl text-gray-700 hover:text-gray-900 transition-transform transform hover:scale-125"
              onClick={() =>
                setCurrentIndex(
                  (prevIndex) =>
                    (prevIndex - 1 + videoData.length) % videoData.length
                )
              }
            >
              ⏮️
            </button>

            <button
              className="text-3xl text-blue-600 hover:text-indigo-800 transition-transform transform hover:scale-125"
              onClick={handleNextReel}
            >
              ⏭️
            </button>

            <button
              className={`px-3 py-1.5 text-sm font-bold text-white rounded-full shadow-lg transition-all transform hover:scale-110 flex items-center gap-2 ${
                videoData[currentIndex].quantity === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-yellow-600 hover:shadow-xl'
              }`}
              onClick={handleAddToCart}
              disabled={videoData[currentIndex].quantity === 0}
            >
              Add to Cart{" "}
              <span className="text-xl bg-black rounded-full p-2">🛒</span>
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700">
          No videos available for {selectedCategory} - Size {selectedSize}.
        </p>
      )}
    </div>
  );
};

export default CloudinaryPlayer;
