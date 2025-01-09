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
import { Gpio } from "pigpio";

// Define the GPIO pins connected to the HC-SR04
const triggerPin = 17; // GPIO pin for the trigger
const echoPin = 18; // GPIO pin for the echo

// Set up trigger and echo pins
const trigger = new Gpio(triggerPin, { mode: Gpio.OUTPUT });
const echo = new Gpio(echoPin, { mode: Gpio.INPUT, alert: true });

// Function to calculate distance from time
function calculateDistance(time: number): number {
  // Calculate distance in cm (speed of sound is approximately 34300 cm/s)
  return (time * 34300) / 2;
}

// Set up an alert when the echo pin changes (rising edge = signal received)
let startTick: number;

echo.on("alert", (level: number, tick: number) => {
  if (level === 1) {
    // Rising edge (signal received)
    startTick = tick;
  } else {
    // Falling edge (signal has returned)
    const endTick = tick;
    const timeElapsed = endTick - startTick;
    const distance = calculateDistance(timeElapsed);
    console.log(`Distance: ${distance.toFixed(2)} cm`);
  }
});

// Function to trigger the ultrasonic pulse
function triggerPulse() {
  trigger.digitalWrite(1); // Send trigger pulse
  setTimeout(() => {
    trigger.digitalWrite(0); // Stop pulse after 10 microseconds
  }, 10);
}

// Trigger pulse every 500ms
setInterval(triggerPulse, 500);
