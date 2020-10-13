interface MyErrorOpt{
    code?:string|number,
    status?:string|number,
    message?:string,
    data?:any
}
class MyError extends Error{
    _opt :MyErrorOpt
    constructor(opt:MyErrorOpt){
        super();
        this._opt = opt
    }
    get message():string{
        return this._opt.message;
    }
    get code():string|number{
        return this._opt.code;
    }

    get status():string|number{
        return this._opt.status;
    }

    get data():any{
        return this._opt.data;
    }
}
export default function(opt){

}