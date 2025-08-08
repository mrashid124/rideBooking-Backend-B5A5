import { Schema } from "mongoose";
import { VehicleType } from "./vehicle.interface";

export const vehicleSchema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(VehicleType),
      default: VehicleType.BIKE,
    },
    model: {
      type: String,
      default: "Unknown",
    
    },
    licensePlate: {
      type: String,
      default: "N/A",
   
    },
    color: {
      type: String,
      default: "N/A",
    },
  },
  { _id: false }
);
