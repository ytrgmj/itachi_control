/**
 * 检查类的父类
 */
import BaseCheckerOpt from './opt/BaseCheckerOpt'

 
export default abstract class BaseChecker{
    protected _opt:any = null;
    constructor(opt){
        this._opt = this._initOpt(opt);
    }

    abstract async _check(val,col?,param?);

    abstract async _createMsg(val,col?);

    
    _initOpt(opt){
        return opt;
    }
    protected async  _createError(param,col:string){
        return new Error(this._createMsg(param[col],col));
    }

    _getCols():Array<string>{
        let opt = this._opt;
        if(opt.cols != null){
            return opt.cols;
        }
        if(opt.col != null)
            return [opt.col]
        return null;
    }
    


    async check(param){
        let cols = this._getCols();
        if(cols != null){
            for(let col of cols){
                if(!(await this._check(param[col],col,param))){
                    throw  await this._createError(param,col);
                };
            }
        }
    }
}