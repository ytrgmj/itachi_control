/// <reference types="node" />
export default abstract class BaseUploadState {
    protected _wiget: any;
    abstract add(line: Buffer): any;
    constructor(wiget: any);
}
