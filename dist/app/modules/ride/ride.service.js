"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../../config/env");
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const addressCoordinates_1 = require("../../utils/addressCoordinates");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const ride_interface_1 = require("./ride.interface");
const ride_model_1 = require("./ride.model");
const requestRide = (riderId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const pickupAddress = payload.pickupLocation.address;
    const destinationAddress = payload.destinationLocation.address;
    const pickupCoords = yield (0, addressCoordinates_1.coordinatesFromAddress)(pickupAddress);
    const destinationCoords = yield (0, addressCoordinates_1.coordinatesFromAddress)(destinationAddress);
    const newRiderData = {
        rider: riderId,
        pickupLocation: {
            address: pickupAddress,
            lat: pickupCoords === null || pickupCoords === void 0 ? void 0 : pickupCoords.lat,
            lng: pickupCoords === null || pickupCoords === void 0 ? void 0 : pickupCoords.lng,
        },
        destinationLocation: {
            address: destinationAddress,
            lat: destinationCoords === null || destinationCoords === void 0 ? void 0 : destinationCoords.lat,
            lng: destinationCoords === null || destinationCoords === void 0 ? void 0 : destinationCoords.lng,
        },
    };
    const ride = yield ride_model_1.Ride.create(newRiderData);
    return ride;
});
const getRiderAllRides = (riderId) => __awaiter(void 0, void 0, void 0, function* () {
    const rides = yield ride_model_1.Ride.find({ rider: riderId });
    const totalRides = yield ride_model_1.Ride.countDocuments({ rider: riderId });
    return {
        data: rides,
        meta: {
            total: totalRides,
        },
    };
});
const getRiderSingleRide = (rideId, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const riderId = decodedToken.userId;
    const ride = yield ride_model_1.Ride.findOne({ _id: rideId, rider: riderId });
    if (!ride) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found!");
    }
    const isSelf = riderId === ride.rider.toString();
    if (!isSelf) {
        if (decodedToken.role === user_interface_1.Role.RIDER || decodedToken.role === user_interface_1.Role.DRIVER) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized.");
        }
    }
    return ride;
});
const cancelRide = (rideId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const ride = yield ride_model_1.Ride.findOne({ _id: rideId, rider: userId });
    if (!ride)
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found");
    if (ride) {
        if (ride.status !== ride_interface_1.RideStatus.REQUESTED) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, `You can not cancel this ride, ride status: ${ride.status}`);
        }
    }
    const user = yield user_model_1.User.findById(userId);
    if (!user)
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User not found");
    if (user.isActive === user_interface_1.ActiveStatus.BLOCKED)
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Your are temporary blocked for unnecessary attempts.");
    const requestedAt = ride.history.find((entry) => entry.status === ride_interface_1.RideStatus.REQUESTED);
    if (!(requestedAt === null || requestedAt === void 0 ? void 0 : requestedAt.timestamp))
        throw new Error("Requested time missing");
    const now = new Date();
    const diffMs = now.getTime() - (requestedAt === null || requestedAt === void 0 ? void 0 : requestedAt.timestamp.getTime());
    const diffMinutes = diffMs / (1000 * 60);
    const CANCEL_WINDOW = Number(env_1.envVars.CANCEL_WINDOW_TIME) || 2;
    if (diffMinutes > CANCEL_WINDOW) {
        throw new Error(`You can cancel only within ${CANCEL_WINDOW} minutes of requesting`);
    }
    const today = now.toDateString();
    const lastCancel = (_a = user.lastCancelDate) === null || _a === void 0 ? void 0 : _a.toDateString();
    if (lastCancel !== today) {
        user.cancelAttempts = 1;
        user.lastCancelDate = now;
    }
    else {
        if (user.cancelAttempts) {
            user.cancelAttempts += 1;
        }
    }
    if (user.cancelAttempts && user.cancelAttempts > 3) {
        user.isActive = user_interface_1.ActiveStatus.BLOCKED;
    }
    yield user.save();
    ride.status = ride_interface_1.RideStatus.CANCELLED;
    ride.history.push({
        status: ride_interface_1.RideStatus.CANCELLED,
        timestamp: new Date(),
    });
    yield ride.save();
    return ride;
});
const getAllRides = () => __awaiter(void 0, void 0, void 0, function* () {
    const rides = yield ride_model_1.Ride.find({});
    const totalRides = yield ride_model_1.Ride.countDocuments();
    return {
        data: rides,
        meta: {
            total: totalRides,
        },
    };
});
const getAllRidesHistory = () => __awaiter(void 0, void 0, void 0, function* () {
    const rides = yield ride_model_1.Ride.find()
        .select("Rider driver status fare history")
        .populate("rider", "name email phone")
        .populate("driver", "name email phone");
    const totalRides = yield ride_model_1.Ride.countDocuments();
    return {
        data: rides,
        meta: {
            total: totalRides,
        },
    };
});
const ridesAvailable = () => __awaiter(void 0, void 0, void 0, function* () {
    const rides = yield ride_model_1.Ride.find({ status: ride_interface_1.RideStatus.REQUESTED });
    if (rides.length < 1) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride is not available.");
    }
    return rides;
});
const getAllCompletedRides = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const rides = yield ride_model_1.Ride.find({
        driver: driverId,
        status: ride_interface_1.RideStatus.COMPLETED,
    });
    const totalRides = yield ride_model_1.Ride.countDocuments({
        driver: driverId,
        status: ride_interface_1.RideStatus.COMPLETED,
    });
    if (rides.length < 1) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride is not found.");
    }
    return {
        data: rides,
        meta: {
            total: totalRides,
        },
    };
});
exports.RideService = {
    requestRide,
    getRiderAllRides,
    getRiderSingleRide,
    cancelRide,
    getAllRides,
    ridesAvailable,
    getAllRidesHistory,
    getAllCompletedRides,
};
