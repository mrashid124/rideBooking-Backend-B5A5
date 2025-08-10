"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleSchema = void 0;
const mongoose_1 = require("mongoose");
const vehicle_interface_1 = require("./vehicle.interface");
exports.vehicleSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: Object.values(vehicle_interface_1.VehicleType),
        default: vehicle_interface_1.VehicleType.BIKE,
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
}, { _id: false });
