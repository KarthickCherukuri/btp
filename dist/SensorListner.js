"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SocketHandler_1 = __importDefault(require("./SocketHandler"));
const pigpio_1 = require("pigpio");
const socket_io_1 = require("socket.io");
const MICROSECDONDS_PER_CM = 1e6 / 34321;
const trigger = new pigpio_1.Gpio(7, { mode: pigpio_1.Gpio.OUTPUT });
const echo = new pigpio_1.Gpio(18, { mode: pigpio_1.Gpio.INPUT, alert: true });
trigger.digitalWrite(0); // Make sure trigger is low
class SensorListner {
    constructor(serverRole) {
        this.setUpMaster = () => {
            this.io = new socket_io_1.Server({
                cors: {
                    origin: "*",
                },
            });
            this.io.on("connection", (socket) => {
                socket.on("data-recieved", (data) => {
                    console.log("data from slave", data);
                    this.socket.emit("data-recieved", data);
                });
                socket.on("test-response", () => {
                    socket.emit("hello my slave");
                });
            });
            this.io.attach(3000);
            console.log("master socket started");
        };
        this.setup = () => {
            if (this.serverRole === "slave") {
                try {
                    this.watchHCSR04();
                    // setInterval(() => {
                    //   trigger.trigger(10, 1); // Set trigger high for 10 microseconds
                    // }, 2000);
                }
                catch (e) {
                    console.error("error in slave", e);
                }
            }
            else {
                this.setUpMaster();
            }
        };
        this.watchHCSR04 = () => {
            let startTick;
            // console.log("Watching for ultrasonic signals...");
            echo.on("alert", (level, tick) => {
                // console.log(`Alert triggered: level=${level}, tick=${tick}`);
                if (level === 1) {
                    // console.log("Rising edge detected");
                    startTick = tick;
                }
                else {
                    // console.log("Falling edge detected");
                    const endTick = tick;
                    const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32-bit arithmetic
                    const distance = diff / 2 / MICROSECDONDS_PER_CM;
                    console.log(`Distance: ${distance.toFixed(2)} cm`);
                    this.socket.emit("data-recieved", distance.toFixed(2));
                }
            });
        };
        this.socket = new SocketHandler_1.default(serverRole === "slave" ? "http://172.20.10.2:3000" : undefined);
        this.serverRole = serverRole;
        this.socket.attachEventListner("test-response", (data) => {
            console.log("test response", data);
        });
        this.socket.checkConnection();
        this.setup();
    }
}
exports.default = SensorListner;
