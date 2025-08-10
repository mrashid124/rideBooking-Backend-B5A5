"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const handleCastError = (err) => {
    return {
        statusCode: http_status_codes_1.default.BAD_REQUEST,
        message: "Please provide valid MongoDB ObjectID.",
    };
};
exports.default = handleCastError;
