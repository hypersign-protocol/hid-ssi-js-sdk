"use strict";
/**
 * Copyright (c) 2023, Hypermine Pvt. Ltd.
 * All rights reserved.
 * Author: Hypermine Core Team
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportedPurpose = exports.IClientSpec = void 0;
var IClientSpec;
(function (IClientSpec) {
    IClientSpec["eth-personalSign"] = "eth-personalSign";
    IClientSpec["cosmos-ADR036"] = "cosmos-ADR036";
})(IClientSpec = exports.IClientSpec || (exports.IClientSpec = {}));
var SupportedPurpose;
(function (SupportedPurpose) {
    SupportedPurpose["assertionMethod"] = "assertionMethod";
    SupportedPurpose["authentication"] = "authentication";
})(SupportedPurpose = exports.SupportedPurpose || (exports.SupportedPurpose = {}));
