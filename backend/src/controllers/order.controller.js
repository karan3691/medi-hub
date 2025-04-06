import { Order } from "../models/order.model.js";
import { Medicine } from "../models/medicine.model.js";
import mongoose from "mongoose";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { 
      items, 
      totalAmount, 
      shipping, 
      payment
    } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Order must contain at least one item" 
      });
    }

    if (!shipping || !shipping.address || !shipping.city || !shipping.state || !shipping.postalCode) {
      return res.status(400).json({ 
        success: false, 
        message: "Shipping address is required" 
      });
    }

    if (!payment || !payment.method) {
      return res.status(400).json({ 
        success: false, 
        message: "Payment method is required" 
      });
    }

    // Validate and update product information
    const enhancedItems = [];
    for (const item of items) {
      try {
        // Check if productId is a valid MongoDB ObjectId or a custom product ID
        let medicine;
        
        // Handle custom product IDs with the 'med_' prefix
        if (item.productId.startsWith('med_')) {
          const productNumber = item.productId.split('_')[1];
          console.log(`Handling custom medicine ID: ${item.productId}, extracting: ${productNumber}`);
          
          // Try to find by a MongoDB ID extracted from our custom ID
          if (mongoose.Types.ObjectId.isValid(productNumber)) {
            medicine = await Medicine.findById(productNumber);
          }
          
          // If not found in DB, create a dummy medicine with different properties
          // based on the product number to ensure variety
          if (!medicine) {
            // Use the number in the ID to derive different prices and names
            const idNumber = parseInt(productNumber.substring(productNumber.length - 2), 16) % 12 + 1;
            
            // Define medicine properties based on ID
            const medicineProps = {
              1: { name: 'Paracetamol 500mg Tablets', price: 99.00, discount: 5, image: '/images/medicines/paracetamol.jpg' },
              2: { name: 'Azithromycin 500mg Tablets', price: 185.00, discount: 10, image: '/images/medicines/azithromycin.jpg' },
              3: { name: 'Crocin Advance Tablets', price: 75.00, discount: 5, image: '/images/medicines/crocin.jpg' },
              4: { name: 'Vicks VapoRub', price: 145.00, discount: 10, image: '/images/medicines/vicks-vaporub.jpg' },
              5: { name: 'Dolo 650', price: 85.00, discount: 5, image: '/images/medicines/dolo.jpg' },
              6: { name: 'Band-Aid Adhesive Bandages', price: 120.00, discount: 10, image: '/images/medicines/band-aid.jpg' },
              7: { name: 'Volini Spray', price: 220.00, discount: 5, image: '/images/medicines/volini.jpg' },
              8: { name: 'Digene Tablets', price: 110.00, discount: 10, image: '/images/medicines/digene.jpg' },
              9: { name: 'Dettol Antiseptic Liquid', price: 150.00, discount: 15, image: '/images/medicines/dettol_antispectic_liquid.jpg' },
              10: { name: 'Allegra 120mg Tablets', price: 165.00, discount: 10, image: '/images/medicines/allegra-120mg-tablet-box-front-1.webp' },
              11: { name: 'Paracetamol Syrup', price: 60.00, discount: 5, image: '/images/medicines/paracetamol-syrup.jpg' },
              12: { name: 'Aspirin 75mg Tablets', price: 45.00, discount: 5, image: '/images/medicines/aspirin-tablet.jpeg' }
            };
            
            const props = medicineProps[idNumber] || medicineProps[1]; // Default to Paracetamol if no match
            
            medicine = {
              _id: new mongoose.Types.ObjectId(),
              name: props.name,
              price: props.price,
              discount: props.discount,
              stock: 100,
              image: props.image
            };
            
            console.log(`Created dummy medicine: ${medicine.name}, price: ${medicine.price}`);
          }
        } else if (!mongoose.Types.ObjectId.isValid(item.productId)) {
          // Basic ID that's not a valid ObjectId and doesn't have med_ prefix
          // Extract a number if possible or default to 1
          const idNumber = parseInt(item.productId) || 1;
          const index = (idNumber % 12) + 1;
          
          // Define medicine properties based on ID
          const medicineProps = {
            1: { name: 'Paracetamol 500mg Tablets', price: 99.00, discount: 5, image: '/images/medicines/paracetamol.jpg' },
            2: { name: 'Azithromycin 500mg Tablets', price: 185.00, discount: 10, image: '/images/medicines/azithromycin.jpg' },
            3: { name: 'Crocin Advance Tablets', price: 75.00, discount: 5, image: '/images/medicines/crocin.jpg' },
            4: { name: 'Vicks VapoRub', price: 145.00, discount: 10, image: '/images/medicines/vicks-vaporub.jpg' },
            5: { name: 'Dolo 650', price: 85.00, discount: 5, image: '/images/medicines/dolo.jpg' },
            6: { name: 'Band-Aid Adhesive Bandages', price: 120.00, discount: 10, image: '/images/medicines/band-aid.jpg' },
            7: { name: 'Volini Spray', price: 220.00, discount: 5, image: '/images/medicines/volini.jpg' },
            8: { name: 'Digene Tablets', price: 110.00, discount: 10, image: '/images/medicines/digene.jpg' },
            9: { name: 'Dettol Antiseptic Liquid', price: 150.00, discount: 15, image: '/images/medicines/dettol_antispectic_liquid.jpg' },
            10: { name: 'Allegra 120mg Tablets', price: 165.00, discount: 10, image: '/images/medicines/allegra-120mg-tablet-box-front-1.webp' },
            11: { name: 'Paracetamol Syrup', price: 60.00, discount: 5, image: '/images/medicines/paracetamol-syrup.jpg' },
            12: { name: 'Aspirin 75mg Tablets', price: 45.00, discount: 5, image: '/images/medicines/aspirin-tablet.jpeg' }
          };
          
          const props = medicineProps[index] || medicineProps[1];
          
          medicine = {
            _id: new mongoose.Types.ObjectId(),
            name: `${props.name}`,
            price: props.price,
            discount: props.discount,
            stock: 100,
            image: props.image
          };
          
          console.log(`Created medicine for ID ${item.productId}: ${medicine.name}, price: ${medicine.price}`);
        } else {
          // Find the medicine in the database to get current price and name
          medicine = await Medicine.findById(item.productId);
          if (!medicine) {
            return res.status(404).json({
              success: false,
              message: `Medicine with ID ${item.productId} not found`
            });
          }
        }

        // Check stock availability
        if (medicine.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Not enough stock for ${medicine.name}. Available: ${medicine.stock}`
          });
        }

        // Add medicine details to order item
        enhancedItems.push({
          productId: medicine._id,
          name: item.name || medicine.name, // Use the name sent from frontend if available
          quantity: item.quantity,
          price: item.price || (medicine.price - (medicine.price * medicine.discount / 100)),
          image: item.image || medicine.image // Use image sent from frontend if available
        });

        // Only update stock for real DB items
        if (mongoose.Types.ObjectId.isValid(item.productId) && !item.productId.startsWith('med_')) {
          // Update stock (reduce by quantity ordered)
          await Medicine.findByIdAndUpdate(medicine._id, {
            $inc: { stock: -item.quantity }
          });
        }
      } catch (error) {
        console.error(`Error processing item ${item.productId}:`, error);
        return res.status(400).json({
          success: false,
          message: `Error processing product ID: ${item.productId}. Details: ${error.message}`
        });
      }
    }

    // Calculate estimated delivery date (7 days from now)
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7);

    // Create the order
    const order = new Order({
      user: req.user._id, // User ID from authenticated request
      items: enhancedItems,
      totalAmount,
      shipping,
      payment,
      delivery: {
        estimatedDate: estimatedDeliveryDate
      }
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message
    });
  }
};

// Get all orders for a user
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 }); // Sort by date, newest first

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Check if the order belongs to the authenticated user (unless admin)
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this order"
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order details",
      error: error.message
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!status || !["processing", "delivered", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Allow only admins to update order status
    if (req.user.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update order status"
      });
    }

    // If cancelling an order, require a reason
    if (status === "cancelled" && !req.body.reason) {
      return res.status(400).json({
        success: false,
        message: "Cancellation reason is required"
      });
    }

    // Update the order
    const updates = { status };
    
    if (status === "cancelled") {
      updates["cancellation.reason"] = req.body.reason;
      updates["cancellation.requestDate"] = new Date();
      
      // Return items to inventory if order is cancelled
      for (const item of order.items) {
        await Medicine.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity }
        });
      }
    }
    
    if (status === "delivered") {
      updates["delivery.actualDate"] = new Date();
      updates["payment.status"] = "completed";
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: updates },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message
    });
  }
};

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access all orders"
      });
    }

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'firstName lastName email'); // Get basic user info

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch all orders",
      error: error.message
    });
  }
}; 