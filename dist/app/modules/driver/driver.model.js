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
exports.Driver = void 0;
const mongoose_1 = require("mongoose");
const searchGeoLocation_1 = require("../../utils/searchGeoLocation");
const driver_interface_1 = require("./driver.interface");
const vehicle_model_1 = require("../vehicle/vehicle.model");
const locationSchema = new mongoose_1.Schema({
    location: { type: String },
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
}, { _id: false });
const driverSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    isAvailable: {
        type: String,
        enum: Object.keys(driver_interface_1.AvailabilityStatus),
        default: driver_interface_1.AvailabilityStatus.AVAILABLE,
    },
    isApprovedStatus: {
        type: String,
        enum: Object.keys(driver_interface_1.ApprovedStatus),
        default: driver_interface_1.ApprovedStatus.PENDING,
    },
    currentLocation: {
        type: locationSchema,
    },
    vehicle: {
        type: vehicle_model_1.vehicleSchema,
        default: () => ({}),
    },
}, { timestamps: true, versionKey: false });
driverSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (this.isModified("isApprovedStatus") &&
                this.isApprovedStatus === "APPROVED") {
                const { location, lat, lng } = yield (0, searchGeoLocation_1.searchGeoLocation)();
                this.currentLocation = { location, lat, lng };
            }
            next();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (error) {
            next(error);
        }
    });
});
exports.Driver = (0, mongoose_1.model)("Driver", driverSchema);
