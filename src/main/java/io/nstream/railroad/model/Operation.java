package io.nstream.railroad.model;

public class Operation {

  private int throttle;
  private int brakeLevel;
  private int fuelLevel;
  private int engineTemp;
  private boolean doorOpen;
  private boolean emergencyBrake;
  private boolean engineFault;

  public Operation() {
  }

  public int getThrottle() {
    return throttle;
  }

  public Operation setThrottle(int throttle) {
    this.throttle = throttle;
    return this;
  }

  public int getBrakeLevel() {
    return brakeLevel;
  }

  public Operation setBrakeLevel(int brakeLevel) {
    this.brakeLevel = brakeLevel;
    return this;
  }

  public int getFuelLevel() {
    return fuelLevel;
  }

  public Operation setFuelLevel(int fuelLevel) {
    this.fuelLevel = fuelLevel;
    return this;
  }

  public boolean isFuelLow() {
    return fuelLevel < 10;
  }

  public int getEngineTemp() {
    return engineTemp;
  }

  public Operation setEngineTemp(int engineTemp) {
    this.engineTemp = engineTemp;
    return this;
  }

  public boolean isDoorOpen() {
    return doorOpen;
  }

  public Operation setDoorOpen(boolean doorOpen) {
    this.doorOpen = doorOpen;
    return this;
  }

  public boolean isEmergencyBrake() {
    return emergencyBrake;
  }

  public Operation setEmergencyBrake(boolean emergencyBrake) {
    this.emergencyBrake = emergencyBrake;
    return this;
  }

  public boolean isEngineFault() {
    return engineFault;
  }

  public Operation setEngineFault(boolean engineFault) {
    this.engineFault = engineFault;
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

    Operation that = (Operation) o;

    if (throttle != that.throttle) {
      return false;
    }
    if (brakeLevel != that.brakeLevel) {
      return false;
    }
    if (fuelLevel != that.fuelLevel) {
      return false;
    }
    if (engineTemp != that.engineTemp) {
      return false;
    }
    if (doorOpen != that.doorOpen) {
      return false;
    }
    if (emergencyBrake != that.emergencyBrake) {
      return false;
    }
    return engineFault == that.engineFault;
  }

  @Override
  public int hashCode() {
    int result = throttle;
    result = 31 * result + brakeLevel;
    result = 31 * result + fuelLevel;
    result = 31 * result + engineTemp;
    result = 31 * result + (doorOpen ? 1 : 0);
    result = 31 * result + (emergencyBrake ? 1 : 0);
    result = 31 * result + (engineFault ? 1 : 0);
    return result;
  }

}
