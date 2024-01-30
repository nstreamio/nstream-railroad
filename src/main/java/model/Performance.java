package model;

public class Performance {

  private float cpuUsage;
  private float memoryUsage;
  private float networkBandwidth;
  private float storage;

  public Performance() {

  }

  public float getCpuUsage() {
    return cpuUsage;
  }

  public Performance setCpuUsage(float cpuUsage) {
    this.cpuUsage = cpuUsage;
    return this;
  }

  public float getMemoryUsage() {
    return memoryUsage;
  }

  public Performance setMemoryUsage(float memoryUsage) {
    this.memoryUsage = memoryUsage;
    return this;
  }

  public float getNetworkBandwidth() {
    return networkBandwidth;
  }

  public Performance setNetworkBandwidth(float networkBandwidth) {
    this.networkBandwidth = networkBandwidth;
    return this;
  }

  public float getStorage() {
    return storage;
  }

  public Performance setStorage(float storage) {
    this.storage = storage;
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

    Performance performance = (Performance) o;

    if (Float.compare(performance.cpuUsage, cpuUsage) != 0) {
      return false;
    }
    if (Float.compare(performance.memoryUsage, memoryUsage) != 0) {
      return false;
    }
    if (Float.compare(performance.networkBandwidth, networkBandwidth) != 0) {
      return false;
    }
    return Float.compare(performance.storage, storage) == 0;
  }

  @Override
  public int hashCode() {
    int result = (cpuUsage != +0.0f ? Float.floatToIntBits(cpuUsage) : 0);
    result = 31 * result + (memoryUsage != +0.0f ? Float.floatToIntBits(memoryUsage) : 0);
    result = 31 * result + (networkBandwidth != +0.0f ? Float.floatToIntBits(networkBandwidth) : 0);
    result = 31 * result + (storage != +0.0f ? Float.floatToIntBits(storage) : 0);
    return result;
  }

}
