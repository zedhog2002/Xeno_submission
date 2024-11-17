const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const Customer = require("../models/customers.model");

router.post("/reg", async (req, res) => {
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const { email, phone } = req.body;

    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (phone.length !== 10) {
      return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
    }
    const customerId = uuidv4();
    const customer = new Customer({ ...req.body, customerId });

    await customer.save();
    res.status(201).json({ message: "Customer created successfully", customer });
  } catch (error) {
    res.status(400).json({ message: "Error creating customer", error });
  }
});

router.get("/get_all", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error getting customer data", error });
  }
});

router.post("/get_query", async (req, res) => {
  try {
    const { age, address, spent, visits, most_frequent } = req.body;

    let query = {};
    if (age) query.age = age;
    if (address) query.address = { $regex: address, $options: "i" };
    if (spent) query.spent = spent;
    if (visits) query.visits = visits;
    if (most_frequent) query.most_frequent = { $regex: most_frequent, $options: "i" };

    const customers = await Customer.find(query);
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error getting customer data", error });
  }
});

router.get("/get_distinct_values", async (req, res) => {
  try {
    const distinctValues = await Customer.aggregate([
      {
        $group: {
          _id: null,
          distinctAges: { $addToSet: "$age" },
          distinctAddresses: { $addToSet: "$address" },
          distinctSpent: { $addToSet: "$spent" },
          distinctVisits: { $addToSet: "$visits" },
        },
      },
    ]);

    if (distinctValues.length > 0) {
      const { distinctAges, distinctAddresses, distinctSpent, distinctVisits } =
        distinctValues[0];
      res.status(200).json({ distinctAges, distinctAddresses, distinctSpent, distinctVisits });
    } else {
      res.status(200).json({
        distinctAges: [],
        distinctAddresses: [],
        distinctSpent: [],
        distinctVisits: [],
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching distinct values", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({ customerId: req.params.id });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting customer", error });
  }
});

module.exports = router;
