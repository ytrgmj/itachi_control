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
const GroupControl_1 = __importDefault(require("./GroupControl"));
/**
 * 通过searcher的方法查询的
 */
class default_1 extends GroupControl_1.default {
    getDao() {
        return null;
    }
    getSearcher() {
        let tableName = this.getTableName();
        if (tableName == null)
            throw new Error('tablename is null');
        let context = this.getContext();
        return context.get(tableName + 'searcher');
    }
    getTableName() {
        return null;
    }
    find() {
        return __awaiter(this, void 0, void 0, function* () {
            let searcher = this.getSearcher();
            let funName = this.getFunName();
            var list = yield searcher[funName](this._parseSearchParam());
            return list;
        });
    }
    _parseSearchParam() {
        if (this._schKey == null) {
            return this._param;
        }
        return this._param[this._schKey];
    }
}
exports.default = default_1;
