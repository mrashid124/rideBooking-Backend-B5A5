import { RideStatus } from "../modules/ride/ride.interface";

export const currentStatuses = [
  RideStatus.PICKED_UP,
  RideStatus.IN_TRANSIT,
  RideStatus.COMPLETED,
] as const;

export type PartialRideStatus = (typeof currentStatuses)[number];
