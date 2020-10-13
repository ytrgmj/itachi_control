"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UploadFile {
    constructor(opt) {
        if (opt == null)
            opt = {};
        this._opt = opt;
    }
    /**
     * 得到流
     */
    getBuffer() {
        return this._opt.buffer;
    }
    /**
     * 得到文件名
     */
    getFilename() {
        return this._opt.filename;
    }
}
exports.default = UploadFile;
