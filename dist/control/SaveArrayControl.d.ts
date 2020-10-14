/**
 * 适合保存多条数据的
 */
import { Dao, SyncData } from 'itachi_orm';
import Control from './Control';
export default abstract class SaveArrayControl extends Control {
    abstract getTableName(): string;
    protected getDao(): Dao;
    protected getIdCol(): string;
    protected getNoCol(): string;
    protected doExecute(): Promise<void>;
    protected _findAddArray(): any[];
    protected getNoUpdateCols(): string[];
    protected _findUpdateArray(): any[];
    protected _add(array: any): Promise<void>;
    protected _update(array: any): Promise<void>;
    protected getSyncData(): SyncData;
}
