import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from "socket.io"

// @WebSocketGateway()
@WebSocketGateway(3001, { cors: true, path: "/websockets", serveClient: true, namespace: "/" })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;
  private _logger: Logger = new Logger("AppGateway");

  afterInit(server: Server) {
    this._logger.log("Initialized!")
  }

  handleConnection(client: Socket, ...args: any[]) {
    this._logger.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    this._logger.log(`Client disconnected: ${client.id}`)
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void/*WsResponse<string>*/ {
    this.wss.emit("msgToClient", payload)
    // client.emit("msgToClient", payload)
    // return {event: "msgToClient", data: payload};
  }

}
