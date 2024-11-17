const express = require('express');
const router = express.Router();
const Order = require("../models/order.model")
const Customer = require("../models/customers.model")

router.post("/place", async (req, res) => {
    try {
        const customerId = req.user ? req.user.customerId : req.body.customerId;
        if (!customerId) {
            return res.status(400).json({ message: "Invalid input" });
        }
        const { orderId, orderAmount } = req.body.orders;

        let order = await Order.findOne({ customerId });

        if (order) {
            const newOrder = { orderId, orderAmount };
            order.orders.push(newOrder);
            await order.save();

            await Customer.findOneAndUpdate(
                { customerId },
                { $inc: { spent: orderAmount } },
                { new: true }
            );

            return res.status(200).json({ message: "Order Added to Existing Customer", order });
        } else {
            order = new Order({
                customerId,
                orders: [{ orderId, orderAmount }]
            });

            await order.save();

            await Customer.findOneAndUpdate(
                { customerId },
                { $inc: { spent: orderAmount } },
                { new: true }
            );

            return res.status(200).json({ message: "New Order Created for Customer", order });
        }
    } catch (error) {
        res.status(500).json({ message: "Error saving order details", error });
    }
});

router.get("/get_all", async(req,res) => {
    try{
    const orders = await Order.findOne({"customerId":req.query.customerId});
    res.status(200).json({message:"Order found",orders});
    }
    catch(error){
        res.status(500).json({message:"order not found"})
    }
})

router.get("/get_one", async(req,res)=>{
    try{
        const customerId = req.query.customerId;
        const orderId = req.query.orderId;

        const order = await Order.findOne({
            "customerId" :customerId,
            "orders.orderId" : orderId
        },
        {"orders.$":1}
        
        )
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({order})
    }catch(error){
        res.status(500).json({ message: "Error retrieving order", error });
    }
})

router.put("/update_order", async (req, res) => {
    try {
        const { customerId, orderId, fieldsToUpdate } = req.body;

        const updatedOrder = await Order.findOneAndUpdate(
            { customerId, "orders.orderId": orderId },
            { $set: { "orders.$": fieldsToUpdate } },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order updated successfully", updatedOrder });
    } catch (error) {
        res.status(500).json({ message: "Error updating order", error });
    }
});

router.delete("/delete_order", async (req, res) => {
    try {
        const { customerId, orderId } = req.query;

        const orderToDelete = await Order.findOne({ customerId });
        const orderAmount = orderToDelete.orders.find(order => order.orderId === orderId)?.orderAmount;

        if (!orderAmount) {
            return res.status(404).json({ message: "Order not found" });
        }

        const updatedOrder = await Order.findOneAndUpdate(
            { customerId },
            { $pull: { orders: { orderId } } },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        await Customer.findOneAndUpdate(
            { customerId },
            { $inc: { spent: -orderAmount } },
            { new: true }
        );

        res.status(200).json({ message: "Order deleted successfully", updatedOrder });
    } catch (error) {
        res.status(500).json({ message: "Error deleting order", error });
    }
});




module.exports = router;