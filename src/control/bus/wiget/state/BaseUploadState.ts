export default abstract class BaseUploadState{
    protected _wiget:any
    abstract add(line:Buffer);
    constructor(wiget){
        this._wiget = wiget;
    }
}