"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { Server} from "http";
const express_1 = __importDefault(require("express"));
// import mongoose from "mongoose";
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// import dotenv from 'dotenv';
// import { UserRoutes } from "./app/modules/user/user.route";
// import AuthRoutes from './app/modules/auth/auth.route'
// import rideRoutes from './app/modules/ride/ride.route'
const routes_1 = require("./app/routes");
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const env_1 = require("./app/config/env");
// dotenv.config();
const app = (0, express_1.default)();
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
    env_1.envVars.FRONTEND_URL, // e.g. "http://localhost:3001"
    // "http://localhost:3001",
    // "https://your-frontend.vercel.app" 
    // production/previews
].filter(Boolean);
const corsOptions = {
    origin(origin, cb) {
        if (!origin)
            return cb(null, true);
        if (whitelist.includes(origin))
            return cb(null, true);
        return cb(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
};
app.use((0, cors_1.default)(corsOptions));
app.options("*", (0, cors_1.default)(corsOptions));
// app.use(
//   cors({
//     origin: envVars.FRONTEND_URL,
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
//   })
// );
app.use(express_1.default.json({ limit: '10mb' })); // For JSON bodies
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' })); // For form data
app.use((0, cookie_parser_1.default)());
// app.use('/api/auth', AuthRoutes);
app.use("/api/v1", routes_1.router);
// app.use("/api/user", UserRoutes);
// app.use('/api/rides', rideRoutes);
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to Ride Booking System Backend"
    });
});
app.use(globalErrorHandler_1.default);
app.use(notFound_1.default);
exports.default = app;
