import ListControl from './ListControl';
/**
 * 还是一个查询，查出来空会运行processInit 方法
 */
export default abstract class InitListControl extends ListControl {
    /**
     * 处理初始化，返回true表示运行了初始化代码，需要重新查询一次。
     */
    abstract processInit(): Promise<boolean>;
    protected doExecute(): Promise<any>;
    /**
     * 是否需要初始化
     * @param list
     */
    protected _needInit(list: any): Promise<boolean>;
}
