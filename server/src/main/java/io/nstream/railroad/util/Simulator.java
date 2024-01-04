package io.nstream.railroad.util;

import model.Alert;
import model.Health;
import model.Operation;
import model.Performance;

public class Simulator {

  public static Performance simPerformance() {
    return new Performance()
          .setCpuUsage(simRandomInt(0, 100))
          .setMemoryUsage(simRandomInt(0, 100))
          .setStorage(simRandomInt(0, 100))
          .setNetworkBandwidth(simRandomInt(0, 100));
  }

  public static Health simHealth () {
    return new Health()
          .setBattery(simRandomInt(0, 100))
          .setSignalStrength(simRandomInt(0, 100))
          .setTemperature(simRandomInt(0, 100))
          .setPowerSupplyStatus(Math.random() > 0.2 ? "Good" : "Bad");

  }

  public static Alert simAlert () {
    final String alertType = Math.random() < 0.1 ? Math.random() < 0.1 ? "Critical" : "Warning" : "Info";
    return new Alert()
          .setTimestamp(System.currentTimeMillis())
          .setAlertType(alertType);
  }

  public static Operation simOperation() {
    return new Operation()
          .setBrakeLevel(simRandomInt(0, 100))
          .setDoorOpen(simRandomInt(0, 1) < 0.01)
          .setEmergencyBrake(simRandomInt(0, 1) < 0.01)
          .setEngineFault(simRandomInt(0, 1) < 0.01)
          .setEngineTemp(simRandomInt(100, 200))
          .setFuelLevel(simRandomInt(0, 100))
          .setThrottle(simRandomInt(0, 100));
  }

  private static float simRandomFloat(int lower, int upper) {
    return (float) (Math.random() * (upper - lower));
  }

  private static int simRandomInt(int lower, int upper) {
    return Math.round(simRandomFloat(lower, upper));
  }

}
