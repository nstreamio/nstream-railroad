package io.nstream.railroad.agent;

import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.ValueLane;
import swim.structure.Value;

public class RcuAgent extends AbstractAgent {

  @SwimLane("rcuMetrics")
  ValueLane<Value> rcuMetrics = valueLane();
}
