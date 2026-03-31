const mongoose = require("mongoose");
const Food = require("./models/Food");

const MONGO_URI = "mongodb+srv://gkr0527_db_user:test123@cluster0.6i4tjwo.mongodb.net/food-donation?retryWrites=true&w=majority";

const cleanupDb = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB for Cleanup...");

    // Delete silly test entries like banana, apple, etc.
    const result = await Food.deleteMany({
      foodType: { $regex: /banana|apple/i }
    });

    console.log(`Deleted ${result.deletedCount} unwanted food items: bananas and apples.`);

  } catch (err) {
    console.log(err);
  } finally {
    mongoose.connection.close();
  }
};

cleanupDb();
