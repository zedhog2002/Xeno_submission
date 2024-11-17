const mongoose = require('mongoose');

const OrderDetailsSchema = mongoose.Schema({
    orderId: { type: String, unique: true, required: true },
    orderAmount: { type: Number, required: true },
    orderDate: { type: Date, required: true, default: Date.now }
});

const OrderSchema = mongoose.Schema({
    customerId: { type: String, unique: true, required: true },
    orders: [OrderDetailsSchema] // Array of orders
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
