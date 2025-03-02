import React, { useEffect, useState } from "react";
import { Vortex } from "react-loader-spinner";
import { UserCheck, Search } from "lucide-react";

const VerifiedUsers = () => {
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchVerifiedUsers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/verified-users`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch users");
        }

        setVerifiedUsers(data.users);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVerifiedUsers();
  }, []);

  const filteredUsers = verifiedUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <h2 className="text-4xl font-extrabold text-gray-800 flex items-center space-x-3">
            <UserCheck className="w-10 h-10 text-blue-600 animate-bounce" />
            <span>Verified Users</span>
            <span className="text-blue-600 text-2xl">({verifiedUsers.length})</span>
          </h2>
          <div className="relative w-full md:w-72 mt-4 md:mt-0">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search verified users..."
              className="w-full pl-10 pr-4 py-3 bg-white rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-300"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Vortex
              visible={true}
              height="100"
              width="100"
              ariaLabel="vortex-loading"
              wrapperStyle={{}}
              wrapperClass="vortex-wrapper"
              colors={['#3b82f6', '#60a5fa', '#93c5fd', '#3b82f6', '#60a5fa', '#93c5fd']}
            />
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 text-red-700 rounded-xl border border-red-200 shadow-lg text-center">
            <span className="text-2xl">⚠️</span> {error}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <p className="text-gray-500 text-xl font-medium">No verified users found 🔍</p>
            <p className="text-gray-400 mt-2">Try adjusting your search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 border-t-4 border-blue-500"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={user.profilePic || "https://via.placeholder.com/150"}
                    alt={user.name}
                    className="w-16 h-16 rounded-full border-2 border-blue-200 object-cover shadow-sm animate-pulse-slow"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800 text-xl flex items-center">
                          {user.name}
                          <span className="ml-2 text-green-500 animate-pulse">✓</span>
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 font-medium">{user.email}</p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                        {user.role || "User"}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center text-gray-700">
                        <svg
                          className="w-5 h-5 mr-2 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-gray-700">
                        <svg
                          className="w-5 h-5 mr-2 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {user.verifiedAt
                          ? new Date(user.verifiedAt).toLocaleDateString()
                          : "Verified"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifiedUsers;