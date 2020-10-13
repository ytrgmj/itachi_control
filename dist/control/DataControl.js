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
const Control_1 = __importDefault(require("./Control"));
/**
 * 处理单条数据
 */
class DataControl extends Control_1.default {
    doExecute() {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this._findData();
            if (data == null) {
                throw this._createError();
            }
            return yield this._processData(data);
        });
    }
    _createError() {
        return new Error('对应的数据不存在');
    }
    _findData() {
        return __awaiter(this, void 0, void 0, function* () {
            var dao = this.getDao();
            var query = {};
            var param = this._param;
            let keys = this._getNeedParamKey();
            for (let key of keys) {
                query[key] = param[key];
            }
            return yield dao.findOne(query);
        });
    }
}
exports.default = DataControl;
