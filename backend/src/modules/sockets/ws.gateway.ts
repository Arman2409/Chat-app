import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect} from "@nestjs/websockets";
import { Server, Socket} from "socket.io";
@WebSocketGateway({namespace: "events"})

export class WebSocketsGateway implements  OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection{
  @WebSocketServer()  server: Server;

  private readonly timestamp = Date.now();
}
