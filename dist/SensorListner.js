"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SocketHandler_1 = __importDefault(require("./SocketHandler"));
class SensorListner {
    constructor() {
        this.socket = new SocketHandler_1.default();
        this.socket.attachEventListner("test-response", (data) => {
            console.log(data);
        });
        this.socket.checkConnection();
    }
}
exports.default = SensorListner;
