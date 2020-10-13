"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseUploadState_1 = __importDefault(require("./BaseUploadState"));
class Content extends BaseUploadState_1.default {
    constructor() {
        super(...arguments);
        this._cnt = 0;
    }
    add(line) {
        var wiget = this._wiget;
        if (this._cnt++ > 0) {
            wiget.addBuffer('\r\n');
        }
        wiget.addBuffer(this.substring(line, 0, line.length - 2));
    }
    substring(buffer, begin, end) {
        var size = end - begin;
        if (size < 0)
            return '';
        var ret = new Buffer(size);
        buffer.copy(ret, 0, begin, end);
        return ret;
    }
}
exports.default = Content;
