package io.nstream.railroad.model;

import java.util.Objects;

public class Health {

  private float temperature;
  private int battery;
  private int signalStrength;
  private String powerSupplyStatus;

  public Health() {
  }

  public float getTemperature() {
    return temperature;
  }

  public Health setTemperature(float temperature) {
    this.temperature = temperature;
    return this;
  }

  public int getBattery() {
    return battery;
  }

  public Health setBattery(int battery) {
    this.battery = battery;
    return this;
  }

  public int getSignalStrength() {
    return signalStrength;
  }

  public Health setSignalStrength(int signalStrength) {
    this.signalStrength = signalStrength;
    return this;
  }

  public String getPowerSupplyStatus() {
    return powerSupplyStatus;
  }

  public Health setPowerSupplyStatus(String powerSupplyStatus) {
    this.powerSupplyStatus = powerSupplyStatus;
    return this;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    Health health = (Health) o;

    if (Float.compare(health.temperature, temperature) != 0) {
      return false;
    }
    if (battery != health.battery) {
      return false;
    }
    if (signalStrength != health.signalStrength) {
      return false;
    }
    return Objects.equals(powerSupplyStatus, health.powerSupplyStatus);
  }

  @Override
  public int hashCode() {
    int result = (temperature != +0.0f ? Float.floatToIntBits(temperature) : 0);
    result = 31 * result + battery;
    result = 31 * result + signalStrength;
    result = 31 * result + (powerSupplyStatus != null ? powerSupplyStatus.hashCode() : 0);
    return result;
  }
}
