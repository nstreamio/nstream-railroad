package io.nstream.railroad.model;

public class Alert {

  private long timestamp;
  private String alertType;
  private String message;

  public Alert() {
  }

  public long getTimestamp() {
    return timestamp;
  }

  public Alert setTimestamp(long timestamp) {
    this.timestamp = timestamp;
    return this;
  }

  public String getAlertType() {
    return alertType;
  }

  public Alert setAlertType(String alertType) {
    this.alertType = alertType;
    return this;
  }

  public boolean isCritical() {
    return "Critical".equals(this.alertType);
  }

  public String getMessage() {
    return message;
  }

  public Alert setMessage(String message) {
    this.message = message;
    return this;
  }
}
