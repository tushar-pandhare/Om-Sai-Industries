const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/omsai/products", require("./routes/productRoutes"));
app.use("omsai/products/routes", require("./routes/productRoutes"));
app.use("/omsai/offers", require("./routes/offerRoutes"));
app.use("/omsai/messages", require("./routes/messageRoutes"));
app.use("/omsai/admin", require("./routes/adminRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
