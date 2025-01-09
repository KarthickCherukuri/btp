"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { io } from "socket.io-client";
// import SensorListner from "./SensorListner";
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
const pigpio_1 = require("pigpio");
// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
const MICROSECDONDS_PER_CM = 1e6 / 34321;
const trigger = new pigpio_1.Gpio(17, { mode: pigpio_1.Gpio.OUTPUT });
const echo = new pigpio_1.Gpio(18, { mode: pigpio_1.Gpio.INPUT, alert: true });
trigger.digitalWrite(0); // Make sure trigger is low
const watchHCSR04 = () => {
    let startTick;
    echo.on("alert", (level, tick) => {
        if (level == 1) {
            startTick = tick;
        }
        else {
            const endTick = tick;
            const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
            console.log(diff / 2 / MICROSECDONDS_PER_CM);
        }
    });
};
watchHCSR04();
// Trigger a distance measurement once per second
setInterval(() => {
    trigger.trigger(10, 1); // Set trigger high for 10 microseconds
}, 1000);
