import Control from './Control';
import { Request, Response } from 'express';
import UploadFile from './bus/UploadFile';
export default abstract class UploadControl extends Control {
    protected _fileMap: any;
    protected abstract _executeUpload(): any;
    protected _sendResp(resp: any, ret: any): void;
    /**
     * 得到所有的上传文件
     */
    protected _getAllFile(): Array<UploadFile>;
    /**
     * 允许的上传文件扩展名
     */
    protected _getSuffixs(): Array<string>;
    /**
     * 检查扩展名
     */
    protected _checkSuffix(): boolean;
    protected _getContentLen(): number;
    /**
     * 创建长度太大了的返回信息
     */
    protected _createContentTooLong(): string;
    protected doExecute(req?: Request, resp?: Response): Promise<any>;
    execute(req?: Request, resp?: Response): Promise<void>;
    /**
     * 检查
     */
    protected _createWrongSuffix(): string;
    /**
     * 将request转成文件
     * @param req
     */
    protected _parseUpload(req: Request): Promise<any>;
    /**
     * 处理文件分割线
     * @param line
     */
    protected _parse(line: string): string;
    /**
     * 根据文件名获取文件
     * @param key 文件名，为空则只取一个文件
     */
    protected _getFile(key?: any): UploadFile;
    protected _printBeforeLog(): void;
}
