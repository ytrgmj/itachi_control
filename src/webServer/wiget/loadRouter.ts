import {Router} from 'express';
import fs from 'fs';
import path from 'path';
import {StrUtil} from 'itachi_core';
import {Context} from 'itachi_util';



/**
 截取mocker
*/

function createFun(clazz,opt):Function{
    if(clazz.default​​){
        //兼容ts的export
        clazz = clazz.default;
    }
    
    return function(req,resp){

        
        var ctrl = new clazz();
        if(opt.context){
            var context:Context = opt.context;
            if (req.headers.context_id != null) {
                context.setId(req.headers.context_id)
            }
            var childContext = context.buildChild();
            if(ctrl.setContext){
                ctrl.setContext(childContext);
            }
            childContext.assembly([ctrl]);
        }
        ctrl.execute(req,resp);
    }
}
function loadFromWebPath(app,opt){
    if(opt.webPath == null)
        return;
    var map = {};
    function _get(key){
        var router = map[key];
        if(router == null){
            router = Router();
            map[key] = router;
        }
        return router;
    }

    function _parseDir(dir,webPath){
        var dirPath = path.join(webPath,dir);
        var stat = fs.statSync(dirPath)
        if (stat.isFile()) {
            return;
        } else {
            var files = fs.readdirSync(dirPath)
            for (var file of files) {
                var filePath = path.join(webPath, dir,file)
                var filePathStat = fs.statSync(filePath)
                if(!filePathStat.isFile()){
                    continue;
                }
                let extName = path.extname(file)
                if( extName == '.js' || (extName == '.ts' && file.indexOf('.d.')==-1)){
                    var clazz = require(filePath)
                    if(clazz.default){
                        clazz = clazz.default;
                    }
                    var routerName = clazz.router
                    
                    if(routerName) {
                        console.log('routerName',routerName);
                    
                        if(routerName.length > 0 && routerName[0] !== '/') {
                            routerName = '/' + routerName
                        }
                    } else {
                        file = StrUtil.firstLower(path.basename(file, extName));
                        routerName = '/'+file
                    }
                    var router = _get(dir);
                    router.all(routerName,createFun(clazz,opt));
                    
                }
            }
        } 
    }
    var dirs = fs.readdirSync(opt.webPath)
    for(var dir of dirs){
        _parseDir(dir,opt.webPath)
    }
    for(var e in map){
        app.use('/'+e,map[e])
    }
}



//自动生成
function loadRouter(app, opt){
    loadFromWebPath(app,opt);
}
export default loadRouter;
  

