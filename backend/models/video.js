import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    videoUrl: { 
      type: String, 
      required: [true, "Video URL is required"]
      // Removed `unique: true` to prevent conflicts with compound index
    },
    category: { 
      type: String, 
      required: true,
      enum: {
        values: ["MEN", "WOMEN", "KIDS"],
        message: "Invalid category"
      }
    },
    size: { 
      type: String, 
      required: true,
      enum: {
        values: ["S", "M", "L", "XL", "XXL"],
        message: "Invalid size"
      }
    },
    price: { 
      type: Number, 
      required: true,
      min: [0.01, "Price must be greater than 0"]
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be an integer"
      }
    }
  }, 
  { timestamps: true }
);

// ✅ Unique index for product variations (without conflicting `unique: true` on `videoUrl`)
videoSchema.index(
  { videoUrl: 1, category: 1, size: 1, price: 1 }, 
  { 
    name: "product_variant_index",
    unique: true, 
    partialFilterExpression: { 
      videoUrl: { $exists: true },
      category: { $exists: true },
      size: { $exists: true },
      price: { $exists: true }
    }
  }
);

// 🔹 Static method for category-based searches
videoSchema.statics.findByCategory = function(category) {
  return this.find({ category });
};

// 🔹 Transform output before sending response
videoSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    ret.id = doc._id;
    delete ret._id;
    ret.price = parseFloat(ret.price.toFixed(2)); // ✅ Ensures price always has 2 decimal places
  }
});

export default mongoose.model("Video", videoSchema);
