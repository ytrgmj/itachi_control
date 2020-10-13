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
Object.defineProperty(exports, "__esModule", { value: true });
class BaseChecker {
    constructor(opt) {
        this._opt = null;
        this._opt = this._initOpt(opt);
    }
    _initOpt(opt) {
        return opt;
    }
    _createError(param, col) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Error(this._createMsg(param[col], col));
        });
    }
    _getCols() {
        let opt = this._opt;
        if (opt.cols != null) {
            return opt.cols;
        }
        if (opt.col != null)
            return [opt.col];
        return null;
    }
    check(param) {
        return __awaiter(this, void 0, void 0, function* () {
            let cols = this._getCols();
            if (cols != null) {
                for (let col of cols) {
                    if (!(yield this._check(param[col], col, param))) {
                        throw yield this._createError(param, col);
                    }
                    ;
                }
            }
        });
    }
}
exports.default = BaseChecker;
