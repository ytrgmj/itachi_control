import {ArrayUtil} from '@dt/itachi_core'
import JwtToken from './JwtToken'
import findIndex from 'lodash.findindex'

function checkParam(tokenItem, reqItem,bakItem){
    if(tokenItem == null && bakItem == null)
        return true;
    let array = [];
    if(tokenItem != null){
        if(!(tokenItem instanceof Array)){
            array.push(tokenItem);
        }else{
            array.push( ... tokenItem)
        }
    }
    if(!(reqItem instanceof Array))
        reqItem = [reqItem];
    if(bakItem != null){
        if(bakItem instanceof Array){
            array.push( ... bakItem);
        }
    }
    if(reqItem.length > array.length)
        return false;
    let list = ArrayUtil.and(reqItem,array);
    return list.length == reqItem.length;
}
export default function tokenCheck(params: any) {

    
    let exceptUrl = params.exceptUrl || []
    let tokenStatus = params.tokenStatus  //true需要token，false不需要token
    exceptUrl.push('/debug', '/documentation')
    return async function (req, res, next) {
        
        let nextStatus = false
        if (req.method === 'OPTIONS' || req.method === 'options') {
            return next()
        } else if ((findIndex(exceptUrl, function (url) { return req.originalUrl.indexOf(url) > -1 }) > -1)) {
            nextStatus = true
        }

        const jwtToken = new JwtToken({ pubcert: params.publicKey })
        let token: string = req.headers.token || req.headers.Token
        
        try {
            if(token == null || token ==''){
                
                if (nextStatus || !tokenStatus) {  
                    
                    delete req._param._token 
                    return next()
                }
                res.writeHead(401, { 'Content-Type': 'application/json' });
                let ret = {
                    "error": {
                        "code": "TOKEN_ERROR",
                        "message":  'token error'
                    }
                }
                res.write(JSON.stringify(ret));
                return res.end();
            }

            let tokenInfo = await jwtToken.decode(token);
            
            if (tokenInfo) {
                
                for (let item in tokenInfo) {
                    if (req._param[item] && !checkParam(tokenInfo[item], req._param[item],tokenInfo[item+'s'])) {
                        throw new Error("Token Data Error");
                    }
                }
                req._param._token = tokenInfo
                
            }
            return next()
        } catch (error) {
            if (nextStatus || !tokenStatus) {
                delete req._param._token;
                return next()
            }
            res.writeHead(401, { 'Content-Type': 'application/json' });
            let ret = {
                "error": {
                    "code": "TOKEN_ERROR",
                    "message": error.message || 'token error'
                }
            }
            res.write(JSON.stringify(ret));
            return res.end();
        }
    }
}
