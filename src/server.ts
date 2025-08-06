
import { Server } from "http";
// import  express, { Request, Response } from "express";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
// import { promise } from "zod";

let server: Server;
const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL)
        console.log("Connected to DB");
        server = app.listen(envVars.PORT, () => {
            console.log(`Server is listening to port ${envVars.PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}
startServer();

process.on("SIGTERM", () => {
    console.log("Signal Terminal Detected...Server Shutting down...");
    if (server) {
        server.close();
        process.exit(1);
    }
    process.exit(1);
});


process.on("SIGINT", () => {
    console.log("SIGINT Detected...Server Shutting down...");
    if (server) {
        server.close();
        process.exit(1);
    }
    process.exit(1);
});

process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection Detected...Server Shutting down...", err);
    if (server) {
        server.close();
        process.exit(1);
    }
    process.exit(1);
});


process.on("uncaughtException", (err) => {
    console.log("UnCaught Exception Detected...Server Shutting down...", err);
    if (server) {
        server.close();
        process.exit(1);
    }
    process.exit(1);
});

// Promise.reject(new Error("I forgot to catch this promise"))

// throw new Error("I forgot to handle this local error")