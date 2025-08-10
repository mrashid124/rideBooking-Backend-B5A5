"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityStatus = exports.ApprovedStatus = void 0;
var ApprovedStatus;
(function (ApprovedStatus) {
    ApprovedStatus["PENDING"] = "PENDING";
    ApprovedStatus["APPROVED"] = "APPROVED";
    ApprovedStatus["SUSPENDED"] = "SUSPENDED";
})(ApprovedStatus || (exports.ApprovedStatus = ApprovedStatus = {}));
var AvailabilityStatus;
(function (AvailabilityStatus) {
    AvailabilityStatus["AVAILABLE"] = "AVAILABLE";
    AvailabilityStatus["UN_AVAILABLE"] = "UN_AVAILABLE";
})(AvailabilityStatus || (exports.AvailabilityStatus = AvailabilityStatus = {}));
