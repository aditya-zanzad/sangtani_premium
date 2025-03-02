import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  order_id: { type: String, required: true, unique: true },
  payment_id: String,
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["created", "paid", "failed"], 
    default: "created" 
  },
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  shippingAddress: {
    name: String,
    email: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  },
  products: [{
    videoUrl: String,
    price: Number,
    quantity: Number,
    category: String,
    size: String,
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", OrderSchema);
export default Order;