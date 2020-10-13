import GroupControl from './GroupControl'

/**
 * 通过searcher的方法查询的
 */
export default abstract class extends GroupControl{
    protected _schKey:string;
    protected getDao(){
        return null;
    }

    protected getSearcher(){
        let tableName = this.getTableName();
        if(tableName == null)
            throw new Error('tablename is null');
        let context = this.getContext();
        return context.get(tableName + 'searcher');
    }
    protected getTableName():string{
        return null;
    }

    abstract getFunName():string;

    protected async find() {
        let searcher = this.getSearcher();
        let funName = this.getFunName();

        var list = await searcher[funName](this._parseSearchParam())
    
        return list
    }

    protected _parseSearchParam(){
        if(this._schKey == null){
            return this._param
        }
        return this._param[this._schKey];
    }
}