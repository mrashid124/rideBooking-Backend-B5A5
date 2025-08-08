import { z } from "zod";

export const createRideZodSchema = z.object({
  pickupLocation: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().min(3, "Pickup address is required, it's must be string"),
  }),
  destinationLocation: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().min(3, "Destination address is required, it's must be string"),
  }),
});
