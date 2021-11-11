import { Logger } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Namespace, Server, Socket } from "socket.io";

export class TestGateway {
    private namespaces = ["ns1", "ns2", "ns3"]
    private _logger: Logger = new Logger("TestGateway");
    private _server: Server;

    constructor(app: NestExpressApplication){
        this._server = new Server(app.getHttpServer())
        this._logger.log("Initialized")

        this.initializeNamespaces()
    }

    initializeNamespaces(){
        this._logger.log("[namespaces] Initialized")
        this.namespaces.forEach(ns => {
            let n = this._server.of(`/${ns}`)
            n.on("connection", socket => {
                this.handleJoinRoom(socket);
                this.handleLeaveRoom(socket);
                this.handleChatToServer(socket, n)
            })
        })
    }

    handlerTest(message: { sender: string, room: string, message: string }){
        this._logger.log(message);
        this._server.to(message.room).emit("chatToClient", message)
    }
    
    handleChatToServer(socket: Socket, ns: Namespace){
        socket.on("chatToServer", (message: { sender: string, room: string, message: string }) => {
            ns.to(message.room).emit("chatToClient", message)
        })
    }

    handleJoinRoom(socket: Socket){
        socket.on("joinRoom", (room) => {   
            socket.join(room)
            socket.emit("joinedRoom", room)
        })
    }

    handleLeaveRoom(socket: Socket){
        socket.on("leaveRoom", (room) => {   
            socket.join(room)
            socket.emit("leftRoom", room)
        })
    }
}