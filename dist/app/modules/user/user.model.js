"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const driver_model_1 = require("../driver/driver.model");
const user_interface_1 = require("./user.interface");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: { type: String, required: true },
    role: {
        type: String,
        // enum: Object.values(Role),
        enum: Object.values([user_interface_1.Role.RIDER, user_interface_1.Role.DRIVER]),
        // default: Role.RIDER,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    isActive: {
        type: String,
        enum: Object.values(user_interface_1.ActiveStatus),
        default: user_interface_1.ActiveStatus.ACTIVE,
    },
    cancelAttempts: {
        type: Number,
        default: 0,
    },
    lastCancelDate: {
        type: Date,
    },
    driver: { type: mongoose_1.Schema.Types.ObjectId, ref: "Driver" },
}, { timestamps: true, versionKey: false });
// rider to driver role change hook
userSchema.post("findOneAndUpdate", function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if ((doc === null || doc === void 0 ? void 0 : doc.role) === user_interface_1.Role.DRIVER) {
                const existingDriver = yield driver_model_1.Driver.findOne({ user: doc._id });
                if (!existingDriver) {
                    yield driver_model_1.Driver.create({
                        user: doc._id,
                    });
                }
            }
            next();
        }
        catch (error) {
            next(error);
        }
    });
});
//  driver to rider role change hook
userSchema.post("findOneAndUpdate", function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!doc)
                return next(); // added
            if ((doc === null || doc === void 0 ? void 0 : doc.role) === user_interface_1.Role.ADMIN) {
                yield driver_model_1.Driver.findOneAndDelete({
                    user: doc._id,
                });
            }
            next();
        }
        catch (error) {
            next(error);
        }
    });
});
exports.User = (0, mongoose_1.model)("User", userSchema);
