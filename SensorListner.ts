import SocketHandler from "./SocketHandler";
import { role } from "./types";
import { Gpio } from "pigpio";
const MICROSECDONDS_PER_CM = 1e6 / 34321;
const trigger = new Gpio(7, { mode: Gpio.OUTPUT });
const echo = new Gpio(18, { mode: Gpio.INPUT, alert: true });
trigger.digitalWrite(0); // Make sure trigger is low
export default class SensorListner {
  public socket: SocketHandler;
  private serverRole: role;
  constructor(serverRole: role) {
    this.socket = new SocketHandler();
    this.serverRole = serverRole;
    this.socket.attachEventListner("test-response", (data: string) => {
      console.log("test response", data);
    });
    this.socket.checkConnection();
    this.watchHCSR04();
    setInterval(() => {
      trigger.trigger(10, 1); // Set trigger high for 10 microseconds
    }, 2000);
  }

  watchHCSR04 = () => {
    let startTick: any;
    // console.log("Watching for ultrasonic signals...");

    echo.on("alert", (level, tick) => {
      // console.log(`Alert triggered: level=${level}, tick=${tick}`);

      if (level === 1) {
        // console.log("Rising edge detected");
        startTick = tick;
      } else {
        // console.log("Falling edge detected");
        const endTick = tick;
        const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32-bit arithmetic
        const distance = diff / 2 / MICROSECDONDS_PER_CM;
        console.log(`Distance: ${distance.toFixed(2)} cm`);
        this.socket.emit("data-received", distance);
      }
    });
  };
}
