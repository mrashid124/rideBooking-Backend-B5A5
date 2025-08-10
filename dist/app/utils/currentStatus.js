"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentStatuses = void 0;
const ride_interface_1 = require("../modules/ride/ride.interface");
exports.currentStatuses = [
    ride_interface_1.RideStatus.PICKED_UP,
    ride_interface_1.RideStatus.IN_TRANSIT,
    ride_interface_1.RideStatus.COMPLETED,
];
