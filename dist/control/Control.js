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
/**
 * 控制层父亲类
 */
const itachi_core_1 = require("@dt/itachi_core");
const underlineHump_1 = __importDefault(require("../util/underlineHump"));
const dateConvert_1 = __importDefault(require("../util/dateConvert"));
class Control {
    constructor() {
        this._param = null;
        this._req = null;
        this._resp = null;
        this._context = null;
    }
    getContext() {
        return this._context;
    }
    /**
     * 返回这次操作的名称
     */
    _getName() {
        return null;
    }
    /**
     * 数组需要的key列表
     */
    _getNeedArrayKeys() {
        return null;
    }
    /**
     * 检查数组形式
     * @param param
     */
    _checkArray(param) {
        let array = param.array;
        if (array != null) {
            let keys = this._getNeedArrayKeys();
            if (keys == null)
                return;
            for (let data of array) {
                for (let key of keys) {
                    if (data[key] == null || data[key] === '') {
                        throw new Error(`数组缺少参数${key}`);
                    }
                }
            }
        }
    }
    getCheckers() {
        return null;
    }
    /**
     * 检查输入参数是否正确
     */
    _checkParam(param) {
        return __awaiter(this, void 0, void 0, function* () {
            let needParam = this._getNeedParamKey();
            if (needParam != null) {
                for (let key of needParam) {
                    if (param[key] == null || param[key] === '') {
                        throw new Error(`缺少参数${key}`);
                    }
                }
            }
            let checkers = this.getCheckers();
            if (checkers != null) {
                for (let checker of checkers) {
                    yield checker.check(param);
                }
            }
        });
    }
    _getNeedParamKey() {
        return null;
    }
    setContext(context) {
        this._context = context;
    }
    _initLogger(req) {
        if (this._context != null) {
            let logger = this._context.getLogger('web');
            let url = req.baseUrl + req.url;
            logger.set({ url });
            Control.setLoggerParams(logger, this._param);
            var name = this._getName();
            logger.set({ name });
        }
    }
    _getLogger() {
        if (this._context != null)
            return this._context.getLogger('web');
        return new itachi_core_1.LogHelp();
    }
    _printLog(...message) {
        let logger = this._getLogger();
        logger.info(message);
    }
    _printBeforeLog() {
        this._printLog(this._param);
    }
    _printEndLog(time) {
        this._printLog(time);
    }
    execute(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            this._req = req;
            this._resp = resp;
            this._param = req['_param'];
            if (this._param == null)
                this._param = {};
            let ret;
            let begin = new Date();
            try {
                yield Control.initBefore(this._context, this._param, req);
                this._initLogger(req);
                this._printBeforeLog();
                yield this._checkParam(this._param);
                yield this._checkArray(this._param);
                ret = yield this.doExecute(req, resp);
                this._sendResp(resp, ret);
                this._printEndLog(new Date().getTime() - begin.getTime());
            }
            catch (e) {
                this._sendError(resp, e);
                this._printErrorLog(e);
            }
        });
    }
    _sendError(resp, e) {
        var code = e.code;
        if (code == null)
            code = -1;
        var errorData = {
            code,
            status: e.status,
            message: e.message,
            data: e.data
        };
        resp.send({
            error: errorData
        });
    }
    _printErrorLog(error) {
        let logger = this._getLogger();
        logger.error(error);
    }
    _sendResp(resp, ret) {
        if (ret == null) {
            resp.send({ result: {} });
        }
        else {
            const res = this._processRet(ret);
            resp.send({
                result: res
            });
        }
    }
    _processRet(ret) {
        try {
            let res = underlineHump_1.default(ret);
            res = dateConvert_1.default(res);
            return res;
        }
        catch (error) {
            return ret;
        }
    }
    doExecute(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    executeParam(param) {
        return __awaiter(this, void 0, void 0, function* () {
            this._param = param;
            return yield this.doExecute();
        });
    }
    buildControl(controlClazz) {
        let ctrl = new controlClazz();
        let context = this._context;
        if (context != null) {
            if (ctrl.setContext) {
                ctrl.setContext(context);
            }
            context.assembly([ctrl]);
        }
        return ctrl;
    }
    static addBeforeFuns(fun) {
        Control.initBeforeFuns.push(fun);
    }
    static initBefore(context, param, req) {
        return __awaiter(this, void 0, void 0, function* () {
            let initBeforeFuns = Control.initBeforeFuns;
            if (initBeforeFuns.length > 0) {
                for (var fun of initBeforeFuns) {
                    yield fun(context, param, req);
                }
            }
        });
    }
    static setLogKeys(logKeys) {
        Control.logKeys = logKeys;
    }
    static setLoggerParams(logger, param) {
        if (logger == null || param == null) {
            return;
        }
        var obj = {};
        for (var logKey of Control.logKeys) {
            if (param[logKey] != null) {
                obj[logKey] = param[logKey];
            }
        }
        logger.set(obj);
    }
    static setErrorDomain(key) {
        Control.errorDomain = key;
    }
    static getErrorDomain() {
        return Control.errorDomain;
    }
}
exports.default = Control;
Control.logKeys = [];
Control.initBeforeFuns = [];
