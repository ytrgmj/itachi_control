import jwt from 'jsonwebtoken'

export default class JwtToken {
    _pubcert
    constructor(param: any) {
        this._pubcert = param.pubcert
    }

    //解密
    decode(token: string): any {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this._pubcert, { algorithms: ['RS256'] }, function (err, payload) {
                if (err) {
                    reject(err)
                } else {
                    resolve(payload)
                }
            })
        })
    }

}