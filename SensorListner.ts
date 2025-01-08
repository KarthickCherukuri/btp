import { Socket } from "socket.io-client";
import SocketHandler from "./SocketHandler";
export default class SensorListner {
  public socket: SocketHandler;
  constructor() {
    this.socket = new SocketHandler();
    this.socket.attachEventListner("test-response", (data: string) => {
      console.log(data);
    });
    this.socket.checkConnection();
  }
}
