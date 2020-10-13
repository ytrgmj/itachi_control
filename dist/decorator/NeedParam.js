"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(keys) {
    return function classDecorator(constructor) {
        return class extends constructor {
            _getNeedParamKey() {
                let fun = constructor.prototype._getNeedParamKey;
                let array = fun.apply(this);
                if (keys == null)
                    return array;
                if (array == null) {
                    array = keys;
                }
                else {
                    array.push(...keys);
                }
                return array;
            }
        };
    };
}
exports.default = default_1;
