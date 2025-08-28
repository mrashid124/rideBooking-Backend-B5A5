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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../../config/env");
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
// 
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User already exist!");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const user = yield user_model_1.User.create(Object.assign({ email, password: hashedPassword }, rest));
    return user;
    // Role checking
});
const getAllRiders = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find({ role: user_interface_1.Role.RIDER });
    const totalUsers = yield user_model_1.User.countDocuments({ role: user_interface_1.Role.RIDER });
    return {
        data: users,
        meta: {
            total: totalUsers,
        },
    };
});
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield user_model_1.User.findById(userId);
    if (!isExistUser) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found!");
    }
    const isSelf = decodedToken.userId === userId;
    if (!isSelf) {
        if (decodedToken.role === user_interface_1.Role.RIDER || decodedToken.role === user_interface_1.Role.DRIVER) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to update!");
        }
        if (decodedToken.role === user_interface_1.Role.ADMIN && isExistUser.role === user_interface_1.Role.ADMIN) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Admin cannot update other Admin");
        }
    }
    if (payload.role) {
        if (decodedToken.role === user_interface_1.Role.RIDER || decodedToken.role === user_interface_1.Role.DRIVER) {
            if (payload.role === user_interface_1.Role.ADMIN) {
                throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to change!");
            }
        }
    }
    if (payload.password) {
        payload.password = yield bcryptjs_1.default.hash(payload.password, env_1.envVars.BCRYPT_SALT_ROUND);
    }
    const newUpdatedUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return newUpdatedUser;
});
const blockedUser = (userId, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield user_model_1.User.findById(userId);
    if (!isExistUser) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found!");
    }
    if (decodedToken.role === user_interface_1.Role.RIDER || decodedToken.role === user_interface_1.Role.DRIVER) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized.");
    }
    if (isExistUser.isActive !== user_interface_1.ActiveStatus.ACTIVE) {
        isExistUser.isActive = user_interface_1.ActiveStatus.ACTIVE;
        yield isExistUser.save();
        return isExistUser;
    }
    isExistUser.isActive = user_interface_1.ActiveStatus.BLOCKED;
    yield isExistUser.save();
    return isExistUser;
});
exports.UserService = {
    createUser,
    getAllRiders,
    updateUser,
    blockedUser,
};
