"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = __importDefault(require("mongoose"));
const AdminModel_1 = require("../src/infrastructure/persistence/models/AdminModel");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // load .env
(async () => {
    try {
        // 1. Connect to MongoDB
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("❌ MONGO_URI is not defined in .env");
        }
        await mongoose_1.default.connect(mongoUri);
        console.log("✅ Connected to MongoDB");
        // 2. Hash password
        const passwordHash = await bcryptjs_1.default.hash("Admin@123", 10);
        // 3. Check if admin already exists
        const exists = await AdminModel_1.AdminModel.findOne({ email: "admin@mediconnect.com" });
        if (exists) {
            console.log("⚠️ Admin already exists");
            process.exit(0);
        }
        // 4. Create admin
        await AdminModel_1.AdminModel.create({
            name: "admin",
            email: "admin@mediconnect.com",
            passwordHash,
            role: "ADMIN",
        });
        console.log("🎉 Admin created successfully!");
        process.exit(0);
    }
    catch (err) {
        console.error("❌ Error creating admin:", err);
        process.exit(1);
    }
})();
