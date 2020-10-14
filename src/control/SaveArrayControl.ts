/**
 * 适合保存多条数据的
 */
import {Dao,SyncData} from 'itachi_orm'
import {ArrayUtil} from 'itachi_core'
import Control from './Control'


export default abstract class SaveArrayControl extends Control{
    abstract getTableName():string;

    protected getDao():Dao{
        return this._context.get(this.getTableName()+'dao');
    }

    protected getIdCol(){
        return this.getTableName()+'_id'
    }

    protected getNoCol(){
        return this.getTableName()+'_no'
    }

    protected async doExecute(){
        let addArray = this._findAddArray();
        let updateArray = this._findUpdateArray()
        await this._add(addArray);
        await this._update(updateArray)

    }

    protected _findAddArray(){
        let array = this._param.array;
        let idCol = this.getIdCol();
        return ArrayUtil.filter(array,(data)=>(data[idCol]==null))
    }
    protected getNoUpdateCols(){
        return [
            'add_user',
            'modify_user',
            'add_time',
            'modify_time',
            'sys_add_time',
            'sys_modify_time',
            this.getNoCol()
        ]
    }
    protected _findUpdateArray(){
        let array = this._param.array;
        let idCol = this.getIdCol();
        
        let retArray = ArrayUtil.filter(array,(data)=>(data[idCol]!=null ))
        let noUpdateCols = this.getNoUpdateCols();
        for(let row of retArray){
            for(let noUpdateCol of noUpdateCols){
                delete row[noUpdateCol]
            }
        }
        return retArray;
    }
    protected async _add(array){
        let param = this._param;
        if(array != null && array.length>0){
            let keys = this._getNeedParamKey();
            let dao = this.getDao();
            for(let obj of array){
                for(let key of keys){
                    obj[key] = param[key];
                }
            }
            await dao.addArray(array);
        }
    }
    protected async _update(array){
        
        
        if(array != null && array.length==0)
            return ;
        let param = this._param;
        let cdt = {};
        let keys = this._getNeedParamKey();
        for(let key of keys){
            cdt[key] = param[key]
        }
        let dao = this.getDao();
        await dao.updateArray(array,null,cdt);
        let syncData= this.getSyncData();
        if(syncData != null){
            await syncData.syncData(
                await dao.findByIds(ArrayUtil.toArray(array,this.getIdCol()))
            )
        }
    }

    protected getSyncData():SyncData{
        return null;
    }
    
}