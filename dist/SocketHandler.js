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
        this.emit = (tag, data) => {
            this.socket.emit(tag, data);
        };
        this.socket = (0, socket_io_client_1.io)(url || "https://my-service-210340603369.asia-south1.run.app");
        this.socket.on("error", (error) => {
            console.error("socket error", error);
        });
        this.socket.on("sensor-data-middleware", (data) => console.debug("sensor-data-middleware", data));
        this.socket.on("disconnect", () => {
            console.log("socket disconnected", url || "https://my-service-210340603369.asia-south1.run.app");
        });
    }
}
exports.default = SocketHandler;
