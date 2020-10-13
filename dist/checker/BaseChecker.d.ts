export default abstract class BaseChecker {
    protected _opt: any;
    constructor(opt: any);
    abstract _check(val: any, col?: any, param?: any): any;
    abstract _createMsg(val: any, col?: any): any;
    _initOpt(opt: any): any;
    protected _createError(param: any, col: string): Promise<Error>;
    _getCols(): Array<string>;
    check(param: any): Promise<void>;
}
