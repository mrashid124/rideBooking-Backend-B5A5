import express from 'express';
import { RideController } from './ride.controller';
import { authenticate, authorize } from '../../middlewares/auth';

const router = express.Router();

// Only rider can use these endpoints
router.post(
  '/request',
  authenticate,
  authorize(['rider']),
  RideController.requestRide
);

router.patch(
  '/cancel/:id',
  authenticate,
  authorize(['rider']),
  RideController.cancelRide
);

router.get(
  '/my-rides',
  authenticate,
  authorize(['rider']),
  RideController.rideHistory
);

export default router;
