"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_controller_1 = require("./user.controller");
const user_interface_1 = require("./user.interface");
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
router.post("/register", (0, validateRequest_1.default)(user_validation_1.createUserZodSchema), user_controller_1.UserController.createUser);
router.get("/riders", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), user_controller_1.UserController.getAllRiders);
// router.get("/drivers", checkAuth(Role.ADMIN), UserController.getAllDrivers);
// router.get("/me", checkAuth(...Object.values(Role)), UserController.getMe);
router.patch("/block/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), user_controller_1.UserController.blockedUser);
router.patch("/:id", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.UserController.updateUser);
exports.UserRoutes = router;
// import { Router } from "express";
// import { checkAuth } from "../../middlewares/checkAuth";
// import validateRequest from "../../middlewares/validateRequest";
// import { UserController } from "./user.controller";
// import { Role } from "./user.interface";
// import { createUserZodSchema } from "./user.validation";
// const router = Router();
// router.post(
//   "/register",
//   validateRequest(createUserZodSchema),
//   UserController.createUser
// );
// router.get("/", checkAuth(Role.ADMIN), UserController.getAllRiders);
// router.patch(
//   "/:id",
//   checkAuth(...Object.values(Role)),
//   UserController.updateUser
// );
// router.get("/me", checkAuth(...Object.values(Role)), UserController.getMe);
// router.patch("/block/:id", checkAuth(Role.ADMIN), UserController.blockedUser);
// export const UserRoutes = router;
