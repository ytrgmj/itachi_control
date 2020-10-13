export default  function(keys:Array<string>){
    
    return function classDecorator<T extends {new(...args:any[]):{}}>(constructor:T) {
        return class extends constructor {
            protected _getNeedParamKey():Array<string>{
                let fun = constructor.prototype._getNeedParamKey;
                let array = fun.apply(this);
                if(keys == null)
                    return array;
                if(array == null){
                    array = keys;
                }else{
                    array.push(... keys);
                }
                return array;
            }
        }
    }
}