const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const cartRoutes = require("./routes/cartRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Corrected routes - removed duplicate product route
app.use("/omsai/products/routes", require("./routes/productRoutes"))
app.use("/omsai/products", require("./routes/productRoutes"));
app.use("/omsai/offers", require("./routes/offerRoutes"));
app.use("/omsai/messages", require("./routes/messageRoutes"));
app.use("/omsai/auth", require("./routes/loginRegister")); // Combined login/register
app.use("/omsai/cart", cartRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));