
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/appError";
import { coordinatesFromAddress } from "../../utils/addressCoordinates";
import { ActiveStatus, Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { IRide, RideStatus } from "./ride.interface";
import { Ride } from "./ride.model";


const requestRide = async (riderId: string, payload: IRide) => {
  const pickupAddress = payload.pickupLocation.address;
  const destinationAddress = payload.destinationLocation.address;
  const pickupCoords = await coordinatesFromAddress(pickupAddress);
  const destinationCoords = await coordinatesFromAddress(destinationAddress);
  const newRiderData = {
    rider: riderId,
    pickupLocation: {
      address: pickupAddress,
      lat: pickupCoords?.lat,
      lng: pickupCoords?.lng,
    },
    destinationLocation: {
      address: destinationAddress,
      lat: destinationCoords?.lat,
      lng: destinationCoords?.lng,
    },
  };
  const ride = await Ride.create(newRiderData);
  return ride;
};

const getRiderAllRides = async (riderId: string) => {
  const rides = await Ride.find({ rider: riderId });
  const totalRides = await Ride.countDocuments({ rider: riderId });
  return {
    data: rides,
    meta: {
      total: totalRides,
    },
  };
};

const getRiderSingleRide = async (rideId: string, decodedToken: JwtPayload) => {
  const riderId = decodedToken.userId;
  const ride = await Ride.findOne({ _id: rideId, rider: riderId });

  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found!");
  }

  const isSelf = riderId === ride.rider.toString();

  if (!isSelf) {
    if (decodedToken.role === Role.RIDER || decodedToken.role === Role.DRIVER) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized."
      );
    }
  }

  return ride;
};

const cancelRide = async (rideId: string, userId: string) => {
  const ride = await Ride.findOne({ _id: rideId, rider: userId });
  if (!ride) throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
  if (ride) {
    if (ride.status !== RideStatus.REQUESTED) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `You can not cancel this ride, ride status: ${ride.status}`
      );
    }
  }

  const user = await User.findById(userId);
  if (!user) throw new AppError(httpStatus.BAD_REQUEST, "User not found");
  if (user.isActive === ActiveStatus.BLOCKED)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your are temporary blocked for unnecessary attempts."
    );

 
  const requestedAt = ride.history.find(
    (entry) => entry.status === RideStatus.REQUESTED
  );

  if (!requestedAt?.timestamp) throw new Error("Requested time missing");

  const now = new Date();
  const diffMs = now.getTime() - requestedAt?.timestamp.getTime();
  const diffMinutes = diffMs / (1000 * 60);

  const CANCEL_WINDOW = Number(envVars.CANCEL_WINDOW_TIME) || 2;

  if (diffMinutes > CANCEL_WINDOW) {
    throw new Error(
      `You can cancel only within ${CANCEL_WINDOW} minutes of requesting`
    );
  }

  const today = now.toDateString();
  const lastCancel = user.lastCancelDate?.toDateString();
 
  if (lastCancel !== today) {
    user.cancelAttempts = 1;
    user.lastCancelDate = now;
  } else {
    if (user.cancelAttempts) {
      user.cancelAttempts += 1;
    }
  }

 
  if (user.cancelAttempts && user.cancelAttempts > 3) {
    user.isActive = ActiveStatus.BLOCKED;
  }
  await user.save();
  ride.status = RideStatus.CANCELLED;
  ride.history.push({
    status: RideStatus.CANCELLED,
    timestamp: new Date(),
  });
  await ride.save();
  return ride;
};

const getAllRides = async () => {
  const rides = await Ride.find({});
  const totalRides = await Ride.countDocuments();
  return {
    data: rides,
    meta: {
      total: totalRides,
    },
  };
};

const getAllRidesHistory = async () => {
  const rides = await Ride.find()
    .select("Rider driver status fare history")
    .populate("rider", "name email phone")
    .populate("driver", "name email phone");
  const totalRides = await Ride.countDocuments();
  return {
    data: rides,
    meta: {
      total: totalRides,
    },
  };
};

const ridesAvailable = async () => {
  const rides = await Ride.find({ status: RideStatus.REQUESTED });

  if (rides.length < 1) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride is not available.");
  }

  return rides;
};

const getAllCompletedRides = async (driverId: string) => {
  const rides = await Ride.find({
    driver: driverId,
    status: RideStatus.COMPLETED,
  });
  const totalRides = await Ride.countDocuments({
    driver: driverId,
    status: RideStatus.COMPLETED,
  });

  if (rides.length < 1) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Ride is not found."
    );
  }

  return {
    data: rides,
    meta: {
      total: totalRides,
    },
  };
};

export const RideService = {
  requestRide,
  getRiderAllRides,
  getRiderSingleRide,
  cancelRide,
  getAllRides,
  ridesAvailable,
  getAllRidesHistory,
  getAllCompletedRides,
};

