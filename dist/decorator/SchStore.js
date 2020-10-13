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
function default_1() {
    return function classDecorator(constructor) {
        return class extends constructor {
            buildQuery() {
                const _superIndex = name => super[name];
                return __awaiter(this, void 0, void 0, function* () {
                    var query = yield _superIndex('buildQuery').call(this);
                    let param = this['_param'];
                    if (param != null) {
                        let token = param._token;
                        if (token != null) {
                            let store_ids = null;
                            if (token.store_id_array != null)
                                store_ids = token.storeIdArray;
                            if (token.store_id != null)
                                store_ids = [token.storeId];
                            if (store_ids != null) {
                                query.in('store_id', store_ids);
                            }
                        }
                    }
                    return query;
                });
            }
        };
    };
}
exports.default = default_1;
