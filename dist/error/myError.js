"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MyError extends Error {
    constructor(opt) {
        super();
        this._opt = opt;
    }
    get message() {
        return this._opt.message;
    }
    get code() {
        return this._opt.code;
    }
    get status() {
        return this._opt.status;
    }
    get data() {
        return this._opt.data;
    }
}
function default_1(opt) {
}
exports.default = default_1;
