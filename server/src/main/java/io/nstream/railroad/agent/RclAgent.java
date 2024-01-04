package io.nstream.railroad.agent;

import nstream.adapter.common.schedule.ExecutorAgent;
import swim.api.SwimLane;
import swim.api.lane.CommandLane;
import swim.api.lane.MapLane;
import swim.api.lane.ValueLane;
import swim.concurrent.TimerRef;
import swim.structure.Value;

public class RclAgent extends ExecutorAgent {

  /**
   * Handle to the timer that determines location and communication inactivity
   */
  TimerRef inactiveTicker;

  @SwimLane("info")
  ValueLane<Value> info = valueLane();

  @SwimLane("addEvent")
  CommandLane<Value> addEvent = this.<Value>commandLane().onCommand(v -> this.info.set(v));
  
  @SwimLane("status")
  ValueLane<Value> status = this.<Value>valueLane().didSet((newValue, oldValue) -> updateGeo());

  @SwimLane("geo")
  ValueLane<Value> geo = valueLane();

  @SwimLane("locomotiveMetrics")
  ValueLane<Value> locomotiveMetrics = this.<Value>valueLane().didSet((newValue, oldValue) -> {
    final boolean isLatChange =
          Double.compare(newValue.get("latitude").doubleValue(-1.0), oldValue.get("latitude").doubleValue(-2.0)) != 0;
    final boolean isLonChange =
          Double.compare(newValue.get("longitude").doubleValue(-1.0), oldValue.get("longitude").doubleValue(-2.0)) != 0;
    if (isLatChange || isLonChange) {
      this.status.set(this.status.get()
            .updated("locationChangeTime", System.currentTimeMillis())
            .updated("isIdle", false));
    }
  });

  @SwimLane("metricsHistory")
  MapLane<Long, Value> metricsHistory = this.<Long, Value>mapLane().didUpdate((key, newValue, oldValue) -> {
    if (this.metricsHistory.size() > 5) {
      this.metricsHistory.drop(this.metricsHistory.size() - 5);
    }
  });

  private void updateGeo() {
    Value currentGeo = this.geo.get();
    Value newGeo = currentGeo
          .updated("isCriticalAlert", this.status.get().get("isCriticalAlert"))
          .updated("isOffline", this.status.get().get("isOffline"))
          .updated("isIdle", this.status.get().get("isIdle"))
          .updated("hrcuLat", this.info.get().get("hrcuLat"))
          .updated("hrcuLon", this.info.get().get("hrcuLon"))
          .updated("latitude", this.locomotiveMetrics.get().get("latitude"))
          .updated("longitude", this.locomotiveMetrics.get().get("longitude"));
    this.geo.set(newGeo);
  }

  @SwimLane("rcuMetrics")
  ValueLane<Value> rcuMetrics = this.<Value>valueLane().didSet((newValue, oldValue) -> {
    this.status.set(this.status.get()
          .updated("alertStatus", newValue.get("alertType"))
          .updated("isCriticalAlert", newValue.get("isCriticalAlert"))
          .updated("alertTime", newValue.get("alertTime"))
          .updated("reportTime", newValue.get("reportTime"))
          .updated("isOffline", false));
  });

  private void checkInactivity() {
    this.inactiveTicker.reschedule(60000L);
    final long lastReportedTime = this.rcuMetrics.get().get("reportTime").longValue(-1);
    if (lastReportedTime < 0 || System.currentTimeMillis() - lastReportedTime > 3 * 60 * 1000L) {
      this.status.set(this.status.get().updated("isOffline", true));
    }
    final long locationChangeTime = this.status.get().get("locationChangeTime").longValue(-1);
    if (locationChangeTime < 0 || System.currentTimeMillis() - locationChangeTime > 60 * 1000L) {
      this.status.set(this.status.get().updated("isIdle", true));
    }
  }

  @Override
  public void didStart() {
    // Schedule inactive detection ticker
    this.inactiveTicker = setTimer(60000, this::checkInactivity);
  }


}
