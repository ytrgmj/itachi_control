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
const humpUnderline_1 = __importDefault(require("../../util/humpUnderline"));
function buildParam(params) {
    const goesTohumpOpen = params.goesTohumpOpen;
    function inArray(req, notNeedList) {
        if (notNeedList != null) {
            for (let i = 0; i < notNeedList.length; i++) {
                let url = req.baseUrl + req.path;
                if (url.toLowerCase().indexOf(notNeedList[i].toLowerCase()) !== -1) {
                    return true;
                }
            }
        }
        return false;
    }
    return function (req, resp, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var param;
            if (req.method == 'GET') {
                param = req.query;
                if (param == null) {
                    param = {};
                }
            }
            else {
                param = req.body;
                if (param == null) {
                    param = {};
                }
                if (req.query) {
                    for (var k in req.query) {
                        if (req.query[k]) {
                            param[k] = req.query[k];
                        }
                    }
                }
            }
            if (goesTohumpOpen && !inArray(req, params.notTohumpList)) {
                req._param = humpUnderline_1.default(param);
            }
            else {
                req._param = param;
            }
            next();
        });
    };
}
exports.default = buildParam;
