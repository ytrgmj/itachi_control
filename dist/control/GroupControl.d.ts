import ListControl from './ListControl';
import { Query } from 'itachi_orm';
/**
 * 做group by的control
 */
export default abstract class GroupControl extends ListControl {
    /**
     * 内存查询的列
     */
    protected _arrayCdt: Array<string>;
    /**
     * group 字段
     */
    protected acqGroup(): Array<string>;
    /**
     * 处理当前页数据
     * @param list
     */
    protected _processPageList(list: Array<any>): Promise<Array<any>>;
    /**
     * 默认分页数
     */
    protected acqDefPageSize(): number;
    protected _needOrder(): boolean;
    /**
     * 页面排序
     * @param list
     */
    protected _pageOrder(list: any): void;
    addOrder(query: Query): Promise<void>;
    protected addCdt(query: Query): Promise<void>;
    buildQuery(): Promise<Query>;
    protected find(query: Query): Promise<any[]>;
    /**
     * 内存过滤
     * @param list
     */
    protected _filterByArrayCdt(list: any): Promise<any>;
    protected doExecute(): Promise<any>;
    /**
     * 搜索数量和值
     * @param map
     * @param query
     */
    protected schCnt(map: any, query: any): Promise<void>;
    slice(map: any): void;
    acqPager(): {
        first: any;
        last: any;
    };
    /**
     * setPage 注销掉，因为group 必须查询所有数据才知道数量
     * @param query
     */
    protected _setPage(query: Query): void;
}
