const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const customerRoutes = require('./routes/customer.routes');
const orderRoutes = require('./routes/order.routes');
const audienceGroupRoutes = require('./routes/audienceGroup.routes');
const campaignRoutes = require("./routes/campaign.routes");
const messageLogsRoutes = require("./routes/messageLogs.routes");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://zedhog2002:lIHL2v67erJNo0j7@xeno.wblrd.mongodb.net/?retryWrites=true&w=majority&appName=Xeno')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.use('/customers', customerRoutes);
app.use('/orders', orderRoutes);
app.use('/audienceGroup', audienceGroupRoutes);
app.use("/campaigns", campaignRoutes);
app.use("/messageLogs", messageLogsRoutes);

const port = 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
