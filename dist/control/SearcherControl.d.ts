import GroupControl from './GroupControl';
/**
 * 通过searcher的方法查询的
 */
export default abstract class extends GroupControl {
    protected _schKey: string;
    protected getDao(): any;
    protected getSearcher(): unknown;
    protected getTableName(): string;
    abstract getFunName(): string;
    protected find(): Promise<any>;
    protected _parseSearchParam(): any;
}
