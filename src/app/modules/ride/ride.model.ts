import { Schema, model, Types } from 'mongoose';

export type RideStatus =
  | 'requested'
  | 'accepted'
  | 'picked_up'
  | 'in_transit'
  | 'completed'
  | 'cancelled';

export interface IRide {
  rider: Types.ObjectId;
  driver?: Types.ObjectId;
  pickupLocation: { lat: number; lng: number };
  destinationLocation: { lat: number; lng: number };
  status: RideStatus;
  timestamps: Record<string, Date>;
}

const rideSchema = new Schema<IRide>(
  {
    rider: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    driver: { type: Schema.Types.ObjectId, ref: 'User' },
    pickupLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    destinationLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: [
        'requested',
        'accepted',
        'picked_up',
        'in_transit',
        'completed',
        'cancelled',
      ],
      default: 'requested',
    },
    timestamps: { type: Map, of: Date, default: {} },
  },
  { timestamps: true }
);

export const Ride = model<IRide>('Ride', rideSchema);
