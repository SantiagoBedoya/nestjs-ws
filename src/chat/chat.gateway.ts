import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: /^\/dynamic-\d+$/ })
export class ChatGateway implements OnGatewayDisconnect, OnGatewayConnection, OnGatewayInit {
  private _logger: Logger = new Logger("ChatGateway");
  @WebSocketServer() wss: Server;

  afterInit(server: any) {
    this._logger.log("Initialized!")
  }

  handleConnection(client: Socket, ...args: any[]) {
    this._logger.log("Client connected: ", client.id)
  }

  handleDisconnect(client: Socket) {
    this._logger.log("Client disconnected: ", client.id)
  }

  @SubscribeMessage('chatToServer')
  handleMessage(client: Socket, message: { sender: string, room: string, message: string }): void {
    this.wss.to(message.room).emit("chatToClient", message);
  }

  @SubscribeMessage("joinRoom")
  handleJoinRoom(client: Socket, room: string){
    client.join(room)
    client.emit("joinedRoom", room)
  }

  @SubscribeMessage("leaveRoom")
  handleLeaveRoom(client: Socket, room: string){
    client.leave(room)
    client.emit("leftRoom", room)
  }
}
