import IoRedis from 'ioredis'
import {ConfigFac} from 'itachi_core'

var get = function ():IoRedis.Redis {
      var redisConfig = ConfigFac.get('redis');
      
      if(redisConfig == null){
            return null;
      }
      var db = 0;
      if(redisConfig.db != null)
            db = redisConfig.db;
      let opt = {
            host: redisConfig.host,
            port: redisConfig.port,
            password: redisConfig.password,
            db
      }
      if(redisConfig.tls){
            opt['tls'] = {}
      }
      return new IoRedis(opt)
}
export default {get}

