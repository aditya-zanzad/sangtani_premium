import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Video from "../models/video.js";
import dotenv from "dotenv";
import axios from "axios";
import nodemailer from "nodemailer";
import Razorpay from "razorpay";
import Order from "../models/userorder.js"; // ✅ Use require for CommonJS
import mongoose from "mongoose";



// Load environment variables from .env file
dotenv.config();

const router = express.Router();
router.use(cors());

const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is set in your .env file

// ✅ Middleware to protect routes
const authenticate = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.userId; // Attach user ID to the request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

// ✅ Login User (Optimized)
router.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Optimized query with lean() and indexed email field
    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.verified){
      return res.status(400).json({ message: "User not verified" });
    }

    // Parallelize password validation and token generation
    const [isPasswordValid, token] = await Promise.all([
      bcrypt.compare(password, user.password),
      jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" })
    ]);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.status(200).json({ token, role: user.role , userId: user._id });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Register User (Optimized)
router.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Optimized existence check with lean()
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Parallelize password hashing and user creation prep
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ 
      name, 
      email, 
      password: hashedPassword 
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update User
router.put("/api/auth/users/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    // Ensure user can only update their own account
    if (req.user !== id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Find user and update
    const updatedData = {};
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete User
router.delete("/api/auth/users/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure user can only delete their own account
    if (req.user !== id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Protected Route Example (Only Accessible with Valid JWT)
router.get("/api/protected", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user); // Get user from the decoded token
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Protected route accessed", user });
  } catch (error) {
    console.error("Error accessing protected route:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/api/cloudinary/videos/:category/:size", async (req, res) => {
  const { category, size } = req.params; // Extract category & size from URL


  const cloudName = process.env.REACT_APP_CLOUD_NAME;
const apiKey = process.env.REACT_APP_CLOUDINARY_API_KEY;
const apiSecret = process.env.REACT_APP_CLOUDINARY_API_SECRET;

  const baseURL = `https://api.cloudinary.com/v1_1/${cloudName}/resources/video/upload`;

  try {
    const response = await axios.get(baseURL, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`,
      },
      params: {
        max_results: 50, // Fetch more results
        tags: true, // Ensure tags are included in the response
      },
    });

    // Filter videos based on Category first, then Size
    const filteredVideos = response.data.resources.filter(video => 
      video.tags && video.tags.includes(category) && video.tags.includes(size)
    );

    const videoUrls = filteredVideos.map(video => 
      `https://res.cloudinary.com/${cloudName}/video/upload/${video.public_id}.${video.format}`
    );

    res.json(videoUrls);
  } catch (error) {
    console.error("Error fetching videos from Cloudinary:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch videos from Cloudinary" });
  }
});

router.post("/api/videos/upload", async (req, res) => {
  try {
    const { videoUrl, category, size, price, quantity } = req.body;

    // 🔹 Validation
    if (!videoUrl || !category || !size || !price || !quantity) {
      return res.status(400).json({ error: "All fields required" });
    }

    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    // 🔹 Update operation
    const result = await Video.findOneAndUpdate(
      { videoUrl, category, size, price },
      {
        $inc: { quantity: parsedQuantity }, // ✅ Correctly increments quantity
        $setOnInsert: {
          videoUrl,
          category,
          size,
          price,
          createdAt: new Date(),
        },
        $set: { updatedAt: new Date() },
      },
      {
        new: true,
        upsert: true, // ✅ Creates new entry if not found
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(201).json({
      message: result.createdAt?.getTime() === result.updatedAt?.getTime() 
        ? "New product added" 
        : "Stock updated",
      video: result
    });

  } catch (error) {
    console.error("Error:", error);
    const statusCode = error.code === 11000 ? 409 : 500;
    res.status(statusCode).json({
      error: error.code === 11000 
        ? "Duplicate product" 
        : "Server error"
    });
  }
});




router.get("/api/videos/data/:category/:size", async (req, res) => {
  try {
    const { category, size } = req.params;

    const videos = await Video.find({ category, size });

    if (!videos || videos.length === 0) {
      return res.status(404).json({ error: "No videos found for the given category and size" });
    }

    const videoData = videos.map(video => ({
      id: video._id,
      videoUrl: video.videoUrl,
      price: video.price,
      quantity: video.quantity
    }));

    res.json({ videoData });
  } catch (error) {
    console.error("Error fetching videos and price:", error);
    res.status(500).json({ error: "Server Error!" });
  }
});

 /// fetch all users

 router.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// verified user
router.get("/api/auth/verified-users", async (req, res) => {
  try {
    const verifiedUsers = await User.find({ verified: true }); // Fetch only verified users

    if (!verifiedUsers.length) {
      return res.status(404).json({ message: "No verified users found" });
    }

    res.json({ success: true, users: verifiedUsers });
  } catch (error) {
    console.error("Error fetching verified users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id/verify", async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;

    // Find user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update verification status
    user.verified = verified;
    await user.save();

    res.json({ message: "User verification status updated", user });
  } catch (error) {
    console.error("Error updating verification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const FRONTEND_URL = process.env.FRONTEND_URL;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Forgot Password Route
router.post("/api/auth/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
        const link = `${FRONTEND_URL}/reset-password?token=${token}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS
            }
        });

        const mailOptions = {
            from: EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            text: `Click on the link to reset your password: ${link}`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "Password reset link sent to email" });
    } catch (error) {
        console.error("Error sending password reset email:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Reset Password Route
router.post("/reset-password", async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Password has been reset successfully" });
    } catch (error) {
        res.status(500).json({ message: "Invalid or expired token" });
    }
});

// DELETE /api/videos/:videoId
router.delete("/api/videos/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;

    // Validate videoId
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ success: false, message: "Invalid video ID" });
    }

    // Find and delete the video
    const deletedVideo = await Video.findByIdAndDelete(videoId);
    if (!deletedVideo) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }

    // Optional: Delete associated file from storage (e.g., AWS S3)
    // await deleteFileFromStorage(deletedVideo.videoUrl);

    res.status(200).json({ 
      success: true, 
      message: "Video deleted successfully", 
      data: { videoId: deletedVideo._id }
    });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error while deleting video",
      error: error.message 
    });
  }
});

// GET /api/videos/all
router.get("/api/videos/all", async (req, res) => {
  try {
    // Fetch all videos with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Video.countDocuments();

    if (!videos || videos.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No videos found" 
      });
    }

    const videoData = videos.map(video => ({
      id: video._id,
      videoUrl: video.videoUrl,
      category: video.category,
      size: video.size,
      price: video.price,
      createdAt: video.createdAt,
      quantity: video.quantity
    }));

    res.status(200).json({
      success: true,
      data: videoData,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error while fetching videos",
      error: error.message 
    });
  }
});

// payment routes
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/*router.post("/api/payment/create-order", async (req, res) => {
  try {
    console.log("📩 Incoming Request Body:", req.body);

    const { amount, user_id } = req.body;

    // ✅ Validate user_id
    if (!user_id || !mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ message: "Invalid or missing user_id" });
    }

    // ✅ Validate amount
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: amount, // Already in paise
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
    };

    console.log("🛒 Creating Razorpay order with:", options);

    const order = await razorpay.orders.create(options);
    if (!order) {
      return res.status(500).json({ message: "Order creation failed" });
    }

    console.log("✅ Razorpay Order Created:", order);
    

    // ✅ Save order to MongoDB with valid user_id
    try {
      const newOrder = new Order({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        user_id: new mongoose.Types.ObjectId(user_id),
        products: products
      });
  
      await newOrder.save();
      console.log("✅ Order saved in database:", newOrder);
    } catch (dbError) {
      console.error("❌ Database Error:", dbError);
      return res.status(500).json({ message: "Database error", error: dbError.message });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error("❌ Razorpay API Error:", error);
    return res.status(500).json({ message: "Payment failed", error: error.message });
  }
});

router.post("/api/payment/confirm", async (req, res) => {
  try {
    const { order_id, payment_id } = req.body;

    const updatedOrder = await Order.findOneAndUpdate(
      { order_id },
      { 
        $set: { 
          status: 'paid',
          payment_id,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// fetch the order from the database by the user_id

router.get("/api/orders/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    // Validate user_id
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Fetch all orders for the given user_id
    const orders = await Order.find({ user_id });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    return res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});*/

router.post("/api/payment/create-order", async (req, res) => {
  try {
    const { amount, user_id, products, shippingAddress } = req.body;

    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Check product availability
    for (const product of products) {
      const video = await Video.findOne({
        category: product.category,
        size: product.size,
        price: product.price,
      });
      if (!video || video.quantity < 1) {
        return res.status(400).json({ message: `Product out of stock: ${product.category} ${product.size}` });
      }
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

    const newOrder = await Order.create({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      user_id: new mongoose.Types.ObjectId(user_id),
      products,
      status: "created",
      shippingAddress,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Order creation failed" });
  }
});

// Confirm Payment
router.post("/api/payment/confirm", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { order_id, payment_id } = req.body;

    // 1. Find and validate the order
    const order = await Order.findOne({ order_id }).session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Order not found" });
    }

    // 2. Check if already processed
    if (order.status === "paid") {
      await session.abortTransaction();
      session.endSession();
      return res.status(200).json({ success: true, order });
    }

    // 3. Update order status atomically
    const updatedOrder = await Order.findOneAndUpdate(
      { order_id, status: { $ne: "paid" } }, // Prevent race condition
      { 
        $set: { 
          payment_id,
          status: "paid",
          updatedAt: new Date(),
        }
      },
      { new: true, session }
    );

    if (!updatedOrder) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ message: "Order status changed concurrently" });
    }

    // 4. Prepare atomic inventory updates
    const bulkOps = updatedOrder.products.map(product => {
      const quantity = Math.max(1, Number(product.quantity) || 1);
      
      return {
        updateOne: {
          filter: {
            category: product.category,
            size: product.size,
            price: product.price,
            quantity: { $gte: quantity } // Atomic stock check
          },
          update: {
            $inc: { quantity: -quantity }, // Atomic decrement
            $set: { updatedAt: new Date() }
          }
        }
      };
    });

    // 5. Execute atomic inventory updates
    const bulkResult = await Video.bulkWrite(bulkOps, { session });
    
    // 6. Verify all inventory updates succeeded
    if (bulkResult.modifiedCount !== updatedOrder.products.length) {
      const failedUpdates = updatedOrder.products.length - bulkResult.modifiedCount;
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({
        message: `${failedUpdates} item(s) out of stock or not found`,
        code: "INSUFFICIENT_STOCK"
      });
    }

    // 7. Final commit
    await session.commitTransaction();
    session.endSession();

    res.json({ 
      success: true, 
      order: updatedOrder.toObject(),
      inventoryUpdate: {
        matched: bulkResult.matchedCount,
        modified: bulkResult.modifiedCount
      }
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Payment confirmation error:", error);
    res.status(500).json({ 
      message: "Payment processing failed",
      code: "SERVER_ERROR",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});



router.get("/api/orders/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // ✅ Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // 🔍 Fetch orders from the database
    const orders = await Order.find({ user_id: userId }).sort({ createdAt: -1 }); // Sort by latest orders

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    return res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

router.get("/api/orders/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ order_id: orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Server error while fetching order" });
  }
});

// fetch al users ordera

router.get('/api/users/orders', async (req, res) => {
  try {
    // Optional: Add authentication/authorization middleware here to restrict to admins
    const orders = await Order.find().sort({ createdAt: -1 }); // Sort by latest first

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
});

// fetch all the videos


export default router;



