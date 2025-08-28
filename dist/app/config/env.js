"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const loadEnvVariables = () => {
    const requiredEnvVariables = [
        "PORT",
        "DB_URL",
        "NODE_ENV",
        "BCRYPT_SALT_ROUND",
        "JWT_ACCESS_SECRET",
        "JWT_ACCESS_EXPIRES",
        "JWT_REFRESH_SECRET",
        "JWT_REFRESH_EXPIRES",
        "ADMIN_EMAIL",
        "ADMIN_PASSWORD",
        "OPEN_CASE_MAPS_API_KEY",
        "PER_KM_RATE",
        "CANCEL_WINDOW_TIME",
        "GEO_LOCATION_API",
        "FRONTEND_URL",
    ];
    requiredEnvVariables.forEach((key) => {
        if (!process.env[key]) {
            throw Error(`Missing env Variables ${key}`);
        }
    });
    return {
        PORT: process.env.PORT,
        // DB_URL: process.env.DB_URL!,
        DB_URL: process.env.DB_URL,
        NODE_ENV: process.env.NODE_ENV,
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND,
        JWT: {
            JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
            JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES,
            JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
            JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES,
        },
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
        OPEN_CASE_MAPS_API_KEY: process.env.OPEN_CASE_MAPS_API_KEY,
        PER_KM_RATE: process.env.PER_KM_RATE,
        CANCEL_WINDOW_TIME: process.env.CANCEL_WINDOW_TIME,
        GEO_LOCATION_API: process.env.GEO_LOCATION_API,
        FRONTEND_URL: process.env.FRONTEND_URL,
    };
};
exports.envVars = loadEnvVariables();
// export const envVars = {
//   PORT: process.env.PORT!,
//   DB_URL: process.env.DB_URL!,
//   NODE_ENV: process.env.NODE_ENV! as 'development' | 'production',
//   BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND!,
//   JWT: {
//     JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
//     JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES!,
//     JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
//     JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES!,
//   },
// };
