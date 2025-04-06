import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["processing", "delivered", "cancelled"],
    default: "processing"
  },
  shipping: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: "India"
    }
  },
  payment: {
    method: {
      type: String,
      required: true,
      enum: ["Credit Card", "Cash on Delivery", "UPI", "Net Banking"]
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending"
    },
    transactionId: {
      type: String
    }
  },
  delivery: {
    estimatedDate: {
      type: Date
    },
    actualDate: {
      type: Date
    }
  },
  tracking: {
    code: {
      type: String
    },
    url: {
      type: String
    }
  },
  cancellation: {
    reason: {
      type: String
    },
    requestDate: {
      type: Date
    }
  },
  notes: {
    type: String
  }
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema); 