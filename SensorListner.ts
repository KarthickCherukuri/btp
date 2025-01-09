import { Socket } from "socket.io-client";
import SocketHandler from "./SocketHandler";
import { role } from "./types";
export default class SensorListner {
  public socket: SocketHandler;
  private serverRole: role;
  constructor(serverRole: role) {
    this.socket = new SocketHandler();
    this.serverRole = serverRole;
    this.socket.attachEventListner("test-response", (data: string) => {
      console.log(data);
    });
    this.socket.checkConnection();
  }
}
