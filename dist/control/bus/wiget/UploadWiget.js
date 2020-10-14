"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const itachi_core_1 = require("itachi_core");
class UploadWiget extends itachi_core_1.Wiget {
    getBuffers() {
        if (this._buffers == null) {
            this._buffers = new itachi_core_1.Buffers();
        }
        return this._buffers;
    }
    addBuffer(buffer) {
        this.getBuffers().add(buffer);
    }
    _onBind() {
        this.on(new AskFile_1.default());
        this.on(new AskParam_1.default());
    }
    isFile() {
        return this._filename != null;
    }
    getValue() {
        var buffers = this.getBuffers();
        if (this.isFile() && this._name != null) {
            let buffer = buffers.toBuffer();
            return buffer;
        }
        else {
            return buffers.toString();
        }
    }
    askFile(event) {
        if (this.isFile() && this._name != null) {
            event.add(this._name, new UploadFile_1.default({
                filename: this._filename,
                buffer: this.getValue()
            }));
        }
    }
    askParam(event) {
        if (!this.isFile() && this._name != null) {
            event.add(this._name, this.getValue());
        }
    }
    add(line) {
        this.acqState().add(line);
    }
    acqState() {
        if (this._state == null) {
            this._state = new Heading_1.default(this);
        }
        return this._state;
    }
}
exports.default = UploadWiget;
const AskFile_1 = __importDefault(require("../event/AskFile"));
const AskParam_1 = __importDefault(require("../event/AskParam"));
const UploadFile_1 = __importDefault(require("../UploadFile"));
const Heading_1 = __importDefault(require("./state/Heading"));
