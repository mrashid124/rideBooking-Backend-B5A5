"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookie = void 0;
const env_1 = require("../config/env");
const setAuthCookie = (res, loginInfo) => {
    if (loginInfo.accessToken) {
        res.cookie("accessToken", loginInfo.accessToken, {
            httpOnly: true,
            secure: env_1.envVars.NODE_ENV === "production",
            sameSite: "none",
        });
    }
    if (loginInfo.refreshToken) {
        res.cookie("refreshToken", loginInfo.refreshToken, {
            httpOnly: true,
            secure: env_1.envVars.NODE_ENV === "production",
            sameSite: "none",
        });
    }
};
exports.setAuthCookie = setAuthCookie;
