import mongoose from "mongoose";
import { DoctorScheduleModel } from "./src/infrastructure/persistence/models/DoctorScheduleModel.ts";

async function main() {
  await mongoose.connect("mongodb://localhost:27017/mediconnect");
  const schedules = await DoctorScheduleModel.find({});
  console.dir(schedules.map(s => s.toObject()), { depth: null });
  process.exit(0);
}
main();
