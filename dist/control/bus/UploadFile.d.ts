/// <reference types="node" />
export default class UploadFile {
    _opt: any;
    constructor(opt: any);
    /**
     * 得到流
     */
    getBuffer(): Buffer;
    /**
     * 得到文件名
     */
    getFilename(): string;
}
