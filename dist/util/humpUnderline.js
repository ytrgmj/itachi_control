"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = require("lodash/fp");
const createHumps_1 = __importDefault(require("./createHumps"));
exports.default = createHumps_1.default(fp_1.snakeCase);
