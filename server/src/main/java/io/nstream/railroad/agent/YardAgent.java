package io.nstream.railroad.agent;

import nstream.adapter.common.schedule.ExecutorAgent;
import swim.api.SwimLane;
import swim.api.lane.ValueLane;
import swim.structure.Value;

public class YardAgent extends ExecutorAgent {

  @SwimLane("info")
  ValueLane<Value> info = valueLane();

}
