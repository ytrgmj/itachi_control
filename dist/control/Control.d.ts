/**
 * 控制层父亲类
 */
import { LogHelp, Context } from 'itachi_core';
import { Request, Response } from 'express';
import BaseChecker from '../checker/BaseChecker';
export default class Control {
    protected _param: any;
    protected _req: any;
    protected _resp: any;
    protected _context: Context;
    getContext(): Context;
    /**
     * 返回这次操作的名称
     */
    protected _getName(): string;
    /**
     * 数组需要的key列表
     */
    protected _getNeedArrayKeys(): Array<string>;
    /**
     * 检查数组形式
     * @param param
     */
    protected _checkArray(param: any): void;
    protected getCheckers(): Array<BaseChecker>;
    /**
     * 检查输入参数是否正确
     */
    protected _checkParam(param: any): Promise<void>;
    protected _getNeedParamKey(): Array<string>;
    setContext(context: any): void;
    protected _initLogger(req: any): void;
    protected _getLogger(): LogHelp;
    protected _printLog(...message: any[]): void;
    protected _printBeforeLog(): void;
    protected _printEndLog(time: number): void;
    execute(req: Request, resp: Response): Promise<void>;
    protected _sendError(resp: any, e: any): void;
    private _printErrorLog;
    protected _sendResp(resp: any, ret: any): void;
    protected _processRet(ret: any): any;
    protected doExecute(req?: Request, resp?: Response): Promise<any>;
    executeParam(param: any): Promise<any>;
    buildControl(controlClazz: any): Control;
    private static logKeys;
    private static initBeforeFuns;
    static addBeforeFuns(fun: Function): void;
    private static initBefore;
    static setLogKeys(logKeys: Array<string>): void;
    private static setLoggerParams;
    private static errorDomain;
    static setErrorDomain(key: string): void;
    static getErrorDomain(): string;
}
