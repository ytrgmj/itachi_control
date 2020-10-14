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
/**
 * 重复检查
 */
const itachi_orm_1 = require("itachi_orm");
const BaseChecker_1 = __importDefault(require("./BaseChecker"));
class RepeatChecker extends BaseChecker_1.default {
    constructor(opt) {
        super(opt);
        this._opt = opt;
    }
    _initOpt(opt) {
        if (opt.col == null)
            opt.col = 'name';
        return opt;
    }
    _createMsg() {
        return null;
    }
    _createError(param, col) {
        return __awaiter(this, void 0, void 0, function* () {
            let opt = this._opt;
            let context = this.getContext();
            let key = Control_1.default.getErrorDomain();
            if (key != null) {
                let domain = context.get(key);
                return yield domain.createError(opt.code, { [col]: param[col] });
            }
            else {
                return new Error(`${col}重复`);
            }
        });
    }
    getContext() {
        return this._opt.context;
    }
    check(param) {
        const _super = Object.create(null, {
            check: { get: () => super.check }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let opt = this._opt;
            if (!opt.isArray) {
                yield _super.check.call(this, param);
            }
            else {
                let array = param.array;
                if (array == null || array.length == 0) {
                    return;
                }
                let map = itachi_util_1.ArrayUtil.toMapArray(array, this.getCol());
                for (let e in map) {
                    if (map[e].length > 1) {
                        throw yield this._createError(map[e][0], this.getCol());
                    }
                }
                yield this.checkAdd(param);
                yield this.checkUpdate(param);
            }
        });
    }
    checkUpdate(param) {
        return __awaiter(this, void 0, void 0, function* () {
            let array = param.array;
            let col = this.getCol();
            if (array != null)
                array = itachi_util_1.ArrayUtil.filter(array, (data) => {
                    return data[this.getIdCol()] != null && data[col] != null;
                });
            if (array.length == 0)
                return;
            let names = itachi_util_1.ArrayUtil.toArray(array, this.getCol());
            let query = new itachi_orm_1.Query().in(this.getCol(), names);
            query.addCdt(itachi_orm_1.BaseCdt.parse(this._opt.otherCdt));
            let dao = this.getDao();
            let list = yield dao.find(query);
            let datas = itachi_util_1.ArrayUtil.notInByKey(list, array, this.getIdCol());
            if (datas.length > 0) {
                throw yield this._createError(datas[0], this.getCol());
            }
        });
    }
    getIdCol() {
        return this._opt.key + '_id';
    }
    checkAdd(param) {
        return __awaiter(this, void 0, void 0, function* () {
            let array = param.array;
            if (array != null)
                array = itachi_util_1.ArrayUtil.filter(array, (data) => !data[this.getIdCol()]);
            if (array.length == 0)
                return;
            let names = itachi_util_1.ArrayUtil.toArray(array, this.getCol());
            let query = new itachi_orm_1.Query().in(this.getCol(), names);
            query.addCdt(itachi_orm_1.BaseCdt.parse(this._opt.otherCdt));
            let dao = this.getDao();
            let list = yield dao.find(query);
            if (list.length > 0) {
                throw yield this._createError(list[0], this.getCol());
            }
        });
    }
    getDao() {
        let opt = this._opt;
        let context = this.getContext();
        let dao = context.get(opt.key + 'dao');
        return dao;
    }
    _check(value, col, param) {
        return __awaiter(this, void 0, void 0, function* () {
            if (col != this.getCol())
                return true;
            let dao = this.getDao();
            let query = this._buildQuery(value, col, param);
            return (yield dao.findOne(query)) == null;
        });
    }
    _buildQuery(value, col, param) {
        let opt = this._opt;
        let query = new itachi_orm_1.Query({
            [col]: value
        });
        let otherCdt = opt.otherCdt;
        query.addCdt(itachi_orm_1.BaseCdt.parse(otherCdt));
        let idCol = opt.key + '_id';
        let id = param[idCol];
        if (id != null)
            query.notEq(idCol, id);
        return query;
    }
    getCol() {
        let opt = this._opt;
        if (opt.col == null)
            return 'name';
        return opt.col;
    }
}
exports.default = RepeatChecker;
const Control_1 = __importDefault(require("../control/Control"));
const itachi_util_1 = require("itachi_util");
