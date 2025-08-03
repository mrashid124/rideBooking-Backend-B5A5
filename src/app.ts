// import { Server} from "http";
import  express, { Request, Response } from "express";
// import mongoose from "mongoose";
import cors from "cors";
import { UserRoutes } from "./app/modules/user/user.route";

import authRoutes from './app/modules/auth/auth.route'

import rideRoutes from './app/modules/ride/ride.route'

const app =express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

// app.use("/api/v1", router);
app.use("/api/v1/user", UserRoutes);

app.use('/api/rides', rideRoutes);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Ride Booking System Backend"
    })
})

export default app;
