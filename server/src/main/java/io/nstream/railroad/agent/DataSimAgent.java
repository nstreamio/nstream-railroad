package io.nstream.railroad.agent;

import io.nstream.railroad.util.Simulator;
import java.io.IOException;
import java.io.InputStream;
import java.util.Iterator;
import model.Alert;
import model.Health;
import model.Operation;
import model.Performance;
import nstream.adapter.common.AdapterUtils;
import nstream.adapter.common.schedule.ExecutorAgent;
import nstream.adapter.csv.CsvIngestingAgent;
import swim.api.SwimLane;
import swim.api.lane.MapLane;
import swim.api.lane.ValueLane;
import swim.concurrent.TimerRef;
import swim.csv.Csv;
import swim.structure.Item;
import swim.structure.Record;
import swim.structure.Value;

public class DataSimAgent extends ExecutorAgent {

  /**
   * Handle to the timer that drives the simulation.
   */
  TimerRef simTicker;

  private Iterator<Item> locationsIt;
  private Value locations = Value.absent();

  private long startTime = System.currentTimeMillis();
  private boolean simIdle = false;
  private boolean simDisconnect = false;

  @SwimLane("rcuMetrics")
  ValueLane<Value> rcuMetrics = valueLane();

  @SwimLane("locomotiveMetrics")
  ValueLane<Value> locomotiveMetrics = valueLane();

  @SwimLane("info")
  ValueLane<Value> info = this.<Value>valueLane().didSet((newValue, oldValue) -> {
    loadLocationsFile(newValue.get("locationFile").stringValue());
  });

  private void loadLocationsFile(String locationsFile) {
    final byte[] csvData = loadResource(locationsFile);
    if (csvData.length == 0) {
      error(nodeUri() + ": Error loading csv resource " + locationsFile);
    } else {
      this.locations = Csv.parseTable(csvData, ',');
    }
  }

  private byte[] loadResource(String resource) {
    try (InputStream resourceStream = AdapterUtils.openFileAsStream(resource, CsvIngestingAgent.class)) {
      if (resourceStream != null) {
        return resourceStream.readAllBytes();
      }
    } catch (IOException e) {
      // swallow
    }
    return new byte[0];
  }

  void onSimTick() {
    // Reschedule the simulation timer to execute again at a random time
    // between 0 and 60 seconds from now.
    this.simTicker.reschedule(Math.round(60000L * Math.random()));

    if (this.locationsIt == null || !this.locationsIt.hasNext()) {
      locationsIt = this.locations.iterator();
    }
    if (!simIdle && !simDisconnect) {
      final Operation simOperation = Simulator.simOperation();
      final Value locMetrics =
            this.locationsIt.next()
              .updated("brakeLevel", simOperation.getBrakeLevel())
              .updated("fuelLevel", simOperation.getFuelLevel())
              .updated("engineTemperature", simOperation.getEngineTemp())
              .updated("throttle", simOperation.getThrottle())
              .updated("isDoorOpen", simOperation.isDoorOpen())
              .updated("isEmergencyBrake", simOperation.isEmergencyBrake())
              .updated("isEngineFault", simOperation.isEngineFault())
              .updated("isFuelLow", simOperation.isFuelLow());
      this.locomotiveMetrics.set(locMetrics);
    }
    if (!simDisconnect) {
      final Performance simPerformance = Simulator.simPerformance();
      final Health simHealth = Simulator.simHealth();
      final Alert simAlert = Simulator.simAlert();
      final Value v = Record.create()
            .slot("reportTime", System.currentTimeMillis())
            .slot("cpuUsage", simPerformance.getCpuUsage())
            .slot("memoryUsage", simPerformance.getMemoryUsage())
            .slot("networkBandwidth", simPerformance.getNetworkBandwidth())
            .slot("storage", simPerformance.getStorage())
            .slot("battery", simHealth.getBattery())
            .slot("powerSupplyStatus", simHealth.getPowerSupplyStatus())
            .slot("signalStrength", simHealth.getSignalStrength())
            .slot("temperature", simHealth.getTemperature())
            .slot("isCriticalAlert", simAlert.isCritical())
            .slot("alertType", simAlert.getAlertType())
            .slot("alertTime", simAlert.getTimestamp());
      this.rcuMetrics.set(v);
      if (System.currentTimeMillis() - startTime > 60000) {
        this.simIdle = this.info.get().get("simIdle").booleanValue();
        this.simDisconnect = this.info.get().get("simDisconnect").booleanValue();
      }
    }
  }

  @Override
  public void didStart() {
    // Schedule metrics simulation
    this.simTicker = setTimer(3000, this::onSimTick);
  }

}
