"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const itachi_core_1 = require("itachi_core");
/**
 截取mocker
*/
function createFun(clazz, opt) {
    if (clazz.default) {
        //兼容ts的export
        clazz = clazz.default;
    }
    return function (req, resp) {
        var ctrl = new clazz();
        if (opt.context) {
            var context = opt.context;
            if (req.headers.context_id != null) {
                context.setId(req.headers.context_id);
            }
            var childContext = context.buildChild();
            if (ctrl.setContext) {
                ctrl.setContext(childContext);
            }
            childContext.assembly([ctrl]);
        }
        ctrl.execute(req, resp);
    };
}
function loadFromWebPath(app, opt) {
    if (opt.webPath == null)
        return;
    var map = {};
    function _get(key) {
        var router = map[key];
        if (router == null) {
            router = express_1.Router();
            map[key] = router;
        }
        return router;
    }
    function _parseDir(dir, webPath) {
        var dirPath = path_1.default.join(webPath, dir);
        var stat = fs_1.default.statSync(dirPath);
        if (stat.isFile()) {
            return;
        }
        else {
            var files = fs_1.default.readdirSync(dirPath);
            for (var file of files) {
                var filePath = path_1.default.join(webPath, dir, file);
                var filePathStat = fs_1.default.statSync(filePath);
                if (!filePathStat.isFile()) {
                    continue;
                }
                let extName = path_1.default.extname(file);
                if (extName == '.js' || (extName == '.ts' && file.indexOf('.d.') == -1)) {
                    var clazz = require(filePath);
                    if (clazz.default) {
                        clazz = clazz.default;
                    }
                    var routerName = clazz.router;
                    if (routerName) {
                        console.log('routerName', routerName);
                        if (routerName.length > 0 && routerName[0] !== '/') {
                            routerName = '/' + routerName;
                        }
                    }
                    else {
                        file = itachi_core_1.StrUtil.firstLower(path_1.default.basename(file, extName));
                        routerName = '/' + file;
                    }
                    var router = _get(dir);
                    router.all(routerName, createFun(clazz, opt));
                }
            }
        }
    }
    var dirs = fs_1.default.readdirSync(opt.webPath);
    for (var dir of dirs) {
        _parseDir(dir, opt.webPath);
    }
    for (var e in map) {
        app.use('/' + e, map[e]);
    }
}
//自动生成
function loadRouter(app, opt) {
    loadFromWebPath(app, opt);
}
exports.default = loadRouter;
