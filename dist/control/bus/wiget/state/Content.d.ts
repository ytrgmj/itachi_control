/// <reference types="node" />
import BaseUploadState from './BaseUploadState';
export default class Content extends BaseUploadState {
    private _cnt;
    add(line: Buffer): void;
    substring(buffer: Buffer, begin: any, end: any): "" | Buffer;
}
