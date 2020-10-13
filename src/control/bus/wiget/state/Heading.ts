import {StrUtil} from '@dt/itachi_core'
import BaseUploadState from './BaseUploadState'

var key  = 'Content-Disposition:';

export default class Heading extends BaseUploadState{
    add(lineBufer:Buffer){
        let line = lineBufer.toString();
        var wiget = this._wiget;
        if(StrUtil.start(line,key)){
            var param = this._parse(line.substring(key.length));
            wiget._name = param.name;
            wiget._filename = param.filename
        }
        if(line == '\r\n'){
            wiget._state = new Content(wiget);
        }
    }
    _parse(line:string):any{
        line = line.substring(0,line.length-2);
        var lines = line.split(';');
        var obj = {};
        for(let strLine of lines){
            let strs = strLine.split('=');
            let value ;
            if(strs.length <=2){
                value =  StrUtil.trim(strs[1]);
            }else{
                let strsSlice = strs.slice(1);
                value = StrUtil.trim(strsSlice.join('='));
            }
            
            if(value != null){
                if(StrUtil.start(value,'"') || StrUtil.start(value,"'")){
                value = value.substring(1);
                }
                if(StrUtil.end(value,'"') || StrUtil.end(value,"'")){
                value = value.substring(0,value.length-1);
                }
                obj[StrUtil.trim(strs[0])] = value;
            }
        }
        return obj;
      }
}
import Content from './Content'
