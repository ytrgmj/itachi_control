"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const itachi_core_1 = require("@dt/itachi_core");
const BaseUploadState_1 = __importDefault(require("./BaseUploadState"));
var key = 'Content-Disposition:';
class Heading extends BaseUploadState_1.default {
    add(lineBufer) {
        let line = lineBufer.toString();
        var wiget = this._wiget;
        if (itachi_core_1.StrUtil.start(line, key)) {
            var param = this._parse(line.substring(key.length));
            wiget._name = param.name;
            wiget._filename = param.filename;
        }
        if (line == '\r\n') {
            wiget._state = new Content_1.default(wiget);
        }
    }
    _parse(line) {
        line = line.substring(0, line.length - 2);
        var lines = line.split(';');
        var obj = {};
        for (let strLine of lines) {
            let strs = strLine.split('=');
            let value;
            if (strs.length <= 2) {
                value = itachi_core_1.StrUtil.trim(strs[1]);
            }
            else {
                let strsSlice = strs.slice(1);
                value = itachi_core_1.StrUtil.trim(strsSlice.join('='));
            }
            if (value != null) {
                if (itachi_core_1.StrUtil.start(value, '"') || itachi_core_1.StrUtil.start(value, "'")) {
                    value = value.substring(1);
                }
                if (itachi_core_1.StrUtil.end(value, '"') || itachi_core_1.StrUtil.end(value, "'")) {
                    value = value.substring(0, value.length - 1);
                }
                obj[itachi_core_1.StrUtil.trim(strs[0])] = value;
            }
        }
        return obj;
    }
}
exports.default = Heading;
const Content_1 = __importDefault(require("./Content"));
