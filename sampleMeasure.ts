import { Gpio } from "onoff";

// Define GPIO pins
const TRIG = new Gpio(18, "out"); // GPIO pin for Trig
const ECHO = new Gpio(24, "in", "both"); // GPIO pin for Echo

// Function to measure distance
const measureDistance = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    let startTick: [number, number] | undefined;
    let endTick: [number, number];

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
      } else if (startTick) {
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
};

// Cleanup GPIO on process exit
process.on("SIGINT", () => {
  TRIG.unexport();
  ECHO.unexport();
  process.exit();
});

export default measureDistance;
