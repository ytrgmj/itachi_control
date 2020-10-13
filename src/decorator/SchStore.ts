export default  function(){
    
    return function classDecorator<T extends {new(...args:any[]):{}}>(constructor:T) {
        return class extends constructor {
            async buildQuery(){
                var query =await super['buildQuery']()
                let param = this['_param'];
                if(param != null){
                    let token = param._token
                    if(token != null){
                        let store_ids = null;
                        if(token.store_id_array != null)
                            store_ids = token.storeIdArray;
                        if(token.store_id != null)
                            store_ids = [token.storeId];
                        if(store_ids != null){
                            query.in('store_id',store_ids);
                        }
                    }
                }
                return query;
            }
        }
    }
}