import socketIo from 'socket.io'
import socketRedis from 'socket.io-redis'
import Redis from '../redis/Redis'

const io = socketIo({
    pingTimeout: 2000,
    pingInterval: 4000
})



var inited = false;
function init() {
    if (inited)
        return;
    inited = true;
    const pub = Redis.get()
    const sub = Redis.get()
    io.adapter(socketRedis({
        pubClient: pub,
        subClient: sub
    }))
    io.on('connection', (socket) => {
    	/**
    	data:{
    		room
    	}
    	*/
        socket.on('joinRoom', (data) => {
            console.log('joinRoom');
            socket.join(data.room, function () {
                socket.emit('has_join_room')
            })
            
        })
        socket.on('ping', (data) => {
            socket.join(data.room, function () {
                socket.emit('replay_ping')
            })
            
        })
        socket.on('leaveRoom', (data) => {
            socket.leave(data.room);
        })
        socket.on('disconnect', () => {
            // redis.hdel(socket._roomName, socket.id);
        })
    })
}

var Socket = {
	/**
     * 发送消息
     * @param room 房间号 
     * @param event 
     * @param param 
     */
    emit: function (room:string, event:string, param) {
        init();
        io.sockets.in(room).emit(event, param)
    },
  
	/**
	server.js调用
	*/
    listen: function (server) {
        init();
        io.listen(server)
    },
    getSocket: function (id) {
        return io.sockets.sockets[id]
    }
}

export default Socket;