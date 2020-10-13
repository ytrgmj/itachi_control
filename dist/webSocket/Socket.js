"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
const socket_io_redis_1 = __importDefault(require("socket.io-redis"));
const Redis_1 = __importDefault(require("../redis/Redis"));
const io = socket_io_1.default({
    pingTimeout: 2000,
    pingInterval: 4000
});
var inited = false;
function init() {
    if (inited)
        return;
    inited = true;
    const pub = Redis_1.default.get();
    const sub = Redis_1.default.get();
    io.adapter(socket_io_redis_1.default({
        pubClient: pub,
        subClient: sub
    }));
    io.on('connection', (socket) => {
        /**
        data:{
            room
        }
        */
        socket.on('joinRoom', (data) => {
            console.log('joinRoom');
            socket.join(data.room, function () {
                socket.emit('has_join_room');
            });
        });
        socket.on('ping', (data) => {
            socket.join(data.room, function () {
                socket.emit('replay_ping');
            });
        });
        socket.on('leaveRoom', (data) => {
            socket.leave(data.room);
        });
        socket.on('disconnect', () => {
            // redis.hdel(socket._roomName, socket.id);
        });
    });
}
var Socket = {
    /**
     * 发送消息
     * @param room 房间号
     * @param event
     * @param param
     */
    emit: function (room, event, param) {
        init();
        io.sockets.in(room).emit(event, param);
    },
    /**
    server.js调用
    */
    listen: function (server) {
        init();
        io.listen(server);
    },
    getSocket: function (id) {
        return io.sockets.sockets[id];
    }
};
exports.default = Socket;
