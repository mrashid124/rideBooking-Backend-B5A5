import { Router } from "express";
// import { authRoutes } from "../modules/auth/auth.route";
import { DriverRoutes } from "../modules/driver/driver.route";
import { RideRoutes } from "../modules/ride/ride.route";
import { UserRoutes } from "../modules/user/user.route";
import authRoutes from "../modules/auth/auth.route"

export const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/rides",
    route: RideRoutes,
  },
  {
    path: "/drivers",
    route: DriverRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
