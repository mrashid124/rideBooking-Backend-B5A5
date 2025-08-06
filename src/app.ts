// import { Server} from "http";
import  express, { Request, Response } from "express";
// import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
// import dotenv from 'dotenv';
// import { UserRoutes } from "./app/modules/user/user.route";

// import AuthRoutes from './app/modules/auth/auth.route'

// import rideRoutes from './app/modules/ride/ride.route'
import { router } from "./app/routes";


// dotenv.config();
const app =express();

app.use(cors());
// app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use(cookieParser());
app.set("trust proxy", 1);

// app.use('/api/auth', AuthRoutes);

app.use("/api/v1", router);
// app.use("/api/user", UserRoutes);

// app.use('/api/rides', rideRoutes);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Ride Booking System Backend"
    })
})

// app.use(globalErrorHandler);
// app.use(notFound);

export default app;
