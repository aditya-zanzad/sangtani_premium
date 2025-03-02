import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Search, Video, Loader2 } from 'lucide-react';

const demoVideo = {
  id: 'demo',
  videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  category: 'Demo',
  size: 'Unknown',
  price: 0,
  quantity: 1,
  createdAt: new Date()
};

const AllVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/videos/all`, {
        params: { page, limit: 10 }
      });

      const fetchedVideos = response.data.data || [];
      setVideos(fetchedVideos.length > 0 ? fetchedVideos : [demoVideo]);
      if (fetchedVideos.length === 0) {
        setError('No videos found. Showing demo video.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch videos');
      setVideos([demoVideo]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [page]);

  const handleDeleteVideo = async (videoId) => {
    if (videoId === 'demo') {
      alert("Demo video can't be deleted.");
      return;
    }
    if (!window.confirm('Are you sure you want to delete this video?')) return;

    try {
      await axios.delete(`${backendUrl}/api/videos/${videoId}`);
      setVideos(prev => prev.filter(video => video.id !== videoId));
      alert('Video deleted successfully!');
    } catch (err) {
      alert('Failed to delete video: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredVideos = videos.filter(video =>
    [video.videoUrl, video.category, video.size, String(video.price), String(video.quantity)]
      .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-100 via-blue-100 to-indigo-100">
        <Loader2 className="w-14 h-14 text-purple-600 animate-spin" />
        <span className="ml-4 text-2xl text-gray-800 font-medium animate-pulse">Loading videos...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-100 via-blue-100 to-indigo-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-4xl font-extrabold text-gray-900 flex items-center gap-4">
            <Video className="w-10 h-10 text-purple-600 animate-pulse" />
            <span>All Videos</span>
            <span className="text-purple-600 bg-purple-100 px-3 py-1 rounded-full text-lg">
              {videos.length}
            </span>
          </h2>
          <div className="relative w-full md:w-96 mt-4 md:mt-0">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={22} />
            <input
              type="text"
              placeholder="Search by URL, category, size, price, or quantity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm transition-all duration-300"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-800 rounded-xl shadow-md flex items-center gap-3 animate-slideIn">
            <span className="text-xl">⚠️</span> {error}
          </div>
        )}

        {/* Videos Grid */}
        {filteredVideos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg animate-fadeIn">
            <p className="text-gray-700 text-2xl font-semibold">No videos found 🔍</p>
            <p className="text-gray-500 mt-2 text-lg">Try adjusting your search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {filteredVideos.map(video => (
              <div
                key={video.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden transform hover:scale-105 hover:shadow-xl transition-all duration-300"
              >
                <video controls className="w-full h-56 object-cover rounded-t-2xl">
                  <source src={video.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 truncate">{video.category}</h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-700">
                    <p><span className="font-medium text-gray-900">Size:</span> {video.size}</p>
                    <p><span className="font-medium text-gray-900">Price:</span> ₹{video.price.toFixed(2)}</p>
                    <p><span className="font-medium text-gray-900">Quantity:</span> {video.quantity}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteVideo(video.id)}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 hover:text-red-800 transition-colors duration-200"
                  >
                    <Trash2 size={20} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {videos.length > 0 && videos[0].id !== 'demo' && (
          <div className="mt-10 flex justify-center gap-6">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-6 py-2 bg-purple-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-all duration-300 shadow-md"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(prev => prev + 1)}
              className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300 shadow-md"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Custom CSS for Animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in;
        }
      `}</style>
    </div>
  );
};

export default AllVideos;