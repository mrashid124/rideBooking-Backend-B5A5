/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { RideService } from "./ride.service";

const requestRide = catchAsync(async (req: Request, res: Response) => {
  const riderId = req.user.userId;
  const result = await RideService.requestRide(riderId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Ride requested successfully.",
    data: result,
  });
});

const getRiderAllRides = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const riderId = req.user.userId;

    const result = await RideService.getRiderAllRides(riderId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Rides retrieved successfully!",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getRiderSingleRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params.id;

    const verifiedToken = req.user;

    const result = await RideService.getRiderSingleRide(
      rideId,
      verifiedToken as JwtPayload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Ride retrieved successfully!",
      data: result,
    });
  }
);

const cancelRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params.id;
    const userId = req.user.userId;
    const result = await RideService.cancelRide(rideId, userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Ride cancelled",
      data: result,
    });
  }
);

const getAllRides = catchAsync(
  async (_req: Request, res: Response, next: NextFunction) => {
    const result = await RideService.getAllRides();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Rides retrieved successfully!",
      data: {
        rides: result.data,
        meta: result.meta,
      },
    });
  }
);

const getAllRidesHistory = catchAsync(
  async (_req: Request, res: Response, next: NextFunction) => {
    const result = await RideService.getAllRidesHistory();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All rides history retrieved successfully!",
      data: {
        rides: result.data,
        meta: result.meta,
      },
    });
  }
);

const ridesAvailable = catchAsync(
  async (_req: Request, res: Response, next: NextFunction) => {
    const result = await RideService.ridesAvailable();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Available rides",
      data: {
        rides: result,
      },
    });
  }
);

const getAllCompletedRides = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const driverId = req.user.userId;
    const result = await RideService.getAllCompletedRides(driverId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All completed rides retrieved successfully",
      data: {
        rides: result.data,
        meta: result.meta,
      },
    });
  }
);

export const RideController = {
  requestRide,
  getRiderAllRides,
  getRiderSingleRide,
  cancelRide,
  getAllRides,
  ridesAvailable,
  getAllRidesHistory,
  getAllCompletedRides,
};

