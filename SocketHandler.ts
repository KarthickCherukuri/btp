import { Socket, io } from "socket.io-client";

export default class SocketHandler {
  private socket: Socket;

  constructor(url?: string) {
    this.socket = io(
      url || "https://my-service-210340603369.asia-south1.run.app"
    );
  }

  checkConnection = () => {
    this.socket.emit("test", "Hello World");
  };

  attachEventListner = (tag: string, listner: (data?: any) => void) => {
    this.socket.on(tag, listner);
  };

  emit = (tag: string, data: any) => {
    this.socket.emit(tag, data);
  };
}
