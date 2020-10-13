


/**
 * 控制层父亲类
 */
import { LogHelp, Context, Bean } from '@dt/itachi_core'
import { Request, Response } from 'express'
import _ from 'lodash'
import underlineHump from '../util/underlineHump'
import BaseChecker from '../checker/BaseChecker';
import dateConvert from '../util/dateConvert';


export default class Control {
    protected _param: any = null;
    protected _req: any = null;
    protected _resp: any = null;
    protected _context: Context = null;


    getContext():Context{
        return this._context;
    }

    /**
     * 返回这次操作的名称
     */
    protected _getName(): string {
        return null;
    }

    /**
     * 数组需要的key列表
     */
    protected _getNeedArrayKeys():Array<string>{
        return null;
    }
    /**
     * 检查数组形式
     * @param param 
     */
    protected _checkArray(param){
        let array = param.array;
         
        if(array != null){
            let keys = this._getNeedArrayKeys();
            if(keys == null)
                return;
            for(let data of array){
                for(let key of keys){
                    if(data[key] == null || data[key]===''){
                        throw new Error(`数组缺少参数${key}`);
                    }
                }
            }
        }
    }

    protected getCheckers():Array<BaseChecker>{
        return null
    }
    /**
     * 检查输入参数是否正确
     */
    protected async  _checkParam(param) {
        let needParam = this._getNeedParamKey();
        if (needParam != null) {
            for (let key of needParam) {
                if (param[key] == null || param[key]==='') {
                    throw new Error(`缺少参数${key}`);
                }
            }
        }
        let checkers = this.getCheckers();
        if(checkers != null){
            for(let checker of checkers){
                await checker.check(param);
            }
        }
    }

    protected _getNeedParamKey(): Array<string> {
        return null;
    }


    setContext(context) {
        this._context = context;
    }
    protected _initLogger(req) {
        if (this._context != null) {
            let logger: LogHelp = this._context.getLogger('web');
            let url: string = req.baseUrl + req.url;
            logger.set({ url })
            Control.setLoggerParams(logger, this._param);
            var name = this._getName();
            logger.set({ name })

        }
    }
    protected _getLogger(): LogHelp {

        if(this._context != null)
            return this._context.getLogger('web');
        return new LogHelp();
    }
    protected _printLog(...message) {
        
        let logger = this._getLogger();
        logger.info(message);

    }

    protected _printBeforeLog() {
        this._printLog(this._param);
    }

    protected _printEndLog(time: number) {
        this._printLog(time)
    }

    async execute(req: Request, resp: Response) {
        this._req = req;
        this._resp = resp;
        this._param = req['_param'];
        if (this._param == null)
            this._param = {};
        let ret;
        let begin = new Date();
        try {
            await Control.initBefore(this._context, this._param, req);

            this._initLogger(req);
            this._printBeforeLog()
            await this._checkParam(this._param);
            await this._checkArray(this._param);
            ret = await this.doExecute(req,resp);
            
            this._sendResp(resp,ret);
            this._printEndLog(new Date().getTime()-begin.getTime());
        }catch(e){
            this._sendError(resp,e);
            this._printErrorLog(e);
        }

    }

    protected _sendError(resp,e){
        var code = e.code;
        if (code == null)
            code = -1;
        var errorData = {
            code,
            status: e.status,
            message: e.message,
            data: e.data

        }
        resp.send({
            error: errorData
        })
    }


    private _printErrorLog(error: Error) {
        let logger = this._getLogger();
        logger.error(error);
    }

    protected _sendResp(resp, ret) {
        if (ret == null) {
            resp.send({result:{}});
        } else {
            const res = this._processRet(ret)
            resp.send({
                result: res
            });
        }
    }
    
    protected _processRet(ret: any): any{
        try {
            let res = underlineHump(ret)
            res = dateConvert(res);
            return res 
        } catch (error) {
            return ret 
        }
    }

    protected async doExecute(req?: Request, resp?: Response): Promise<any> {

    }

    async executeParam(param:any){
        this._param = param;
        return await this.doExecute();
    }

    buildControl(controlClazz):Control{
        let ctrl = new controlClazz()
        let context = this._context;
        if(context != null){
            if(ctrl.setContext){
                ctrl.setContext(context);
            }
            context.assembly([ctrl]);
        }
        return ctrl;
    }

    private static logKeys = [];

    private static initBeforeFuns = [];


    static addBeforeFuns(fun: Function) {
        Control.initBeforeFuns.push(fun);
    }
    private static async initBefore(context: Context, param: any, req: Request) {
        let initBeforeFuns = Control.initBeforeFuns;
        if (initBeforeFuns.length > 0) {
            for (var fun of initBeforeFuns) {
                await fun(context, param, req)
            }
        }
    }


    static setLogKeys(logKeys: Array<string>) {
        Control.logKeys = logKeys;
    }

    private static setLoggerParams(logger: LogHelp, param: any) {
        if (logger == null || param == null) {
            return;
        }
        var obj = {};
        for (var logKey of Control.logKeys) {
            if (param[logKey] != null) {
                obj[logKey] = param[logKey]
            }
        }
        logger.set(obj);
    }

    private static errorDomain:string;

    static setErrorDomain(key:string){
        Control.errorDomain = key;
    }

    static getErrorDomain(){
        return Control.errorDomain;
    }
}
import { RedisServer } from '../ctrl';