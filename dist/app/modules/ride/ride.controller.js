"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
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
exports.RideController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const ride_service_1 = require("./ride.service");
const requestRide = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const riderId = req.user.userId;
    const result = yield ride_service_1.RideService.requestRide(riderId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Ride requested successfully.",
        data: result,
    });
}));
const getRiderAllRides = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const riderId = req.user.userId;
    const result = yield ride_service_1.RideService.getRiderAllRides(riderId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "All Rides retrieved successfully!",
        data: result.data,
        meta: result.meta,
    });
}));
const getRiderSingleRide = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const rideId = req.params.id;
    const verifiedToken = req.user;
    const result = yield ride_service_1.RideService.getRiderSingleRide(rideId, verifiedToken);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Ride retrieved successfully!",
        data: result,
    });
}));
const cancelRide = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const rideId = req.params.id;
    const userId = req.user.userId;
    const result = yield ride_service_1.RideService.cancelRide(rideId, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Ride cancelled",
        data: result,
    });
}));
const getAllRides = (0, catchAsync_1.default)((_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ride_service_1.RideService.getAllRides();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "All Rides retrieved successfully!",
        data: {
            rides: result.data,
            meta: result.meta,
        },
    });
}));
const getAllRidesHistory = (0, catchAsync_1.default)((_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ride_service_1.RideService.getAllRidesHistory();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "All rides history retrieved successfully!",
        data: {
            rides: result.data,
            meta: result.meta,
        },
    });
}));
const ridesAvailable = (0, catchAsync_1.default)((_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ride_service_1.RideService.ridesAvailable();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Available rides",
        data: {
            rides: result,
        },
    });
}));
const getAllCompletedRides = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.user.userId;
    const result = yield ride_service_1.RideService.getAllCompletedRides(driverId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "All completed rides retrieved successfully",
        data: {
            rides: result.data,
            meta: result.meta,
        },
    });
}));
exports.RideController = {
    requestRide,
    getRiderAllRides,
    getRiderSingleRide,
    cancelRide,
    getAllRides,
    ridesAvailable,
    getAllRidesHistory,
    getAllCompletedRides,
};
