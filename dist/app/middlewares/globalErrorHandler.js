"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../config/env");
const handleCastError_1 = __importDefault(require("../helpers/handleCastError"));
const handleDuplicateError_1 = __importDefault(require("../helpers/handleDuplicateError"));
const handleValidationError_1 = __importDefault(require("../helpers/handleValidationError"));
const handleZodError_1 = __importDefault(require("../helpers/handleZodError"));
const appError_1 = __importDefault(require("../errorHelpers/appError"));
const globalErrorHandler = (err, _req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    let errorSources = [];
    let statusCode = 500;
    let message = "Something went to wrong!!";
    if (err.code === 11000) {
        const simplifiedError = (0, handleDuplicateError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    else if (err.name === "CastError") {
        const simplifiedError = (0, handleCastError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    else if (err.name === "ZodError") {
        const simplifiedError = (0, handleZodError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources;
        message = simplifiedError.message;
    }
    else if (err.name === "ValidationError") {
        const simplifiedError = (0, handleValidationError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources;
        message = simplifiedError.message;
    }
    else if (err instanceof appError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        errorSources,
        message,
        err: env_1.envVars.NODE_ENV === "development" ? err : null,
        stack: env_1.envVars.NODE_ENV === "development" ? err.stack : null,
    });
};
exports.default = globalErrorHandler;
