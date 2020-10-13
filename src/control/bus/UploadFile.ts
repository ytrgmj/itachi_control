export default class UploadFile{
    _opt:any
    constructor(opt){
        if(opt == null)
            opt = {}
        this._opt = opt;
    }
    /**
     * 得到流
     */
    getBuffer():Buffer{
        return this._opt.buffer;
    }
    /**
     * 得到文件名
     */
    getFilename():string{
        return this._opt.filename;
    }
}