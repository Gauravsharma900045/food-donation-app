const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Food = require("./models/Food");

const MONGO_URI = "mongodb+srv://gkr0527_db_user:test123@cluster0.6i4tjwo.mongodb.net/food-donation?retryWrites=true&w=majority";

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB for Seeding...");

    // Create Donors
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    // We will clear existing dummy data if necessary, or just append. Let's append to be safe.
    
    const donor1 = new User({
      name: "City Restaurant",
      email: "cityrest@example.com",
      password: hashedPassword,
      role: "donor"
    });
    const donor2 = new User({
      name: "John's Bakery",
      email: "johnbakery@example.com",
      password: hashedPassword,
      role: "donor"
    });

    await donor1.save();
    await donor2.save();

    console.log("Users Created");

    const foods = [
      { foodType: "10 Veg Thali", quantity: "10 plates", location: "Downtown Street", pickupTime: "8:00 PM", status: "available", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500", donor: donor1._id, lat: 28.6139, lng: 77.2090 },
      { foodType: "Fresh Bread Loaves", quantity: "20 pieces", location: "Main Bakery Ave", pickupTime: "9:00 PM", status: "available", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500", donor: donor2._id, lat: 28.6200, lng: 77.2100 },
      { foodType: "Leftover Party Pizza", quantity: "3 large boxes", location: "Westside Hall", pickupTime: "10:30 PM", status: "available", image: "https://images.unsplash.com/photo-1513104890d38-7c7f43343c2d?w=500", donor: donor1._id, lat: 28.5355, lng: 77.2310 },
      { foodType: "Rice and Curry", quantity: "15 portions", location: "Southern Colony", pickupTime: "7:00 PM", status: "available", image: "https://images.unsplash.com/photo-1541529086526-db283c563270?w=500", donor: donor1._id, lat: 28.5300, lng: 77.2500 },
      { foodType: "Assorted Pastries", quantity: "30 items", location: "John's Bakery", pickupTime: "9:30 PM", status: "available", image: "https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?w=500", donor: donor2._id, lat: 28.6205, lng: 77.2150 },
      { foodType: "Grilled Sandwiches", quantity: "12 boxes", location: "Office Complex", pickupTime: "6:30 PM", status: "available", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500", donor: donor1._id, lat: 28.6500, lng: 77.2300 },
      { foodType: "Packaged Salads", quantity: "8 bowls", location: "Green Cafe", pickupTime: "8:15 PM", status: "available", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500", donor: donor2._id, lat: 28.6400, lng: 77.2200 },
      { foodType: "Chicken Biryani", quantity: "20 plates", location: "Nizamuddin", pickupTime: "10:00 PM", status: "available", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500", donor: donor1._id, lat: 28.5900, lng: 77.2400 },
      { foodType: "Vegetable Soup", quantity: "5 Liters", location: "Healthy Dine", pickupTime: "9:00 PM", status: "available", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=500", donor: donor2._id, lat: 28.6100, lng: 77.2000 },
      { foodType: "Fruit Bowls", quantity: "25 cups", location: "Fresh Market", pickupTime: "7:30 PM", status: "available", image: "https://images.unsplash.com/photo-1582281295982-f54e1ab8d0af?w=500", donor: donor1._id, lat: 28.6000, lng: 77.2100 }
    ];

    await Food.insertMany(foods);
    console.log("Foods Added Successfully!");

  } catch (err) {
    console.log(err);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
