import mongoose from "mongoose";
import { IVehicle } from "./vehicle.interface";
import AppError from "../../errorHelpers/appError";
// import { HttpStatusCode } from "axios";
import httpStatus from "http-status-codes";
import { Driver } from "../driver/driver.model";


const updateVehicleDetails = async (
  driverId: string,
  vehicleDetails: Partial<IVehicle>
) => {
  const driverObjectId = new mongoose.Types.ObjectId(driverId);
  const driverInfo = await Driver.findOne({ user: driverObjectId });

//   if (!driverInfo) {
//     throw new AppError(HttpStatusCode.NOT_FOUND, "Driver Not Found");
//   }

      if (!driverInfo) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver Not Found");
  }

  const updatedVehicle = await Driver.findOneAndUpdate(
    { user: driverObjectId },

    { $set: { vehicle: vehicleDetails } },

    { new: true, runValidators: true }
  );
  console.log(updatedVehicle);
  return updatedVehicle;
};

export const VehicleService = { updateVehicleDetails };