"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("http-status-codes"));
/* eslint-disable @typescript-eslint/no-explicit-any */
const handleZodError = (err) => {
    const errorSources = [];
    const errors = err.issues;
    errors.forEach((issue) => errorSources.push({
        path: issue.path[issue.path.length - 1],
        message: issue.message,
    }));
    return {
        statusCode: http_status_codes_1.default.BAD_REQUEST,
        message: "Zod Error!",
        errorSources,
    };
};
exports.default = handleZodError;
