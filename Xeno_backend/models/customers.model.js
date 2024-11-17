const mongoose = require('mongoose');

const CustomerSchema = mongoose.Schema({
    customerId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    age: {type: Number, required:true},
    email: { type: String, unique: true, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    spent: { type: Number, default: 0 },
    visits: {type: Number, default: 1},
    most_frequent: {type: String, default: "Clothes"},
    lastVisited: { type: Date, default: Date.now } 
});
//there is a __v generated that is version key, mongo keeps to check whether the data has been updated or not

const Customer = mongoose.model("Customer", CustomerSchema);
module.exports = Customer;
