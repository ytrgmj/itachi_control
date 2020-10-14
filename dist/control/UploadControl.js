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
const Control_1 = __importDefault(require("./Control"));
const UploadBus_1 = __importDefault(require("./bus/UploadBus"));
class UploadControl extends Control_1.default {
    _sendResp(resp, ret) {
        resp.send(ret);
    }
    /**
     * 得到所有的上传文件
     */
    _getAllFile() {
        var ret = [];
        if (this._fileMap != null) {
            for (var e in this._fileMap) {
                var file = this._fileMap[e];
                ret.push(file);
            }
        }
        return ret;
    }
    /**
     * 允许的上传文件扩展名
     */
    _getSuffixs() {
        return ['jpg'];
    }
    /**
     * 检查扩展名
     */
    _checkSuffix() {
        var files = this._getAllFile();
        var suffixs = this._getSuffixs();
        if (suffixs == null)
            return;
        for (var file of files) {
            var checked = false;
            for (var suffix of suffixs) {
                if (itachi_core_1.StrUtil.end(file.getFilename(), '.' + suffix, true)) {
                    checked = true;
                }
            }
            if (!checked)
                return false;
        }
        return true;
    }
    _getContentLen() {
        return 10 * 1000 * 1000;
    }
    /**
     * 创建长度太大了的返回信息
     */
    _createContentTooLong() {
        return "上传的文件长度太大了";
    }
    doExecute(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            //await this._parseUpload(req)
            if (!this._checkSuffix()) {
                return this._createWrongSuffix();
            }
            return yield this._executeUpload();
        });
    }
    execute(req, resp) {
        const _super = Object.create(null, {
            execute: { get: () => super.execute }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let contentLen = this._getContentLen();
            if (contentLen != null) {
                let len = req.get('Content-Length');
                if (len == null)
                    len = req.headers['content-length'];
                let num = parseInt(len);
                if (contentLen < num) {
                    resp.send(this._createContentTooLong());
                    return;
                }
            }
            let param = yield this._parseUpload(req);
            if (req['_param'] == null)
                req['_param'] = {};
            for (let e in param) {
                req['_param'][e] = param[e];
            }
            //console.log('this._param',this._param);
            yield _super.execute.call(this, req, resp);
        });
    }
    /**
     * 检查
     */
    _createWrongSuffix() {
        let array = this._getSuffixs();
        let str = array.join('、');
        return `只能上传扩展名是${str}的文件`;
    }
    /**
     * 将request转成文件
     * @param req
     */
    _parseUpload(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var buffers = new itachi_core_1.Buffers();
            yield buffers.readFrom(req);
            var str = this._parse(req.get('Content-Type'));
            var bus = new UploadBus_1.default({
                boundary: str
            });
            var opt = yield bus.process(buffers);
            this._fileMap = opt.files;
            return opt.param;
        });
    }
    /**
     * 处理文件分割线
     * @param line
     */
    _parse(line) {
        var lines = line.split(';');
        var obj = {};
        for (let line of lines) {
            let strs = line.split('=');
            obj[itachi_core_1.StrUtil.trim(strs[0])] = strs[1];
        }
        return '--' + itachi_core_1.StrUtil.trim(obj['boundary']);
    }
    /**
     * 根据文件名获取文件
     * @param key 文件名，为空则只取一个文件
     */
    _getFile(key) {
        if (this._fileMap == null) {
            return null;
        }
        if (key != null) {
            return this._fileMap[key];
        }
        else {
            for (var e in this._fileMap) {
                return this._fileMap[e];
            }
        }
    }
    _printBeforeLog() {
        this._printLog({});
    }
}
exports.default = UploadControl;
