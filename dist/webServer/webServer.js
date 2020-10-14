"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const buildParam_1 = __importDefault(require("./wiget/buildParam"));
const Socket_1 = __importDefault(require("../webSocket/Socket"));
const loadRouter_1 = __importDefault(require("./wiget/loadRouter"));
function init(opt) {
    if (opt == null)
        opt = {};
    if (opt.port == null) {
        opt.port = 8080;
    }
    return opt;
}
function createFun(clazz) {
    return function (req, resp) {
        var ctrl = new clazz();
        ctrl.execute(req, resp);
    };
}
function initApp(app, opt) {
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({
        extended: true
    }));
    app.use('/debug/health', function (req, resp) {
        resp.send({});
    });
    app.use(cors_1.default({ maxAge: 600 }));
    app.use(buildParam_1.default(opt));
    if (opt.mids) {
        var mids = opt.mids;
        for (var mid of mids) {
            app.use(mid);
        }
    }
}
function addRouters(app, opt) {
    var routers = opt.routers;
    if (routers == null)
        return;
    for (var router of routers) {
        var { key, fun, ctrl } = router;
        if (fun == null) {
            fun = createFun(ctrl);
        }
        app.use('/' + key, fun);
    }
}
function default_1(opt) {
    opt = init(opt);
    var app = express_1.default();
    app.disable('x-powered-by');
    var apiPort = opt.port;
    initApp(app, opt);
    loadRouter_1.default(app, opt);
    addRouters(app, opt);
    var server = app.listen(apiPort, function () {
        var host = server.address();
        console.log(`app listening at ${apiPort}`);
    });
    if (opt.webSocket) {
        Socket_1.default.listen(server);
    }
    app.disable('x-powered-by');
    return app;
}
exports.default = default_1;
