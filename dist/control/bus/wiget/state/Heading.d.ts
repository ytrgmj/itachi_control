/// <reference types="node" />
import BaseUploadState from './BaseUploadState';
export default class Heading extends BaseUploadState {
    add(lineBufer: Buffer): void;
    _parse(line: string): any;
}
