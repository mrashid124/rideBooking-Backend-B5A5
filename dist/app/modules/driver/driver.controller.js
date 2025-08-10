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
exports.DriverController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const driver_interface_1 = require("./driver.interface");
const driver_service_1 = require("./driver.service");
const acceptRide = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const rideId = req.params.id;
    const driverId = req.user.userId;
    const result = yield driver_service_1.DriverService.acceptRide(rideId, driverId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Ride is accepted",
        data: result,
    });
}));
const rejectRide = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const rideId = req.params.id;
    const driverId = req.user.userId;
    const result = yield driver_service_1.DriverService.rejectRide(rideId, driverId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Ride is rejected",
        data: result,
    });
}));
const updateStatus = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.user.userId;
    const rideId = req.params.id;
    const { status } = req.body;
    const result = yield driver_service_1.DriverService.updateStatus(rideId, driverId, status);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: `Ride Status: ${result.status}`,
        data: result,
    });
}));
const driverEarnings = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.user.userId;
    const result = yield driver_service_1.DriverService.driverEarnings(driverId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Driver total earnings history",
        data: {
            rides: result.rides,
            totalEarnings: result.totalEarnings,
            totalCompletedRides: result.totalCompletedRides,
        },
    });
}));
const setAvailability = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.user.userId;
    const result = yield driver_service_1.DriverService.setAvailability(driverId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: `Availability updated to ${result.isAvailable === driver_interface_1.AvailabilityStatus.AVAILABLE
            ? "Online"
            : "Offline"}`,
        data: result,
    });
}));
const getAllDrivers = (0, catchAsync_1.default)((_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield driver_service_1.DriverService.getAllDrivers();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Drivers retrieved successfully!",
        data: {
            drivers: result.data,
            meta: result.meta,
        },
    });
}));
const approveDriver = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.params.id;
    const result = yield driver_service_1.DriverService.approveDriver(driverId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Driver approval status is Success!",
        data: result,
    });
}));
const suspendDriver = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.params.id;
    const result = yield driver_service_1.DriverService.suspendDriver(driverId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Driver status is Suspended!",
        data: result,
    });
}));
const availableDriver = (0, catchAsync_1.default)((_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield driver_service_1.DriverService.availableDriver();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Available Drivers",
        data: {
            drivers: result,
        },
    });
}));
exports.DriverController = {
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
