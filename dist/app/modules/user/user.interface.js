"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveStatus = exports.Role = void 0;
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["RIDER"] = "RIDER";
    Role["DRIVER"] = "DRIVER";
})(Role || (exports.Role = Role = {}));
var ActiveStatus;
(function (ActiveStatus) {
    ActiveStatus["ACTIVE"] = "ACTIVE";
    ActiveStatus["BLOCKED"] = "BLOCKED";
})(ActiveStatus || (exports.ActiveStatus = ActiveStatus = {}));
