
import Control from './Control'
import { Dao } from '@dt/itachi_orm';
import { lstat } from 'fs';
/**
 * 处理单条数据
 */
export default abstract class DataControl extends Control{
    protected abstract _getNeedParamKey():Array<string>;
    protected abstract getDao():Dao;
    async doExecute(){
        let list = await this._findDatas();
        if(list.length != 2){
            throw this._createError();
        }
        let sort = list[0].sort;
        list[0].sort = list[1].sort;
        list[1].sort = sort;
        await this._update(list)
    }

    protected async  _update(list:Array<any>){
        let idCol = this._getIdCol();
        let array = list.map((data)=>({
            [idCol]:data[idCol],
            sort:data.sort
        }))
        let dao = this.getDao();
        await dao.updateArray(array);
    }

    _createError(){
        return new Error('对应的数据不存在');
    }

    async _findDatas():Promise<Array<any>>{
        var dao = this.getDao();
        var query = {};
        var param = this._param;
        let keys = this._getNeedParamKey();
        for(let key of keys){
            query[key] = param[key]
        }
        query[this._getIdCol()] = [param.begin_id,param.end_id];
        return await dao.find(query);
    }

    protected _getIdCol(){
        let dao = this.getDao();
        return dao.getTableName()+"_id"
    }


    


}