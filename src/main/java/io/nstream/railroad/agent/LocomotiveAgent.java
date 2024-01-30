package io.nstream.railroad.agent;

import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.ValueLane;
import swim.structure.Value;

public class LocomotiveAgent extends AbstractAgent {

  @SwimLane("locomotiveMetrics")
  ValueLane<Value> locomotiveMetrics = valueLane();

}
