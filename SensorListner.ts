import SocketHandler from "./SocketHandler";
import { role } from "./types";
import { Gpio } from "pigpio";
import { Server } from "socket.io";
const MICROSECDONDS_PER_CM = 1e6 / 34321;
const trigger = new Gpio(7, { mode: Gpio.OUTPUT });
const echo = new Gpio(18, { mode: Gpio.INPUT, alert: true });
trigger.digitalWrite(0); // Make sure trigger is low
export default class SensorListner {
  public socket: SocketHandler;
  private serverRole: role;
  private io?: Server;
  constructor(serverRole: role) {
    this.socket = new SocketHandler(
      serverRole === "slave" ? "https://192.168.165.169:3000" : undefined
    );
    this.serverRole = serverRole;
    this.socket.attachEventListner("test-response", (data: string) => {
      console.log("test response", data);
    });
    this.socket.checkConnection();
    this.setup();
  }

  setUpMaster = () => {
    this.io = new Server({
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

  setup = () => {
    if (this.serverRole === "slave") {
      try {
        this.watchHCSR04();
        setInterval(() => {
          trigger.trigger(10, 1); // Set trigger high for 10 microseconds
        }, 2000);
      } catch (e) {
        console.error("error in slave", e);
      }
    } else {
      this.setUpMaster();
    }
  };

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
        this.socket.emit("data-recieved", distance.toFixed(2));
      }
    });
  };
}
