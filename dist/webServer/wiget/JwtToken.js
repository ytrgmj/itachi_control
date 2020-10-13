"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtToken {
    constructor(param) {
        this._pubcert = param.pubcert;
    }
    //解密
    decode(token) {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(token, this._pubcert, { algorithms: ['RS256'] }, function (err, payload) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(payload);
                }
            });
        });
    }
}
exports.default = JwtToken;
