"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Redis_1 = __importDefault(require("./Redis"));
class RedisServer {
    getClient() {
        if (this._client == null) {
            this._client = Redis_1.default.get();
        }
        return this._client;
    }
    lock(key, device_id, time) {
        return __awaiter(this, void 0, void 0, function* () {
            if (time == null)
                time = 300;
            const client = this.getClient();
            const ret = yield client.set(key, device_id, 'NX', 'EX', time);
            if (device_id === '') {
                return ret === 'OK';
            }
            if (ret === 'OK') {
                return true;
            }
            else {
                let cacheValue = yield client.get(key);
                return cacheValue == device_id;
            }
        });
    }
    unlock(key, device_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const script = ['if redis.call("get",KEYS[1]) == ARGV[1] then',
                '	return redis.call("del",KEYS[1])',
                'else',
                '	return 0',
                'end'
            ];
            const client = this.getClient();
            yield client.eval(script.join('\r\n'), 1, key, device_id);
        });
    }
}
exports.default = RedisServer;
//表示在工厂类里面是单例
RedisServer.__needReg = 'single';
