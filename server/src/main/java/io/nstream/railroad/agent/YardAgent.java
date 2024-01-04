package io.nstream.railroad.agent;

import nstream.adapter.common.schedule.ExecutorAgent;
import swim.api.SwimLane;
import swim.api.lane.CommandLane;
import swim.api.lane.MapLane;
import swim.api.lane.ValueLane;
import swim.structure.Value;

public class YardAgent extends ExecutorAgent {

  @SwimLane("info")
  ValueLane<Value> info = valueLane();

  @SwimLane("rails")
  MapLane<String, Value> rails = mapLane();

  @SwimLane("addRail")
  CommandLane<Value> addRail = this.<Value>commandLane().onCommand(v -> this.rails.put(v.get("railId").stringValue(), v));

}
