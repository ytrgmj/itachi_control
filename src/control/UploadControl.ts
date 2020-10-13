import {StrUtil,Buffers} from '@dt/itachi_core'
import Control from './Control'
import UploadBus from './bus/UploadBus'
import { Request, Response } from 'express'
import UploadFile from './bus/UploadFile';

export default abstract class UploadControl extends Control{
    protected _fileMap:any;
    protected abstract _executeUpload();
    protected _sendResp(resp,ret){
        resp.send(ret);

    }
    /**
     * 得到所有的上传文件
     */
    protected _getAllFile():Array<UploadFile>{
        var ret = [];
        if(this._fileMap != null){
            for(var e in this._fileMap){
                var file = this._fileMap[e];
                ret.push(file);
            }
        }
        return ret;
    }
    /**
     * 允许的上传文件扩展名
     */
    protected _getSuffixs():Array<string>{
        return ['jpg'];
    }
    /**
     * 检查扩展名
     */
    protected _checkSuffix():boolean{
        var files = this._getAllFile();
        var suffixs = this._getSuffixs();
        if(suffixs==null)
            return;
        for(var file of files){
            var checked = false;
            for(var suffix of suffixs){
                if(StrUtil.end(file.getFilename(),'.'+suffix,true)){
                    checked = true;
                }
            }
            if(!checked)
                return false
        }
        return true;
    }

    protected _getContentLen():number{
        return 10*1000*1000;
    }

    /**
     * 创建长度太大了的返回信息
     */
    protected _createContentTooLong(){
        return "上传的文件长度太大了"
    }

    protected async doExecute(req?: Request, resp?: Response): Promise<any> {
        
        //await this._parseUpload(req)
        if(!this._checkSuffix()){
            return this._createWrongSuffix();
        }
        return await this._executeUpload();
    }


    async execute(req?: Request, resp?: Response){
        let contentLen = this._getContentLen();
        if(contentLen != null ){
            
            
            let len = req.get('Content-Length')
            if(len == null)
                len = req.headers['content-length'];
            
            let num = parseInt(<string>len);
            
            
            
            if(contentLen<num){
                resp.send( this._createContentTooLong())
                return ;
            }
        }
        let param =await  this._parseUpload(req);
       
        if(req['_param'] == null)
            req['_param'] = {};
        for(let e in param){
            
            req['_param'][e] = param[e];
        }
        //console.log('this._param',this._param);
        
        await super.execute(req,resp);
    }

    /**
     * 检查
     */
    protected _createWrongSuffix():string{
        let array = this._getSuffixs();
        let str = array.join('、');
        return `只能上传扩展名是${str}的文件`
    }
    /**
     * 将request转成文件
     * @param req 
     */
    protected async _parseUpload(req:Request){
        var buffers = new Buffers();
        await buffers.readFrom(req);
        var str = this._parse(req.get('Content-Type'))

        var bus = new UploadBus({
            boundary:str
        });
        var opt =await bus.process(buffers);

        
        this._fileMap = opt.files;
        return opt.param;
    }
    /**
     * 处理文件分割线
     * @param line 
     */
    protected _parse(line:string){
        var lines = line.split(';');
        var obj = {};
        for(let line of lines){
            let strs = line.split('=');
            obj[StrUtil.trim(strs[0])] = strs[1];
        }
        return '--'+StrUtil.trim(obj['boundary']);
    }
    /**
     * 根据文件名获取文件
     * @param key 文件名，为空则只取一个文件
     */
    protected _getFile(key?):UploadFile{
        if(this._fileMap==null){
            return null;
        }
        if(key != null){
            return this._fileMap[key];
        }else{
            for(var e in this._fileMap){
                return this._fileMap[e];
            }
        }
    }
    protected _printBeforeLog() {
        this._printLog({});
    }
}
