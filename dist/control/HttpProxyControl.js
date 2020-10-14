"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
const itachi_core_2 = require("itachi_core");
const Control_1 = __importDefault(require("./Control"));
const lodash_findindex_1 = __importDefault(require("lodash.findindex"));
/**
 * 做http 代理
 */
class HttpProxyControl extends Control_1.default {
    _parseParam(param) {
        return __awaiter(this, void 0, void 0, function* () {
            return param;
        });
    }
    /**
     * 返回黑名单
     */
    getBlackList() {
        return null;
    }
    getCheckReqId() {
        return null;
    }
    _checkReqIdList(req) {
        return __awaiter(this, void 0, void 0, function* () {
            let reqIdList = this.getCheckReqId();
            if (reqIdList == null)
                return null;
            const hit = (lodash_findindex_1.default(reqIdList, function (url) { return req.originalUrl.indexOf(url) > -1; }) > -1);
            if (hit) {
                // 然后返回锁的信息
                const redisServer = this._context.get("redisServer");
                const baseUrl = req.originalUrl;
                const requestId = req.headers.requestId || req.headers.requestid;
                if (requestId == null)
                    return {
                        "error": {
                            "code": "requestId_IsNul",
                            "message": 'requestId not allow null'
                        }
                    };
                const key = `${baseUrl}-${requestId}`;
                const lock = yield redisServer.lock(key, "", 15 * 60);
                if (lock !== true)
                    return {
                        "error": {
                            "code": "requestId_Repeat",
                            "message": 'same url requestId not allow repeat'
                        }
                    };
            }
            return null;
        });
    }
    _checkBlackList(req) {
        let blackList = this.getBlackList();
        if (blackList == null)
            return true;
        let token = this._param._token;
        if (token == null) {
            if ((lodash_findindex_1.default(blackList, function (url) { return req.originalUrl.indexOf(url) > -1; }) > -1)) {
                return false;
            }
        }
        return true;
    }
    doExecute(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._checkBlackList(req)) {
                resp.status(401);
                return {
                    "error": {
                        "code": "TOKEN_ERROR",
                        "message": 'http proxy control token error'
                    }
                };
            }
            ;
            const checkError = yield this._checkReqIdList(req);
            if (checkError !== null) {
                resp.status(200);
                return checkError;
            }
            let key = this.getKey();
            var path = req.path;
            var httpConfig = itachi_core_1.ConfigFac.get('httpconfig');
            var opt = httpConfig[key];
            opt = itachi_core_1.BeanUtil.shallowCombine(opt, { path });
            var param = this._param;
            param = yield this._parseParam(param);
            let headers = req.headers;
            //let headers = {};
            headers['Accept'] = "application/json";
            headers['accept'] = "application/json";
            headers['cache-control'] = "no-cache";
            delete headers['host'];
            if (this._context != null) {
                headers['context_id'] = this._context.getId();
            }
            for (var e in headers) {
                if ("content-length".toLowerCase() == e.toLowerCase() && req.method.toLowerCase() != 'get') {
                    delete headers[e];
                }
            }
            if (param._token) {
                headers["_token"] = JSON.stringify(param._token);
                delete param._token;
            }
            if (this.timezoneServer)
                headers['storetime'] = itachi_core_2.DateUtil.formatDate(this.timezoneServer.getDate());
            opt.headers = headers;
            //console.log('opt',JSON.stringify(opt,null,4));
            this._printProxyLog(opt);
            let http = itachi_core_1.HttpEntryFac.get(req.method, opt);
            //param._url = req.url;
            let date = new Date();
            let ret = yield http.submit(param);
            this._printProxyLog(param);
            this._printAfterSubmit(date);
            return ret;
        });
    }
    _printProxyLog(message) {
        let context = this.getContext();
        if (context == null) {
            return;
        }
        let logger = context.getLogger('proxy');
        logger.info(message);
    }
    _printAfterSubmit(date) {
        if (date == null) {
            return;
        }
        let context = this.getContext();
        if (context == null) {
            return;
        }
        let logger = context.getLogger('proxy');
        logger.info(new Date().getTime() - date.getTime());
    }
    _sendResp(resp, ret) {
        if (ret == null) {
            resp.send({});
        }
        else {
            resp.send(ret);
        }
    }
}
__decorate([
    itachi_core_1.Bean()
], HttpProxyControl.prototype, "timezoneServer", void 0);
exports.default = HttpProxyControl;
