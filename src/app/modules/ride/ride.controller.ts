/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { RideService } from './ride.service';
import { AuthRequest } from '../../middlewares/auth';

export const RideController = {
  requestRide: async (req: AuthRequest, res: Response) => {
    try {
      const { pickupLocation, destinationLocation } = req.body;
      const ride = await RideService.requestRide(
        req.user.id,
        pickupLocation,
        destinationLocation
      );
      res.status(201).json(ride);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  cancelRide: async (req: AuthRequest, res: Response) => {
    try {
      const ride = await RideService.cancelRide(req.user.id, req.params.id);
      res.status(200).json(ride);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  rideHistory: async (req: AuthRequest, res: Response) => {
    try {
      const history = await RideService.getRiderHistory(req.user.id);
      res.status(200).json(history);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },
};
