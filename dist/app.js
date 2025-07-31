"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { Server} from "http";
const express_1 = __importDefault(require("express"));
// import mongoose from "mongoose";
const app = (0, express_1.default)();
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to Ride Booking System Backend"
    });
});
exports.default = app;
