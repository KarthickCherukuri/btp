"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SensorListner_1 = __importDefault(require("./SensorListner"));
// const socket = io("https://my-service-210340603369.asia-south1.run.app");
// socket.emit("test", "Hello World");
// socket.on("test-response", (data) => {
//   console.log(data);
// });
const sensorListner = new SensorListner_1.default();
