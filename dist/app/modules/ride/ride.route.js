"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const driver_controller_1 = require("../driver/driver.controller");
const user_interface_1 = require("../user/user.interface");
const ride_controller_1 = require("./ride.controller");
const ride_validation_1 = require("./ride.validation");
// const router = express.Router();
const router = (0, express_1.Router)();
router.post("/request", (0, checkAuth_1.checkAuth)(user_interface_1.Role.RIDER), (0, validateRequest_1.default)(ride_validation_1.createRideZodSchema), ride_controller_1.RideController.requestRide);
router.get("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), ride_controller_1.RideController.getAllRides);
router.get("/me", (0, checkAuth_1.checkAuth)(user_interface_1.Role.RIDER), ride_controller_1.RideController.getRiderAllRides);
router.get("/available", (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), ride_controller_1.RideController.ridesAvailable);
router.get("/completed", (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), ride_controller_1.RideController.getAllCompletedRides);
router.get("/history", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), ride_controller_1.RideController.getAllRidesHistory);
router.get("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.RIDER), ride_controller_1.RideController.getRiderSingleRide);
router.patch("/:id/cancel", (0, checkAuth_1.checkAuth)(user_interface_1.Role.RIDER), ride_controller_1.RideController.cancelRide);
router.patch("/:id/accept", (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), driver_controller_1.DriverController.acceptRide);
router.patch("/:id/reject", (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), driver_controller_1.DriverController.rejectRide);
router.patch("/:id/status", (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), driver_controller_1.DriverController.updateStatus);
exports.RideRoutes = router;
// // Only rider can use these endpoints
