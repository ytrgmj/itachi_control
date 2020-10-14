import {BeanUtil,DateUtil, Bean} from 'itachi_core'

function process(data ,key,val){
    if(val != null && val instanceof Date ){
        data[key] = DateUtil.formatDate(val);
        
    }
    if(val == null){
        delete data[key]
    }
    
}
export default BeanUtil.eachFun(process);
