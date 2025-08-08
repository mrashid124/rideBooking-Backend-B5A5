import { Schema, model } from "mongoose";
import { searchGeoLocation } from "../../utils/searchGeoLocation";

import { ApprovedStatus, AvailabilityStatus } from "./driver.interface";
import { vehicleSchema } from "../vehicle/vehicle.model";

const locationSchema = new Schema(
  {
    location: { type: String },
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
  },
  { _id: false }
);

const driverSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isAvailable: {
      type: String,
      enum: Object.keys(AvailabilityStatus),
      default: AvailabilityStatus.AVAILABLE,
    },
    isApprovedStatus: {
      type: String,
      enum: Object.keys(ApprovedStatus),
      default: ApprovedStatus.PENDING,
    },
    currentLocation: {
      type: locationSchema,
    },
    vehicle: {
      type: vehicleSchema,
      default: () => ({}),
    },
  },
  { timestamps: true, versionKey: false }
);


driverSchema.pre("save", async function (next) {
  try {
    if (
      this.isModified("isApprovedStatus") &&
      this.isApprovedStatus === "APPROVED"
    ) {
      const { location, lat, lng } = await searchGeoLocation();
      this.currentLocation = { location, lat, lng };
    }

    next();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    next(error);
  }
});

export const Driver = model("Driver", driverSchema);
