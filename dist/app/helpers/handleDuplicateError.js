"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const handleDuplicateError = (err) => {
    var _a;
    const matchedArray = ((_a = err.message.match(/"([^"]*)"/)) === null || _a === void 0 ? void 0 : _a[1]) || null;
    return {
        statusCode: http_status_codes_1.default.BAD_REQUEST,
        message: `${matchedArray} , Already exist!`,
    };
};
exports.default = handleDuplicateError;
