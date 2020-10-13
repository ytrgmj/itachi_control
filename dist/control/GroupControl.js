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
const ListControl_1 = __importDefault(require("./ListControl"));
const itachi_orm_1 = require("@dt/itachi_orm");
/**
 * 做group by的control
 */
class GroupControl extends ListControl_1.default {
    /**
     * group 字段
     */
    acqGroup() {
        return null;
    }
    /**
     * 处理当前页数据
     * @param list
     */
    _processPageList(list) {
        return __awaiter(this, void 0, void 0, function* () {
            return list;
        });
    }
    /**
     * 默认分页数
     */
    acqDefPageSize() {
        return 0;
    }
    _needOrder() {
        return false;
    }
    /**
     * 页面排序
     * @param list
     */
    _pageOrder(list) {
        if (!this._needOrder()) {
            var param = this._param;
            if (param.orderBy) {
                itachi_core_1.ArrayUtil.order(list, {
                    order: param.orderBy,
                    desc: param.desc
                });
            }
            if (this._orderArray) {
                var orders = [];
                for (var i = 0; i < this._orderArray.length; i++) {
                    var item = this._orderArray[i];
                    if (item.column != null) {
                        orders.push({ order: item.column, desc: item.type });
                    }
                    else {
                        orders.push({ order: item });
                    }
                }
                itachi_core_1.ArrayUtil.order(list, orders);
            }
        }
    }
    addOrder(query) {
        const _super = Object.create(null, {
            addOrder: { get: () => super.addOrder }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._needOrder()) {
                return;
            }
            return yield _super.addOrder.call(this, query);
        });
    }
    addCdt(query) {
        return __awaiter(this, void 0, void 0, function* () {
            var arrayCdt = this._arrayCdt;
            var param = this._param;
            for (var e in param) {
                if (arrayCdt == null || !itachi_core_1.ArrayUtil.inArray(arrayCdt, e)) {
                    query.addCdt(yield this.buildCdt(e, param[e]));
                }
            }
        });
    }
    buildQuery() {
        const _super = Object.create(null, {
            buildQuery: { get: () => super.buildQuery }
        });
        return __awaiter(this, void 0, void 0, function* () {
            var query = yield _super.buildQuery.call(this);
            var group = this.acqGroup();
            if (group) {
                query.group(group);
            }
            return query;
        });
    }
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            var list = yield this.findByDao(query);
            return list;
        });
    }
    /**
     * 内存过滤
     * @param list
     */
    _filterByArrayCdt(list) {
        return __awaiter(this, void 0, void 0, function* () {
            var arrayCdt = this._arrayCdt;
            if (arrayCdt == null)
                return list;
            var array = [];
            var param = this._param;
            var query = new itachi_orm_1.Query();
            for (var e of arrayCdt) {
                if (param[e] != null) {
                    query.addCdt(yield this.buildCdt(e, param[e]));
                }
            }
            for (var data of list) {
                if (query.isHit(data)) {
                    array.push(data);
                }
            }
            return array;
        });
    }
    doExecute() {
        return __awaiter(this, void 0, void 0, function* () {
            this._initPager();
            var query = yield this.buildQuery();
            var map = {};
            map.list = yield this.find(query);
            var processedList = yield this._processList(map.list);
            if (processedList != null) {
                map.list = processedList;
            }
            map.list = yield this._filterByArrayCdt(map.list);
            if (this._onlySch)
                return map;
            this._pageOrder(map.list);
            yield this.schCnt(map, query);
            this.slice(map);
            if (this._processPageList) {
                var processedList = yield this._processPageList(map.list);
                if (processedList != null) {
                    map.list = processedList;
                }
            }
            this._calPager(map);
            return map;
        });
    }
    /**
     * 搜索数量和值
     * @param map
     * @param query
     */
    schCnt(map, query) {
        return __awaiter(this, void 0, void 0, function* () {
            map.totalElements = map.list.length;
        });
    }
    slice(map) {
        var pager = this.acqPager();
        if (pager != null) {
            map.list = map.list.slice(pager.first, pager.last);
        }
    }
    acqPager() {
        var param = this._param;
        if (!param.pageSize)
            return null;
        var pageNo = 1;
        var len = parseInt(param.pageSize);
        var first;
        if (param._first != null) {
            first = param._first;
        }
        else {
            if (param.pageNo != null) {
                pageNo = parseInt(param.pageNo);
            }
            first = (pageNo - 1) * len;
        }
        var last = first + len;
        return {
            first: first,
            last: last
        };
    }
    /**
     * setPage 注销掉，因为group 必须查询所有数据才知道数量
     * @param query
     */
    _setPage(query) {
    }
}
exports.default = GroupControl;
