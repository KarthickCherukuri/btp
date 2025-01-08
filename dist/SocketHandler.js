"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
class SocketHandler {
    constructor(url) {
        this.checkConnection = () => {
            this.socket.emit("test", "Hello World");
        };
        this.attachEventListner = (tag, listner) => {
            this.socket.on(tag, listner);
        };
        this.socket = (0, socket_io_client_1.io)(url || "https://my-service-210340603369.asia-south1.run.app");
    }
}
exports.default = SocketHandler;
