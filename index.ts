// import { io } from "socket.io-client";
import SensorListner from "./SensorListner";
import { role } from "./types";
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

const args = process.argv.slice(2);
const serverRole = args[0] as role;
const ipAddress = args[1];

new SensorListner(serverRole, ipAddress);
