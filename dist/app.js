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
// dotenv.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
// app.use(cors({ origin: true, credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.set("trust proxy", 1);
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
