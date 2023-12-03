// Require the packages
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors"); // for frontend proxy
const PORT = 4000;

// Importing routes
const customerRouter = require("./routes/customers");
const restaurantRouter = require("./routes/restaurants");
const menuRouter = require("./routes/menu");
const reservationsRouter = require("./routes/reservations");
const tableRouter = require("./routes/tables");

const stripe = require("stripe")(
  "sk_test_51O9u29GxPIHOFN70seVcOy9vJ5wcMCUG8jo46CqjiVb1o50YsMhhje9OQGmaee9CjHAzmTrTmK1BEJJ77LjHMSzU000apSEKT7"
);

// Connect to MongoDB
// mongoose.connect('mongodb+srv://seatsavvy:A6otj4M@cluster0.8vmqele.mongodb.net/seatsavvy-db?retryWrites=true&w=majority');
mongoose.connect("mongodb+srv://admin:admin@cluster0.zhseqff.mongodb.net/seatsavvy?retryWrites=true&w=majority");

mongoose.connection.on("error", (error) => console.error("MongoDB connection error:", error));
mongoose.connection.once("open", () => console.log("Connected to MongoDB"));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(cors()); // for frontend proxy

// Routes
app.get("/", (req, res) => res.send("Welcome to the SeatSavvy Backend!!!"));

app.post("/payment", async (req, res) => {
  const lineItems = [
    {
      price_data: {
        currency: "CAD",
        product_data: {
          name: "Table Reservation Fee",
        },
        unit_amount: 2000,
      },
      quantity: 1,
    },
  ];
  const reservationId = req.body.reservationId;
  const restaurantId = req.body.restaurantId;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `http://localhost:3000/submission?restaurantId=${restaurantId}&reservationId=${reservationId}`,
    cancel_url: "http://localhost:3000",
  });

  res.json({ id: session.id });
});

// Use the routes
app.use("/customers", customerRouter);
app.use("/restaurants", restaurantRouter);
app.use("/menu", menuRouter);
app.use("/reservations", reservationsRouter);
app.use("/tables", tableRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
