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
const itachi_core_1 = require("@dt/itachi_core");
const Control_1 = __importDefault(require("./Control"));
class SaveArrayControl extends Control_1.default {
    getDao() {
        return this._context.get(this.getTableName() + 'dao');
    }
    getIdCol() {
        return this.getTableName() + '_id';
    }
    getNoCol() {
        return this.getTableName() + '_no';
    }
    doExecute() {
        return __awaiter(this, void 0, void 0, function* () {
            let addArray = this._findAddArray();
            let updateArray = this._findUpdateArray();
            yield this._add(addArray);
            yield this._update(updateArray);
        });
    }
    _findAddArray() {
        let array = this._param.array;
        let idCol = this.getIdCol();
        return itachi_core_1.ArrayUtil.filter(array, (data) => (data[idCol] == null));
    }
    getNoUpdateCols() {
        return [
            'add_user',
            'modify_user',
            'add_time',
            'modify_time',
            'sys_add_time',
            'sys_modify_time',
            this.getNoCol()
        ];
    }
    _findUpdateArray() {
        let array = this._param.array;
        let idCol = this.getIdCol();
        let retArray = itachi_core_1.ArrayUtil.filter(array, (data) => (data[idCol] != null));
        let noUpdateCols = this.getNoUpdateCols();
        for (let row of retArray) {
            for (let noUpdateCol of noUpdateCols) {
                delete row[noUpdateCol];
            }
        }
        return retArray;
    }
    _add(array) {
        return __awaiter(this, void 0, void 0, function* () {
            let param = this._param;
            if (array != null && array.length > 0) {
                let keys = this._getNeedParamKey();
                let dao = this.getDao();
                for (let obj of array) {
                    for (let key of keys) {
                        obj[key] = param[key];
                    }
                }
                yield dao.addArray(array);
            }
        });
    }
    _update(array) {
        return __awaiter(this, void 0, void 0, function* () {
            if (array != null && array.length == 0)
                return;
            let param = this._param;
            let cdt = {};
            let keys = this._getNeedParamKey();
            for (let key of keys) {
                cdt[key] = param[key];
            }
            let dao = this.getDao();
            yield dao.updateArray(array, null, cdt);
            let syncData = this.getSyncData();
            if (syncData != null) {
                yield syncData.syncData(yield dao.findByIds(itachi_core_1.ArrayUtil.toArray(array, this.getIdCol())));
            }
        });
    }
    getSyncData() {
        return null;
    }
}
exports.default = SaveArrayControl;
