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
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { envVars } from "./app/config/env";


// dotenv.config();
const app =express();

// app.use(cors());
// app.use(cors({ origin: true, credentials: true }));

// app.use(
//   cors({
//     origin: envVars.FRONTEND_URL,
//     credentials: true,
//   })
// );

// app.use(express.json());

app.set("trust proxy", 1);



const whitelist = [
  envVars.FRONTEND_URL,              // e.g. "http://localhost:3001"
  // "http://localhost:3001",
  // "https://your-frontend.vercel.app" 
  // production/previews
].filter(Boolean);

const corsOptions: cors.CorsOptions = {
  origin(origin, cb) {

    if (!origin) return cb(null, true);
    if (whitelist.includes(origin)) return cb(null, true);
    return cb(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization","X-Requested-With","Accept"],
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));


// app.use(
//   cors({
//     origin: envVars.FRONTEND_URL,
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
//   })
// );

app.use(express.json({ limit: '10mb' })); // For JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // For form data


app.use(cookieParser());




// app.use('/api/auth', AuthRoutes);

app.use("/api/v1", router);
// app.use("/api/user", UserRoutes);

// app.use('/api/rides', rideRoutes);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Ride Booking System Backend"
    })
})

app.use(globalErrorHandler);
app.use(notFound);

export default app;
