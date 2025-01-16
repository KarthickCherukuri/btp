"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { io } from "socket.io-client";
const SensorListner_1 = __importDefault(require("./SensorListner"));
// import { role } from "./types";
// import { Server } from "socket.io";
// import SocketHandler from "./SocketHandler";
// let serverRole: role = "slave";
// console.log(serverRole);
// if (serverRole === "slave") {
//   const sensorListner = new SensorListner(serverRole);
// } else {
//   const io = new Server();
//   const SocketToMain: SocketHandler = new SocketHandler();
//   io.on("connection", (socket) => {
//     socket.on("sensor-data", (data) => {
//       SocketToMain.emit("sensor-data", data);
//     });
//   });
//   io.attach(3000);
// }
new SensorListner_1.default("master");
new SensorListner_1.default("slave");
