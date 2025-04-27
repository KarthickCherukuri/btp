"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const onoff_1 = require("onoff");
// Define GPIO pins
const TRIG = new onoff_1.Gpio(18, "out"); // GPIO pin for Trig
const ECHO = new onoff_1.Gpio(24, "in", "both"); // GPIO pin for Echo
// Function to measure distance
const measureDistance = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        let startTick;
        let endTick;
        // Send a 10µs pulse to the Trig pin
        TRIG.writeSync(1);
        setTimeout(() => TRIG.writeSync(0), 0.00001); // 10µs pulse
        // Listen for Echo rising and falling events
        ECHO.watch((err, value) => {
            if (err) {
                reject(`Error: ${err.message}`);
            }
            if (value === 1) {
                // Rising edge (start of pulse)
                startTick = process.hrtime();
            }
            else if (startTick) {
                // Falling edge (end of pulse)
                endTick = process.hrtime(startTick);
                // Calculate pulse duration (in ms)
                const duration = (endTick[0] * 1e9 + endTick[1]) / 1e6;
                // Calculate distance (in cm)
                const distance = (duration * 34300) / 2;
                resolve(distance.toFixed(2));
            }
        });
    });
});
// Cleanup GPIO on process exit
process.on("SIGINT", () => {
    TRIG.unexport();
    ECHO.unexport();
    process.exit();
});
exports.default = measureDistance;
