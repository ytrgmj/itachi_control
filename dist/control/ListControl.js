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
const itachi_orm_1 = require("@dt/itachi_orm");
const Control_1 = __importDefault(require("./Control"));
/**
 * 查询（不包括group by）的控制类
 */
class ListControl extends Control_1.default {
    constructor() {
        super(...arguments);
        /**
         * 开关，不需要查询条件
         */
        this._noCdt = false;
        /**
         * 开关，不需要查询数量
         */
        this._onlySch = false;
        /**
         * 增加排序字段
         *  [{
                col:'sort',desc:'desc'
            }]
         */
        this._orderArray = null;
        /*
        指定只有_schCols 才产生的查询条件
        */
        this._schCols = null;
        /*
        指定_noSchCols 中不要产生查询条件
        */
        this._noSchCols = null;
        /**
         * 查询 计算符 > <
         * {
         *  begin:'>',
         * end:'<'
         * }
         */
        this._opMap = null;
        /**
         * 默认查询类型，可以是Array,结构体{store_id：330108}或者BaseCdt的实例
         *
         */
        this._schCdt = null;
        /**
         * 查询字段转化map
         * </br>
         * <pre>
         * {
         *  begin:'gmt_crete',
         * end:'gmt_create'
         * }
         * </pre>
         */
        this._colMap = null;
    }
    /**
     * 对查询结果的后处理
     * @param list
     */
    _processList(list) {
        return __awaiter(this, void 0, void 0, function* () {
            return list;
        });
    }
    /**
     返回查询字段
    */
    acqCol() {
        return null;
    }
    /**
     * 是否需要排序
     */
    _needOrder() {
        return true;
    }
    /**
     根据params的列和值构建某个条件
    */
    buildCdt(e, val) {
        return __awaiter(this, void 0, void 0, function* () {
            if (e.substring(0, 1) == '_')
                return null;
            if (val == null) {
                return null;
            }
            if (this._noCdt)
                return null;
            if (this._schCols != null) {
                if (typeof this._schCols == 'string')
                    this._schCols = [this._schCols];
                if (this._schCols instanceof Array) {
                    this._schCols = itachi_core_1.ArrayUtil.toMap(this._schCols);
                }
                if (this._schCols[e] == null) {
                    return null;
                }
            }
            if (this._noSchCols != null) {
                if (typeof this._noSchCols == 'string')
                    this._noSchCols = [this._noSchCols];
                if (this._noSchCols instanceof Array) {
                    this._noSchCols = itachi_core_1.ArrayUtil.toMap(this._noSchCols);
                }
                if (this._noSchCols[e]) {
                    return null;
                }
            }
            if (e == 'desc' || e == 'orderBy' || e == 'pageNo' || e == 'pageSize') {
                return null;
            }
            return new itachi_orm_1.Cdt(yield this.getCol(e), yield val, yield this.getOp(e));
        });
    }
    /**
     * 产生一个like查询语句
     * @param e
     * @param val
     */
    like(e, val, onlyLeft) {
        if (val == null || val == '')
            return null;
        if (onlyLeft) {
            return new itachi_orm_1.Cdt(e, val + '%', 'like');
        }
        else {
            return new itachi_orm_1.Cdt(e, '%' + val + '%', 'like');
        }
    }
    /**
     * 初始化分页信息
     */
    _initPager() {
        var param = this._param;
        if (param.pageSize == null) {
            param.pageSize = this.acqDefPageSize();
        }
    }
    /**
     * 设置分页
     * @param query
     */
    _setPage(query) {
        var param = this._param;
        query.size(param.pageSize);
        if (param._first != null) {
            query.first(param._first);
        }
        else {
            if (param.pageNo == null) {
                param.pageNo = 1;
            }
            query.setPage(param.pageNo);
        }
    }
    /**
    构建查询
    */
    buildQuery() {
        return __awaiter(this, void 0, void 0, function* () {
            var query = new itachi_orm_1.Query();
            var param = this._param;
            if (param == null)
                param = {};
            this._setPage(query);
            var col = this.acqCol();
            if (col) {
                query.col(col);
            }
            if (this._needOrder()) {
                query.order(param.orderBy, param.desc);
            }
            yield this.addOrder(query);
            yield this.addCdt(query);
            yield this.processSchCdt(query);
            return query;
        });
    }
    /**
     * 增加查询条件
     * @param query
     */
    addCdt(query) {
        return __awaiter(this, void 0, void 0, function* () {
            var param = this._param;
            for (var e in param) {
                query.addCdt(yield this.buildCdt(e, param[e]));
            }
        });
    }
    /**
     * 增加排序
     * @param query
     */
    addOrder(query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._orderArray) {
                for (var i = 0; i < this._orderArray.length; i++) {
                    var item = this._orderArray[i];
                    if (item.column != null) {
                        query.addOrder(item.column, item.type);
                    }
                    else {
                        query.addOrder(item);
                    }
                }
            }
        });
    }
    /**
     * 返回默认的查询条件
     */
    acqDefPageSize() {
        return 500;
    }
    /**
     * 处理this._schCdt
     * @param {[type]} query         [description]
     * @yield {[type]} [description]
     */
    processSchCdt(query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._schCdt) {
                if (this._schCdt instanceof Array) {
                    for (var cdt of this._schCdt) {
                        if (!(cdt.clazz == 'BaseCdt')) {
                            if (cdt.col != null) {
                                query.addCdt(new itachi_orm_1.Cdt(cdt.col, cdt.value, cdt.op));
                            }
                            else {
                                query.addCdt(cdt);
                            }
                        }
                        else {
                            query.addCdt(cdt);
                        }
                    }
                }
                else {
                    if (this._schCdt.clazz == 'BaseCdt') {
                        query.addCdt(this._schCdt);
                    }
                    else {
                        for (var e in this._schCdt) {
                            query.addCdt(new itachi_orm_1.Cdt(e, this._schCdt[e]));
                        }
                    }
                }
            }
        });
    }
    getCol(name) {
        if (this._colMap == null)
            return name;
        var ret = this._colMap[name];
        if (ret == null)
            ret = name;
        return ret;
    }
    /**
    返回关联表
    */
    getOp(name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._opMap == null)
                return null;
            return this._opMap[name];
        });
    }
    findByDao(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getDao().find(query);
        });
    }
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            var list = yield this.findByDao(query);
            var processedList = yield this._processList(list);
            if (processedList != null) {
                list = processedList;
            }
            return list;
        });
    }
    findCnt(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getDao().findCnt(query);
        });
    }
    schCnt(map, query) {
        return __awaiter(this, void 0, void 0, function* () {
            var param = this._param;
            map.totalElements = yield this.findCnt(query);
        });
    }
    doExecute() {
        return __awaiter(this, void 0, void 0, function* () {
            this._initPager();
            var query = yield this.buildQuery();
            let map = {};
            map.list = yield this.find(query);
            if (!this._onlySch) {
                yield this.schCnt(map, query);
            }
            else {
                return map;
            }
            this._calPager(map);
            return map;
        });
    }
    /**
     * 计算分页信息
     * @param map
     */
    _calPager(map) {
        if (map.totalElements == null || map.list == null)
            return;
        let param = this._param;
        let totalPages = Math.floor(map.totalElements / param.pageSize);
        if (totalPages * param.pageSize < map.totalElements) {
            totalPages++;
        }
        map.numberOfElements = map.list.length;
        map.totalPages = totalPages;
        if (param.first != null) {
            map.first = (param.first == 0);
            map.last = (param.first + map.list.length >= map.totalElements);
        }
        else {
            map.first = (param.pageNo == null || param.pageNo == 1);
            map.last = (totalPages == param.pageNo);
        }
        map.content = map.list;
        delete map.list;
    }
}
exports.default = ListControl;
