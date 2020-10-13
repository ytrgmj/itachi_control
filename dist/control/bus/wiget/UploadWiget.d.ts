/// <reference types="node" />
import { Wiget, Buffers } from '@dt/itachi_core';
export default class UploadWiget extends Wiget {
    private _buffers;
    private _name;
    private _filename;
    private _state;
    getBuffers(): Buffers;
    addBuffer(buffer: Buffer): void;
    _onBind(): void;
    isFile(): boolean;
    getValue(): string | Buffer;
    askFile(event: any): void;
    askParam(event: any): any;
    add(line: any): void;
    acqState(): BaseUploadState;
}
import BaseUploadState from './state/BaseUploadState';
