import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const router = Router();

router.post("/login", AuthControllers.credentialsLogin);
router.post("/refresh-token", AuthControllers.getNewAccessToken);
router.post("/logout", AuthControllers.logout);

export const AuthRoutes = router;




// import express from 'express';
// import { AuthController } from './auth.controller';

// const router = express.Router();

// router.post('/register', AuthController.register);
// router.post('/login', AuthController.login);

// export default router;
