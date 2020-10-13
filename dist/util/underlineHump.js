"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createHumps_1 = __importDefault(require("./createHumps"));
function toCamelCase(str) {
    return str.replace(/_(\w)/g, function (m, $1) {
        return $1 ? $1.toUpperCase() : m;
    });
}
exports.default = createHumps_1.default(toCamelCase);
