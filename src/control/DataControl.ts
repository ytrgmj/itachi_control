
import Control from './Control'
import { Dao } from 'itachi_orm';
/**
 * 处理单条数据
 */
export default abstract class DataControl extends Control{
    protected abstract _processData(data):Promise<any>;
    protected abstract _getNeedParamKey():Array<string>;
    protected abstract getDao():Dao;
    async doExecute(){
        let data = await this._findData();
        if(data == null){
            throw this._createError();
        }
        return await this._processData(data);
    }

    _createError(){
        return new Error('对应的数据不存在');
    }

    async _findData():Promise<any>{
        var dao = this.getDao();
        var query = {};
        var param = this._param;
        let keys = this._getNeedParamKey();
        for(let key of keys){
            query[key] = param[key]
        }
        return await dao.findOne(query);
    }


    


}