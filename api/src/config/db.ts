import mongoose from "mongoose";
import { syncProductsToES } from "../services/search.service";

const connectDB = async () => {
  try {
    const mongoUri =
      "mongodb://mongo:mongo@localhost:27017/default?authSource=admin";
    const conn = await mongoose.connect(mongoUri);
    console.log(`Database: ${conn.connection.db?.databaseName || "Unknown"}`);

    // Sync ES
    syncProductsToES();
    
  } catch (error) {
    console.log("Connection failed", error);
    process.exit(1);
  }
};

export default connectDB;
