import mongoose from "mongoose";
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // 5 seconds timeout for initial connection
            socketTimeoutMS: 45000, // 45 seconds timeout for queries
            maxPoolSize: 10, // Maximum number of sockets in the connection pool
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("Error in MongoDB connection:", error);
        process.exit(1);
    }
};

export default connectDB;