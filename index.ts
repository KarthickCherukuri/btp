import { io } from "socket.io-client";
import SensorListner from "./SensorListner";
// const socket = io("https://my-service-210340603369.asia-south1.run.app");

// socket.emit("test", "Hello World");
// socket.on("test-response", (data) => {
//   console.log(data);
// });
const sensorListner = new SensorListner();
