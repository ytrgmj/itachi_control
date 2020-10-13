import Control from './Control';
import { Request, Response } from 'express';
/**
 * 做http 代理
 */
export default abstract class HttpProxyControl extends Control {
    private timezoneServer;
    abstract getKey(): string;
    protected _parseParam(param: any): Promise<any>;
    /**
     * 返回黑名单
     */
    protected getBlackList(): any;
    protected getCheckReqId(): any;
    protected _checkReqIdList(req: any): Promise<{
        error: {
            code: string;
            message: string;
        };
    }>;
    protected _checkBlackList(req: any): boolean;
    protected doExecute(req?: Request, resp?: Response): Promise<any>;
    protected _printProxyLog(message: any): void;
    protected _printAfterSubmit(date: any): void;
    protected _sendResp(resp: any, ret: any): void;
}
