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
class UploadBus extends itachi_core_1.AsyncBus {
    process(buffers) {
        return __awaiter(this, void 0, void 0, function* () {
            var n = 0;
            while ((n = buffers.indexOf('\r\n')) != -1) {
                this.add(buffers.readTo(n + 2));
            }
            this.add(buffers.readTo());
            var param = yield this.getFromEvent(new AskParam_1.default());
            var files = yield this.getFromEvent(new AskFile_1.default());
            return {
                param: param,
                files: files
            };
        });
    }
    add(line) {
        let opt = this._opt;
        if (itachi_core_1.StrUtil.start(line.toString(), opt.boundary)) {
            this._closeWiget();
        }
        this.getWiget().add(line);
    }
    _closeWiget() {
        this._wiget = null;
    }
    getWiget() {
        if (this._wiget == null) {
            this._wiget = new UploadWiget_1.default(this._opt);
            this._wiget.bind(this);
        }
        return this._wiget;
    }
}
exports.default = UploadBus;
const UploadWiget_1 = __importDefault(require("./wiget/UploadWiget"));
const AskParam_1 = __importDefault(require("./event/AskParam"));
const AskFile_1 = __importDefault(require("./event/AskFile"));
