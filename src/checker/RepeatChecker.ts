/**
 * 重复检查
 */
import {Query,BaseCdt} from '@dt/itachi_orm';

import BaseChecker from './BaseChecker';

interface RepeatCheckerOpt{
    /**
     * 上下文
     */
    context:Context
    /**
     * 检查属性 默认name
     */
    col?:string
    /**
     * 错误号
     */
    code:string
    /**
     * 其他条件
     */
    otherCdt?:any
    /**
     * 表格名称
     */
    key:string
    /**
     * 检查array字段
     */
    isArray?:boolean
}
export default class RepeatChecker extends BaseChecker{
    _opt:any;
    constructor(opt:RepeatCheckerOpt){
        super(opt);
        this._opt = opt;
    }

    _initOpt(opt){
        if(opt.col == null)
            opt.col = 'name';
        return opt;
    }
    _createMsg(){
        return null;
    }
    async _createError(param,col){
        let opt = this._opt;
        let context  = this.getContext();
        let key = Control.getErrorDomain();
        if(key != null){
            let domain:any = context.get(key);
            return await domain.createError(opt.code,{[col]:param[col]})
        }else{
            return new Error(`${col}重复`);
        }

    }

    getContext():Context{
        return this._opt.context;
    }

    async check(param){
        let opt:RepeatCheckerOpt = this._opt;
        if(!opt.isArray){
            await super.check(param)
        }else{
            let array = param.array;
            if(array == null || array.length==0){
                return ;
            }
            
            let map = ArrayUtil.toMapArray(array,this.getCol());
            for(let e in map){
                if(map[e].length>1){
                    throw await this._createError(map[e][0],this.getCol())
                }
            }
            await this.checkAdd(param);
            await this.checkUpdate(param);
        }
    }
    async checkUpdate(param){
        let array = param.array;
        let col= this.getCol()
        if(array != null)
            array = ArrayUtil.filter(array,(data)=>{
               return data[this.getIdCol()] != null && data[col] != null;
            })
        if(array.length==0)
            return;
        let names = ArrayUtil.toArray(array,this.getCol())

        
        let query = new Query().in(this.getCol(),names);
        query.addCdt(BaseCdt.parse(this._opt.otherCdt));
        let dao = this.getDao();
        let list = await dao.find(query);
        
        let datas = ArrayUtil.notInByKey(list,array,this.getIdCol());

        
        if(datas.length>0){
            throw await this._createError(datas[0],this.getCol());
        }
    }

    protected getIdCol(){
        return this._opt.key+'_id';
    }

    async checkAdd(param){
        let array = param.array;
        if(array != null)
            array = ArrayUtil.filter(array,(data)=>!data[this.getIdCol()])
        if(array.length==0)
            return;
        
        let names = ArrayUtil.toArray(array,this.getCol())
        let query = new Query().in(this.getCol(),names);
        query.addCdt(BaseCdt.parse(this._opt.otherCdt));
        let dao = this.getDao();
        let list = await dao.find(query);
        if(list.length>0){
            throw await this._createError(list[0],this.getCol());
        }
    }

    getDao(){
        let opt = this._opt;
        let context =  this.getContext();
        let dao:Dao = context.get(opt.key+'dao');
        return dao
    }
    async _check(value,col,param){
        if(col != this.getCol())
            return true;
        let dao = this.getDao();
        let query = this._buildQuery(value,col,param)
        return await dao.findOne(query) == null;
    }

    protected _buildQuery(value,col,param){
        let opt = this._opt;
        let query = new Query({
            [col]:value            
        })
        let otherCdt = opt.otherCdt;
        query.addCdt(BaseCdt.parse(otherCdt));
        let idCol = opt.key +'_id';
        let id = param[idCol];
        if(id != null)
            query.notEq(idCol,id)
        return query;
    }

    getCol(){
        let opt = this._opt;
        if(opt.col == null)
            return 'name';
        return opt.col;
    }
    
    
}
import Control from '../control/Control';
import {Dao} from '@dt/itachi_orm'
import { Context, ArrayUtil } from '@dt/itachi_util';
