"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRideZodSchema = void 0;
const zod_1 = require("zod");
exports.createRideZodSchema = zod_1.z.object({
    pickupLocation: zod_1.z.object({
        lat: zod_1.z.number(),
        lng: zod_1.z.number(),
        address: zod_1.z.string().min(3, "Pickup address is required, it's must be string"),
    }),
    destinationLocation: zod_1.z.object({
        lat: zod_1.z.number(),
        lng: zod_1.z.number(),
        address: zod_1.z.string().min(3, "Destination address is required, it's must be string"),
    }),
});
