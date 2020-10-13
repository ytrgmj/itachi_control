"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const itachi_core_1 = require("@dt/itachi_core");
var get = function () {
    var redisConfig = itachi_core_1.ConfigFac.get('redis');
    if (redisConfig == null) {
        return null;
    }
    var db = 0;
    if (redisConfig.db != null)
        db = redisConfig.db;
    let opt = {
        host: redisConfig.host,
        port: redisConfig.port,
        password: redisConfig.password,
        db
    };
    if (redisConfig.tls) {
        opt['tls'] = {};
    }
    return new ioredis_1.default(opt);
};
exports.default = { get };
