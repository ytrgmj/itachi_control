import {ArrayUtil} from 'itachi_core'
import ListControl from './ListControl'
import { Query, BaseCdt ,Cdt} from 'itachi_orm'

/**
 * 做group by的control
 */
export default abstract class GroupControl extends ListControl{
    /**
     * 内存查询的列
     */
    protected _arrayCdt:Array<string>;
    /**
     * group 字段
     */
    protected acqGroup():Array<string> {
        return null
    }
    /**
     * 处理当前页数据
     * @param list 
     */
    protected async _processPageList(list:Array<any>):Promise<Array<any>>{
        return list;
    }
    /**
     * 默认分页数
     */
    protected acqDefPageSize() {
        return 0
    }

    protected _needOrder():boolean{
        return false;
    }
    /**
     * 页面排序
     * @param list 
     */
    protected _pageOrder(list) {
        if (!this._needOrder()) {
            var param = this._param
            if (param.orderBy) {
                ArrayUtil.order(list, {
                    order: param.orderBy,
                    desc: param.desc
                })
            }  
            
            if (this._orderArray) {
                var orders = []
                for (var i = 0; i < this._orderArray.length; i++) {
                    var item = this._orderArray[i]
                    if (item.column != null) {
                        orders.push({order:item.column, desc:item.type})
                    } else {
                        orders.push({order:item})
                    }
                }
                ArrayUtil.order(list,orders);
            }
    
        }
    }
    async addOrder(query:Query) {
        if(!this._needOrder()){
            return 
        }
        return await super.addOrder(query);
    }
    

    protected async addCdt(query:Query){
        var arrayCdt = this._arrayCdt;
        var param = this._param;
        for(var e in param){
            if (arrayCdt == null || !ArrayUtil.inArray(arrayCdt, e)) {
                query.addCdt(await this.buildCdt(e,param[e]));
            }
        }
    }
    async buildQuery() {
        var query = await super.buildQuery();
        var group = this.acqGroup()
        if (group) {
            query.group(group)
        }
    
        return query
    }
    protected async find(query:Query) {
        var list = await this.findByDao(query)
    
        return list
    }
    /**
     * 内存过滤
     * @param list 
     */
    protected  async _filterByArrayCdt(list) {
        var arrayCdt = this._arrayCdt;
        if (arrayCdt == null)
            return list;
        var array = [];
        var param = this._param;
        var query = new Query();
        for (var e of arrayCdt) {
            if (param[e] != null) {
                query.addCdt(await this.buildCdt(e,param[e]));
            }
        }
        for(var data of list){
            if(query.isHit(data)){
                array.push(data);
            }
        }
        return array;
  
    }
    protected async doExecute() {
        this._initPager()
        var query = await this.buildQuery()
        var map:any = {}
    
        map.list = await this.find(query)
    
        
        var processedList = await this._processList(map.list)
        if (processedList != null) {
            map.list = processedList
        }
       
    
        map.list = await this._filterByArrayCdt(map.list);
        if (this._onlySch)
            return map;
        this._pageOrder(map.list)
        await this.schCnt(map, query)
    
        this.slice(map)
    
        if (this._processPageList) {
            var processedList = await this._processPageList(map.list)
            if (processedList != null) {
                map.list = processedList
            }
        }
        this._calPager(map)
        return map
    }
    /**
     * 搜索数量和值
     * @param map 
     * @param query 
     */
    protected async schCnt(map, query) {
        map.totalElements = map.list.length
    }
    slice(map) {
        var pager = this.acqPager()
        if (pager != null) {
            map.list = map.list.slice(pager.first, pager.last)
        }
    }
    acqPager() {
      
        var param = this._param
        if (!param.pageSize) return null
        var pageNo = 1;
        var len = parseInt(param.pageSize);
        var first;
        if (param._first != null) {
            first = param._first
        } else {
            if (param.pageNo != null) {
              pageNo = parseInt(param.pageNo)
            }
            first = (pageNo - 1) * len
        }
        var last = first + len
        return {
            first: first,
            last: last
        }
    }

    /**
     * setPage 注销掉，因为group 必须查询所有数据才知道数量
     * @param query 
     */
    protected _setPage(query:Query){

    }
    
}