"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SocketHandler_1 = __importDefault(require("./SocketHandler"));
const pigpio_1 = require("pigpio");
const MICROSECDONDS_PER_CM = 1e6 / 34321;
const trigger = new pigpio_1.Gpio(7, { mode: pigpio_1.Gpio.OUTPUT });
const echo = new pigpio_1.Gpio(18, { mode: pigpio_1.Gpio.INPUT, alert: true });
trigger.digitalWrite(0); // Make sure trigger is low
class SensorListner {
    constructor(serverRole) {
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
        this.socket = new SocketHandler_1.default();
        this.serverRole = serverRole;
        this.socket.attachEventListner("test-response", (data) => {
            console.log("test response", data);
        });
        this.socket.checkConnection();
        this.watchHCSR04();
        setInterval(() => {
            trigger.trigger(10, 1); // Set trigger high for 10 microseconds
        }, 2000);
    }
}
exports.default = SensorListner;
