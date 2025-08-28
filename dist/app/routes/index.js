"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const ride_route_1 = require("../modules/ride/ride.route");
const driver_route_1 = require("../modules/driver/driver.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/users",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/rides",
        route: ride_route_1.RideRoutes,
    },
    {
        path: "/driver",
        route: driver_route_1.DriverRoutes,
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
    exports.router.use(route.path, route.route);
});
