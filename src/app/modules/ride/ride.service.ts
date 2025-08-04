import { Ride } from './ride.model';
import { Types } from 'mongoose';

export const RideService = {
  requestRide: async (
    riderId: Types.ObjectId,
    pickup: { lat: number; lng: number },
    destination: { lat: number; lng: number }
  ) => {
    const existingActiveRide = await Ride.findOne({
      rider: riderId,
      status: { $in: ['requested', 'accepted', 'picked_up', 'in_transit'] },
    });
    if (existingActiveRide) throw new Error('You already have an active ride.');

    const newRide = await Ride.create({
      rider: riderId,
      pickupLocation: pickup,
      destinationLocation: destination,
      timestamps: { requested: new Date() },
    });

    return newRide;
  },

  cancelRide: async (riderId: Types.ObjectId, rideId: string) => {
    const ride = await Ride.findById(rideId);
    if (!ride) throw new Error('Ride not found');
    if (!ride.rider.equals(riderId)) throw new Error('Unauthorized');
    if (ride.status !== 'requested') throw new Error('Cannot cancel after driver accepts');

    ride.status = 'cancelled';
    // ride.timestamps.set('cancelled', new Date());
    ride.timestamps['cancelled'] = new Date();
    await ride.save();

    return ride;
  },

  getRiderHistory: async (riderId: Types.ObjectId) => {
    return Ride.find({ rider: riderId }).sort({ createdAt: -1 });
  },
};
