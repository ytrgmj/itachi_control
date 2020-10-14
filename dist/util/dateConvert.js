"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const itachi_core_1 = require("itachi_core");
function process(data, key, val) {
    if (val != null && val instanceof Date) {
        data[key] = itachi_core_1.DateUtil.formatDate(val);
    }
    if (val == null) {
        delete data[key];
    }
}
exports.default = itachi_core_1.BeanUtil.eachFun(process);
