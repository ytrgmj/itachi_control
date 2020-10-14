

import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express';
import buildParam from './wiget/buildParam'
import Socket from '../webSocket/Socket';
import loadRouter from './wiget/loadRouter';
import { Context} from 'itachi_util';

interface WebServerOption{
    /**
     * 
     */
    webPath?:string;
    webSocket?:boolean;
    port?:number;    
    mids?:Array<any>;
    context?:Context;
    goesTohumpOpen?:boolean;
    notTohumpList?:Array<string>;
}


function init(opt){
    if(opt == null)
      opt = {};
    if(opt.port == null){
      opt.port = 8080;
    }
    return opt;
}
function createFun(clazz){
    return function(req,resp){
        var ctrl = new clazz();
        ctrl.execute(req,resp);
    }
}
  
function initApp(app,opt){
    
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({
        extended: true
    }))
    app.use('/debug/health',function(req,resp){
        resp.send({})
    })
    app.use(cors({maxAge:600}))
    app.use(buildParam(opt))
    
   
    
    
    if(opt.mids){
        
        var mids = opt.mids;
        
        for(var mid of mids){
            app.use(mid);
        }
    }
    
}
function addRouters(app,opt){
    var routers = opt.routers;
    
    if(routers==null)
        return ;
    for(var router of routers){
        var {key,fun,ctrl} = router;
        if(fun == null){
            fun = createFun(ctrl)
        }
        app.use('/'+key,fun);

    }
}
  
export default function(opt:WebServerOption){
    opt = init(opt)
    var app:any = express();
    app.disable('x-powered-by');
    var apiPort = opt.port;

    initApp(app,opt)
    loadRouter(app,opt);
    addRouters(app,opt)

    var server = app.listen(apiPort, function() {
        var host = server.address();
        
        console.log(`app listening at ${apiPort}`)
    })
    
    if(opt.webSocket){
        Socket.listen(server);
    }
    app.disable('x-powered-by')
    return app;
}

