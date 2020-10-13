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
            let list = yield this._findDatas();
            if (list.length != 2) {
                throw this._createError();
            }
            let sort = list[0].sort;
            list[0].sort = list[1].sort;
            list[1].sort = sort;
            yield this._update(list);
        });
    }
    _update(list) {
        return __awaiter(this, void 0, void 0, function* () {
            let idCol = this._getIdCol();
            let array = list.map((data) => ({
                [idCol]: data[idCol],
                sort: data.sort
            }));
            let dao = this.getDao();
            yield dao.updateArray(array);
        });
    }
    _createError() {
        return new Error('对应的数据不存在');
    }
    _findDatas() {
        return __awaiter(this, void 0, void 0, function* () {
            var dao = this.getDao();
            var query = {};
            var param = this._param;
            let keys = this._getNeedParamKey();
            for (let key of keys) {
                query[key] = param[key];
            }
            query[this._getIdCol()] = [param.begin_id, param.end_id];
            return yield dao.find(query);
        });
    }
    _getIdCol() {
        let dao = this.getDao();
        return dao.getTableName() + "_id";
    }
}
exports.default = DataControl;
