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
const ListControl_1 = __importDefault(require("./ListControl"));
/**
 * 还是一个查询，查出来空会运行processInit 方法
 */
class InitListControl extends ListControl_1.default {
    doExecute() {
        return __awaiter(this, void 0, void 0, function* () {
            this._initPager();
            var query = yield this.buildQuery();
            let map = {};
            map.list = yield this.find(query);
            if (yield this._needInit(map.list)) {
                let initRet = yield this.processInit();
                //如果运行了初始化
                if (initRet) {
                    map.isInit = initRet;
                    map.list = yield this.find(query);
                }
            }
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
     * 是否需要初始化
     * @param list
     */
    _needInit(list) {
        return __awaiter(this, void 0, void 0, function* () {
            return list.length == 0;
        });
    }
}
exports.default = InitListControl;
