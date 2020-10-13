import Redis from './Redis'
export default class RedisServer {
    //表示在工厂类里面是单例
    public static __needReg = 'single';
    protected _client;
    getClient() {
        if(this._client == null){
            this._client = Redis.get()
        }
        return this._client
    }
    async lock(key,device_id:string, time?:number) {
        if(time == null)
            time = 300;
        const client = this.getClient()
        const ret = await client.set(key, device_id, 'NX', 'EX', time)

        if (device_id === '') {
            return ret === 'OK'
        }

        if(ret === 'OK'){
            return true
        }else{
            let cacheValue = await client.get(key);
            return cacheValue == device_id;
        }
    }
    async unlock(key,device_id) {
        const script = ['if redis.call("get",KEYS[1]) == ARGV[1] then',
            '	return redis.call("del",KEYS[1])',
            'else',
            '	return 0',
            'end'
        ];
        const client = this.getClient()
        await client.eval(script.join('\r\n'), 1, key, device_id);
    }
}
