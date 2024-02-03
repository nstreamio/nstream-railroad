package io.nstream.railroad.agent;

import java.util.Iterator;
import nstream.adapter.common.schedule.ExecutorAgent;
import swim.api.SwimLane;
import swim.api.lane.CommandLane;
import swim.api.lane.JoinValueLane;
import swim.api.lane.MapLane;
import swim.api.lane.ValueLane;
import swim.structure.Record;
import swim.structure.Value;

public class YardAgent extends ExecutorAgent {

  @SwimLane("info")
  ValueLane<Value> info = valueLane();

  @SwimLane("rails")
  MapLane<String, Value> rails = mapLane();

  @SwimLane("addRail")
  CommandLane<Value> addRail = this.<Value>commandLane().onCommand(v -> this.rails.put(v.get("railId").stringValue(), v));

  @SwimLane("agents")
  JoinValueLane<Value, Value> agents = this.<Value, Value>joinValueLane()
        .didUpdate((k, n, o) -> {
          updateStatus();
          updateAlertsAndWarnings(k, n);

        });

  @SwimLane("status")
  ValueLane<Value> status = valueLane();

  @SwimLane("alertRcls")
  MapLane<Value, Value> alertRcls = mapLane();

  @SwimLane("warningRcls")
  MapLane<Value, Value> warningRcls = mapLane();

  private void updateAlertsAndWarnings(Value rclUri, Value rclStatus) {
    final boolean isCriticalAlert = rclStatus.get("isCriticalAlert").booleanValue();
    final boolean isOffline = rclStatus.get("isOffline").booleanValue();
    final boolean isIdle = rclStatus.get("isIdle").booleanValue();
    final boolean isWarning = rclStatus.get("alertStatus").stringValue("").equals("Warning");
    if (isCriticalAlert || isOffline) {
      this.alertRcls.put(rclUri, rclStatus);
      this.warningRcls.remove(rclUri);
    } else if (isIdle || isWarning) {
      this.warningRcls.put(rclUri, rclStatus);
      this.alertRcls.remove(rclUri);
    } else {
      this.alertRcls.remove(rclUri);
      this.warningRcls.remove(rclUri);
    }
  }

  private void updateStatus() {
    final Iterator<Value> keyIterator = this.agents.keyIterator();
    int totalCount = 0, alertCount = 0, warningCount = 0;
    while (keyIterator.hasNext()) {
      final Value key = keyIterator.next();
      final Value rclStatus = this.agents.get(key);
      final boolean isCriticalAlert = rclStatus.get("isCriticalAlert").booleanValue();
      final boolean isOffline = rclStatus.get("isOffline").booleanValue();
      final boolean isIdle = rclStatus.get("isIdle").booleanValue();
      final boolean isWarning = rclStatus.get("alertStatus").stringValue("").equals("Warning");
      totalCount++;
      if (isCriticalAlert || isOffline) {
        alertCount++;
      } else if (isIdle || isWarning) {
        warningCount++;
      }
    }
    final Record record = Record.create(3).slot("totalCount", totalCount).slot("alertCount", alertCount).slot("warningCount", warningCount);
    this.status.set(record);
  }

}
