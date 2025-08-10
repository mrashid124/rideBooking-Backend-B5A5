"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coordinatesFromAddress = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const coordinatesFromAddress = (address) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apiKey = env_1.envVars.OPEN_CASE_MAPS_API_KEY;
        const encodedAddress = encodeURIComponent(address);
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodedAddress}&countrycode=bd&key=${apiKey}`;
        const response = yield axios_1.default.get(url);
        if (!response.data || response.data.results.length === 0) {
            throw new Error(`Geocoding failed for: ${address}`);
        }
        const location = response.data.results[0].geometry;
        return {
            lat: location.lat,
            lng: location.lng,
        };
    }
    catch (error) {
        throw new Error(error);
    }
});
exports.coordinatesFromAddress = coordinatesFromAddress;
