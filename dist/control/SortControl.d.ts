import Control from './Control';
import { Dao } from 'itachi_orm';
/**
 * 处理单条数据
 */
export default abstract class DataControl extends Control {
    protected abstract _getNeedParamKey(): Array<string>;
    protected abstract getDao(): Dao;
    doExecute(): Promise<void>;
    protected _update(list: Array<any>): Promise<void>;
    _createError(): Error;
    _findDatas(): Promise<Array<any>>;
    protected _getIdCol(): string;
}
