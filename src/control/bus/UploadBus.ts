import {AsyncBus,StrUtil,Buffers} from '@dt/itachi_core'


export default class UploadBus extends AsyncBus{
    private _wiget:UploadWiget;

    async process(buffers:Buffers){
        var n = 0
        while((n = buffers.indexOf('\r\n'))!=-1){
          this.add(buffers.readTo(n+2));
        }
        this.add(buffers.readTo());
        var param = await this.getFromEvent(new AskParam());
        var files = await this.getFromEvent(new AskFile());
        return {
            param:param,
            files:files
        }
         
    }
    add(line){
        let opt = this._opt;
        if(StrUtil.start(line.toString(),
                opt.boundary)){
            this._closeWiget();
        }
        this.getWiget().add(line);
        
    
    }
    _closeWiget(){
      
        this._wiget = null;
    }
    getWiget(){
        if(this._wiget == null){
            this._wiget = new UploadWiget(this._opt);
            this._wiget.bind(this);
        }
        return this._wiget;
    }
}
import UploadWiget from './wiget/UploadWiget'
import AskParam from './event/AskParam'
import AskFile from './event/AskFile'
