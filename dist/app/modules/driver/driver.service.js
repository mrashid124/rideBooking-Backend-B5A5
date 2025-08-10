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
exports.DriverService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = require("mongoose");
const ride_interface_1 = require("../ride/ride.interface");
const ride_model_1 = require("../ride/ride.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const driver_interface_1 = require("./driver.interface");
const driver_model_1 = require("./driver.model");
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const currentStatus_1 = require("../../utils/currentStatus");
const acceptRide = (rideId, driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride)
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found");
    if (ride) {
        if (ride.status !== ride_interface_1.RideStatus.REQUESTED) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Ride already accepted or Not available");
        }
    }
    const driver = yield driver_model_1.Driver.findOne({ user: driverId });
    if ((driver === null || driver === void 0 ? void 0 : driver.isApprovedStatus) === driver_interface_1.ApprovedStatus.APPROVED &&
        driver.isAvailable === driver_interface_1.AvailabilityStatus.AVAILABLE) {
        ride.status = ride_interface_1.RideStatus.ACCEPTED;
        ride.driver = new mongoose_1.Types.ObjectId(driverId);
        ride.history.push({
            status: ride_interface_1.RideStatus.ACCEPTED,
            timestamp: new Date(),
        });
        driver.isAvailable = driver_interface_1.AvailabilityStatus.UN_AVAILABLE;
        yield driver.save();
        yield ride.save();
        return ride;
    }
    throw new appError_1.default(http_status_codes_1.default.NOT_ACCEPTABLE, (driver === null || driver === void 0 ? void 0 : driver.isApprovedStatus) !== driver_interface_1.ApprovedStatus.APPROVED
        ? `Your status is ${driver === null || driver === void 0 ? void 0 : driver.isApprovedStatus}`
        : "You are not available to accept the ride");
});
const rejectRide = (rideId, driverId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride)
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found");
    if (ride) {
        if (ride.status !== ride_interface_1.RideStatus.REQUESTED) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "'Ride cannot be rejected'");
        }
    }
    const user = yield user_model_1.User.findById(driverId);
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (user.isActive === user_interface_1.ActiveStatus.BLOCKED)
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Your are temporary Blocked, Please contact admin");
    const driver = yield driver_model_1.Driver.findOne({ user: driverId });
    if ((driver === null || driver === void 0 ? void 0 : driver.isApprovedStatus) !== driver_interface_1.ApprovedStatus.APPROVED) {
        throw new appError_1.default(http_status_codes_1.default.NOT_ACCEPTABLE, `You are not able to REJECT a Ride, you are ${driver === null || driver === void 0 ? void 0 : driver.isApprovedStatus} driver`);
    }
    const now = new Date();
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
    ride.status = ride_interface_1.RideStatus.REJECTED;
    ride.history.push({
        status: ride_interface_1.RideStatus.REJECTED,
        timestamp: new Date(),
    });
    driver.isAvailable = driver_interface_1.AvailabilityStatus.AVAILABLE;
    yield driver.save();
    yield ride.save();
    return ride;
});
const updateStatus = (rideId, driverId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const driverObjId = new mongoose_1.Types.ObjectId(driverId);
    const ride = yield ride_model_1.Ride.findOne({ _id: rideId, driver: driverObjId });
    const driver = yield driver_model_1.Driver.findOne({ user: driverId });
    if (!ride)
        throw new Error("Ride not found or Not assigned to you");
    if (!currentStatus_1.currentStatuses.includes(status)) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid status update");
    }
    const currentStatus = ride.status;
    const validTransitions = {
        [ride_interface_1.RideStatus.ACCEPTED]: ride_interface_1.RideStatus.PICKED_UP,
        [ride_interface_1.RideStatus.PICKED_UP]: ride_interface_1.RideStatus.IN_TRANSIT,
        [ride_interface_1.RideStatus.IN_TRANSIT]: ride_interface_1.RideStatus.COMPLETED,
    };
    if (validTransitions[currentStatus] !== status) {
        throw new Error(`You can't change status from ${currentStatus} to ${status}`);
    }
    ride.status = status;
    const now = new Date();
    if (status === ride_interface_1.RideStatus.PICKED_UP) {
        ride.history.push({ status: ride_interface_1.RideStatus.PICKED_UP, timestamp: now });
        if (driver) {
            driver.isAvailable = driver_interface_1.AvailabilityStatus.UN_AVAILABLE;
            yield driver.save();
        }
    }
    if (status === ride_interface_1.RideStatus.IN_TRANSIT) {
        ride.history.push({ status: ride_interface_1.RideStatus.IN_TRANSIT, timestamp: now });
        if (driver) {
            driver.isAvailable = driver_interface_1.AvailabilityStatus.UN_AVAILABLE;
            yield driver.save();
        }
    }
    if (status === ride_interface_1.RideStatus.COMPLETED) {
        ride.history.push({ status: ride_interface_1.RideStatus.COMPLETED, timestamp: now });
        if (driver) {
            driver.isAvailable = driver_interface_1.AvailabilityStatus.AVAILABLE;
            yield driver.save();
        }
    }
    yield ride.save();
    return ride;
});
const driverEarnings = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const rides = yield ride_model_1.Ride.find({
        driver: driverId,
        status: ride_interface_1.RideStatus.COMPLETED,
    });
    if (!rides) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found for this driver");
    }
    const totalEarnings = rides.reduce((sum, ride) => sum + (ride.fare || 0), 0);
    return {
        rides,
        totalCompletedRides: rides.length,
        totalEarnings,
    };
});
const setAvailability = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findOne({ user: driverId });
    if (!driver)
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found");
    driver.isAvailable = driver_interface_1.AvailabilityStatus.AVAILABLE;
    yield driver.save();
    return driver;
});
const getAllDrivers = () => __awaiter(void 0, void 0, void 0, function* () {
    const drivers = yield user_model_1.User.find({ role: user_interface_1.Role.DRIVER });
    const totalDrivers = yield user_model_1.User.countDocuments({ role: user_interface_1.Role.DRIVER });
    return {
        data: drivers,
        meta: {
            total: totalDrivers,
        },
    };
});
const approveDriver = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findOne({ user: driverId });
    if (!driver) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found");
    }
    if (driver.isApprovedStatus === driver_interface_1.ApprovedStatus.APPROVED) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, `Driver is already ${driver.isApprovedStatus}`);
    }
    driver.isApprovedStatus = driver_interface_1.ApprovedStatus.APPROVED;
    yield driver.save();
    return driver;
});
const suspendDriver = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findOne({ user: driverId });
    if (!driver) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found");
    }
    if (driver.isApprovedStatus === driver_interface_1.ApprovedStatus.SUSPENDED) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, `Driver is already ${driver.isApprovedStatus}`);
    }
    driver.isApprovedStatus = driver_interface_1.ApprovedStatus.SUSPENDED;
    yield driver.save();
    return driver;
});
const availableDriver = () => __awaiter(void 0, void 0, void 0, function* () {
    const drivers = yield driver_model_1.Driver.find({
        isApprovedStatus: driver_interface_1.ApprovedStatus.APPROVED,
        isAvailable: driver_interface_1.AvailabilityStatus.AVAILABLE,
    });
    if (drivers.length < 1)
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "No Drivers Available now, Please try again later");
    return drivers;
});
exports.DriverService = {
    acceptRide,
    rejectRide,
    updateStatus,
    driverEarnings,
    setAvailability,
    getAllDrivers,
    approveDriver,
    suspendDriver,
    availableDriver,
};
