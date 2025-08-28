import { Router } from "express";



import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { RideRoutes } from "../modules/ride/ride.route";
import { DriverRoutes } from "../modules/driver/driver.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/rides",
    route: RideRoutes,
  },
  {
    path: "/driver",
    route: DriverRoutes,
  },
  //   {
  //   path: "/stats",
  //   route: StatsRoutes,
  // },
  // {
  //   path: "/vehicle",
  //   route: VehicleRoutes,
  // },
  // {
  //   path: "/analytics",
  //   route: AnalyticsRoutes,
  // },
  // {
  //   path: "/sms",
  //   route: SMSRoutes,
  // },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
