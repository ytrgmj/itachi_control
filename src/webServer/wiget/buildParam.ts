import _ from 'lodash'
import humpUnderline from '../../util/humpUnderline'

export default function buildParam(params: any) {
    const goesTohumpOpen = params.goesTohumpOpen 
    function inArray(req,notNeedList):Boolean{
        if (notNeedList != null) {
            for (let i = 0; i < notNeedList.length; i++) {
                let url = req.baseUrl + req.path
    
                if (url.toLowerCase().indexOf(notNeedList[i].toLowerCase()) !== -1) {
    
                
                    return true
                }
            }
        }
        return false
    }
    return async function (req, resp, next) {
        var param
        if (req.method == 'GET') {
            param = req.query
            if (param == null) {
                param = {}
            }
        } else {
            param = req.body
            if (param == null) {
                param = {}
            }
            if (req.query) {
                for (var k in req.query) {
                    if (req.query[k]) { param[k] = req.query[k] }
                }
            }
        }
        if (goesTohumpOpen && !inArray(req,params.notTohumpList)) {
            req._param = humpUnderline(param)
        } else {
            req._param = param
        }
        next()
    }
}


