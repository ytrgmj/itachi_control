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
const itachi_core_1 = require("itachi_core");
const JwtToken_1 = __importDefault(require("./JwtToken"));
const lodash_findindex_1 = __importDefault(require("lodash.findindex"));
function checkParam(tokenItem, reqItem, bakItem) {
    if (tokenItem == null && bakItem == null)
        return true;
    let array = [];
    if (tokenItem != null) {
        if (!(tokenItem instanceof Array)) {
            array.push(tokenItem);
        }
        else {
            array.push(...tokenItem);
        }
    }
    if (!(reqItem instanceof Array))
        reqItem = [reqItem];
    if (bakItem != null) {
        if (bakItem instanceof Array) {
            array.push(...bakItem);
        }
    }
    if (reqItem.length > array.length)
        return false;
    let list = itachi_core_1.ArrayUtil.and(reqItem, array);
    return list.length == reqItem.length;
}
function tokenCheck(params) {
    let exceptUrl = params.exceptUrl || [];
    let tokenStatus = params.tokenStatus; //true需要token，false不需要token
    exceptUrl.push('/debug', '/documentation');
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let nextStatus = false;
            if (req.method === 'OPTIONS' || req.method === 'options') {
                return next();
            }
            else if ((lodash_findindex_1.default(exceptUrl, function (url) { return req.originalUrl.indexOf(url) > -1; }) > -1)) {
                nextStatus = true;
            }
            const jwtToken = new JwtToken_1.default({ pubcert: params.publicKey });
            let token = req.headers.token || req.headers.Token;
            try {
                if (token == null || token == '') {
                    if (nextStatus || !tokenStatus) {
                        delete req._param._token;
                        return next();
                    }
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    let ret = {
                        "error": {
                            "code": "TOKEN_ERROR",
                            "message": 'token error'
                        }
                    };
                    res.write(JSON.stringify(ret));
                    return res.end();
                }
                let tokenInfo = yield jwtToken.decode(token);
                if (tokenInfo) {
                    for (let item in tokenInfo) {
                        if (req._param[item] && !checkParam(tokenInfo[item], req._param[item], tokenInfo[item + 's'])) {
                            throw new Error("Token Data Error");
                        }
                    }
                    req._param._token = tokenInfo;
                }
                return next();
            }
            catch (error) {
                if (nextStatus || !tokenStatus) {
                    delete req._param._token;
                    return next();
                }
                res.writeHead(401, { 'Content-Type': 'application/json' });
                let ret = {
                    "error": {
                        "code": "TOKEN_ERROR",
                        "message": error.message || 'token error'
                    }
                };
                res.write(JSON.stringify(ret));
                return res.end();
            }
        });
    };
}
exports.default = tokenCheck;
