import {ConfigFac,BeanUtil,BaseHttpEntry,HttpEntryFac, TimezoneServer, Bean} from 'itachi_core'
import {DateUtil} from 'itachi_core'
import Control from './Control'
import { Request, Response } from 'express'
import findIndex from 'lodash.findindex'
import RedisServer from '../redis/RedisServer'


/**
 * 做http 代理
 */
export default abstract class HttpProxyControl extends Control{
    @Bean()
    private timezoneServer:TimezoneServer;
    abstract  getKey():string;
    protected async _parseParam(param){
        return param;
    }
    /**
     * 返回黑名单
     */
    protected getBlackList(){
        return null;
    }

    protected getCheckReqId() {
        return null;
    }

    protected async _checkReqIdList(req) {
        let reqIdList = this.getCheckReqId();
        
        if(reqIdList == null)
            return null;

        const hit =(findIndex(reqIdList,
            function (url) { return req.originalUrl.indexOf(url) > -1 }) > -1)

        if (hit) {
            // 然后返回锁的信息
            const redisServer:RedisServer =  this._context.get("redisServer")
            const baseUrl = req.originalUrl;
            const requestId = req.headers.requestId || req.headers.requestid;

            if (requestId == null) return {
                "error": {
                    "code": "requestId_IsNul",
                    "message":  'requestId not allow null'
                }
            }
        
            const key = `${baseUrl}-${requestId}`;
        

            const lock =  await redisServer.lock(key, "", 15 * 60)

            if (lock !== true) return {
                "error": {
                    "code": "requestId_Repeat",
                    "message":  'same url requestId not allow repeat'
                }
            }
        }

        return null
    }

    protected _checkBlackList(req){
        let blackList = this.getBlackList();
        
        if(blackList == null)
            return true;
        
        let token = this._param._token;
        
        if(token == null){
            
            
            if ((findIndex(blackList,
                 function (url) { return req.originalUrl.indexOf(url) > -1 }) > -1)) {
                return false;
            }
        }
        return true;
    }
    protected async doExecute(req?: Request, resp?: Response): Promise<any> {

        if(!this._checkBlackList(req)){
            resp.status(401);
            
            return {
                "error": {
                    "code": "TOKEN_ERROR",
                    "message":  'http proxy control token error'
                }
            };
        };
        
        
        const checkError = await this._checkReqIdList(req)

        if (checkError !== null) {
            resp.status(200);
            return checkError;
        }
        let key = this.getKey();
    
        var path = req.path;
        var httpConfig = ConfigFac.get('httpconfig')
        var opt = httpConfig[key];
        opt = BeanUtil.shallowCombine(opt,{path});
        
        var param = this._param
        
        param = await this._parseParam(param) 
        let headers:any = req.headers;

        //let headers = {};
        headers['Accept'] = "application/json";

        headers['accept'] = "application/json";
        headers['cache-control'] = "no-cache";
        delete headers['host']

        if (this._context !=null) {
            headers['context_id']= this._context.getId();
        }

        for(var e in headers){
            if("content-length".toLowerCase() == e.toLowerCase() && req.method.toLowerCase() != 'get'){
                delete headers[e];
            }

        }
        if(param._token){
            headers["_token"] = JSON.stringify(param._token);

            delete param._token;
        }
        
        if(this.timezoneServer)
            headers['storetime'] = DateUtil.formatDate(this.timezoneServer.getDate())
        
        opt.headers = headers;
        //console.log('opt',JSON.stringify(opt,null,4));
        this._printProxyLog(opt);
        let http = HttpEntryFac.get(req.method,opt)
        //param._url = req.url;
        let date = new Date();
        let ret = await http.submit(param);
        this._printProxyLog(param);
        this._printAfterSubmit(date)
        return ret;
        
    }
    protected _printProxyLog( message){
       
        let context = this.getContext();
        if(context == null){
            return ;
        }
        let logger  = context.getLogger('proxy')
        logger.info(message);
    }
    protected _printAfterSubmit(date){
        if(date == null){
            return ;
        }
        let context = this.getContext();
        if(context == null){
            return ;
        }
        let logger  = context.getLogger('proxy')
        logger.info(new Date().getTime()-date.getTime());
    }


    protected _sendResp(resp, ret) {
        if (ret == null) {
            resp.send({});
        } else {
           
            resp.send(ret);
        }
    }
}
