import mongoose from "mongoose";
import {config} from "../config";
export const connectMongoDB=async():Promise<void>=>{
    try{
        await mongoose.connect(config.mongoUri);
        console.log("mongodb connected");
    }catch(error){
        console.error("mongodb connection error",error);
        process.exit(1);
    }
}
