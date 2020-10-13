export default class RedisServer {
    static __needReg: string;
    protected _client: any;
    getClient(): any;
    lock(key: any, device_id: string, time?: number): Promise<boolean>;
    unlock(key: any, device_id: any): Promise<void>;
}
