const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URI = "mongodb://localhost:27017/couponsDB";
const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB Connection Error:", err));
  
  const ClaimedSchema = new mongoose.Schema({
    ip: String,
    timestamp: Number
  });
  // // Mock Database
  const coupons = ["COUPON1", "COUPON2", "COUPON3"];
  let index = 0;
  let claimedIPs = new Map();
  let claimedCookies = new Map();
  
  const Claimed = mongoose.model("Claimed", ClaimedSchema);
  
  async function checkAbuse(req, res, next) {
    const ip = req.ip;
    const ONE_HOUR = 5 * 60 * 1000; // 5 minutes
  
    // Check if IP already claimed
    const existingClaim = await Claimed.findOne({ ip });
    if (existingClaim && Date.now() - existingClaim.timestamp < ONE_HOUR) {
      return res.status(429).json({ message: "Wait before claiming again." });
    }
  
    next();
  }
  
  app.post("/claim-coupon", checkAbuse, async (req, res) => {
    if (index >= coupons.length) index = 0;
    const coupon = coupons[index++];
  
    // Store IP in the database
    await Claimed.create({ ip: req.ip, timestamp: Date.now() });
  
    res.json({ coupon });
  });
  
  app.get("/claim-coupon",(req, res)=>{
    console.log(res)
    res.send('Backend is working super fine')
  })


// const ONE_HOUR = 60 * 5 * 1000;
// const guestClaims = {};

// // Middleware to check abuse prevention
// function checkAbuse(req, res, next) {
//   const ip = req.ip;
//   const cookie = req.cookies.claimed;

//   if (claimedIPs.has(ip) && Date.now() - claimedIPs.get(ip) < ONE_HOUR) {
//     return res.status(429).json({ message: "Wait before claiming again." });
//   }

//   if (cookie && claimedCookies.has(cookie)) {
//     return res.status(429).json({ message: "You've already claimed a coupon." });
//   }
  
//   next();
// }


// app.post("/claim-coupon", checkAbuse, (req, res) => {
//   if (index >= coupons.length) index = 0;
//   const coupon = coupons[index++];

//   // Store IP & Cookie
//   claimedIPs.set(req.ip, Date.now());
//   const cookieValue = Math.random().toString(36).substring(2);
//   claimedCookies.set(cookieValue, true);

//   res.cookie("claimed", cookieValue, { maxAge: ONE_HOUR, httpOnly: true });
//   res.json({ coupon });
//   console.log("this function is working fine")

// });

app.listen(5000, () => console.log("Server running on port 5000"));
