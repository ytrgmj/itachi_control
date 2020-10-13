declare var Socket: {
    /**
     * 发送消息
     * @param room 房间号
     * @param event
     * @param param
     */
    emit: (room: string, event: string, param: any) => void;
    /**
    server.js调用
    */
    listen: (server: any) => void;
    getSocket: (id: any) => any;
};
export default Socket;
