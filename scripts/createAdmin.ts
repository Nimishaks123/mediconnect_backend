import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { AdminModel } from "../src/infrastructure/persistence/models/AdminModel";
import dotenv from "dotenv";

dotenv.config(); // load .env

(async () => {
  try {
    // 1. Connect to MongoDB
    const mongoUri = process.env.MONGO_URI!;
    if (!mongoUri) {
      throw new Error("❌ MONGO_URI is not defined in .env");
    }

    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // 2. Hash password
    const passwordHash = await bcrypt.hash("Admin@123", 10);

    // 3. Check if admin already exists
    const exists = await AdminModel.findOne({ email: "admin@mediconnect.com" });

    if (exists) {
      console.log("⚠️ Admin already exists");
      process.exit(0);
    }

    // 4. Create admin
    await AdminModel.create({
      name: "admin",
      email: "admin@mediconnect.com",
      passwordHash,
      role: "ADMIN",
    });

    console.log("🎉 Admin created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
})();
