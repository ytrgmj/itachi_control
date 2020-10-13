import BaseUploadState from './BaseUploadState'
export default class Content extends BaseUploadState{
    private _cnt:number = 0;
    add(line:Buffer){
        
        var wiget = this._wiget;
        if(this._cnt++ >0){
            wiget.addBuffer('\r\n')
        }
        
        wiget.addBuffer(this.substring(line,0,line.length-2));
        
    }
    substring(buffer:Buffer,begin,end){
        var size = end - begin;
        if(size<0)
            return '';
        var ret = new Buffer(size);
        buffer.copy(ret,0,begin,end);
        return ret;
    }

}