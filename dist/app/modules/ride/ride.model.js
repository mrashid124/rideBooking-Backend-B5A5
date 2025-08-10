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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
const mongoose_1 = require("mongoose");
const env_1 = require("../../config/env");
const distanceByKilo_1 = require("../../utils/distanceByKilo");
const addressCoordinates_1 = require("../../utils/addressCoordinates");
const ride_interface_1 = require("./ride.interface");
const locationSchema = {
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
};
const statusHistorySchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: Object.values(ride_interface_1.RideStatus),
    },
    timestamp: Date,
}, { _id: false });
const rideSchema = new mongoose_1.Schema({
    rider: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    driver: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    pickupLocation: { type: locationSchema, required: true, _id: false },
    destinationLocation: { type: locationSchema, required: true, _id: false },
    fare: { type: Number },
    status: {
        type: String,
        enum: Object.keys(ride_interface_1.RideStatus),
        default: ride_interface_1.RideStatus.REQUESTED,
    },
    history: [statusHistorySchema],
}, {
    timestamps: true,
    versionKey: false,
});
rideSchema.pre("save", function (next) {
    if (this.isNew && (!this.history || this.history.length === 0)) {
        this.history = [
            {
                status: this.status || ride_interface_1.RideStatus.REQUESTED,
                timestamp: new Date(),
            },
        ];
    }
    next();
});
rideSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ride = this;
            if (!ride.fare &&
                ride.pickupLocation.address &&
                ride.destinationLocation.address) {
                const pickupCoords = yield (0, addressCoordinates_1.coordinatesFromAddress)(ride.pickupLocation.address);
                ride.pickupLocation.lat = pickupCoords.lat;
                ride.pickupLocation.lng = pickupCoords.lng;
                // Get destination coordinates
                const destinationCoords = yield (0, addressCoordinates_1.coordinatesFromAddress)(ride.destinationLocation.address);
                ride.destinationLocation.lat = destinationCoords.lat;
                ride.destinationLocation.lng = destinationCoords.lng;
                // Calculate distance and fare
                const distanceKm = (0, distanceByKilo_1.distanceByKilo)(pickupCoords, destinationCoords);
                const perKmRate = Number(env_1.envVars.PER_KM_RATE);
                ride.fare = Math.ceil(distanceKm * perKmRate);
            }
            next();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (error) {
            next(error);
        }
    });
});
exports.Ride = (0, mongoose_1.model)("Ride", rideSchema);
