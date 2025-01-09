"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const pigpio_1 = require("pigpio");
// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
const MICROSECDONDS_PER_CM = 1e6 / 34321;
const trigger = new pigpio_1.Gpio(23, { mode: pigpio_1.Gpio.OUTPUT });
const echo = new pigpio_1.Gpio(24, { mode: pigpio_1.Gpio.INPUT, alert: true });
trigger.digitalWrite(0); // Make sure trigger is low
const watchHCSR04 = () => {
    let startTick;
    console.log("Watching for ultrasonic signals...");
    echo.on("alert", (level, tick) => {
        console.log(`Alert triggered: level=${level}, tick=${tick}`);
        if (level === 1) {
            console.log("Rising edge detected");
            startTick = tick;
        }
        else {
            console.log("Falling edge detected");
            const endTick = tick;
            const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32-bit arithmetic
            const distance = diff / 2 / MICROSECDONDS_PER_CM;
            console.log(`Distance: ${distance.toFixed(2)} cm`);
        }
    });
};
watchHCSR04();
// Trigger a distance measurement once per second
setInterval(() => {
    trigger.trigger(10, 1); // Set trigger high for 10 microseconds
}, 1000);
