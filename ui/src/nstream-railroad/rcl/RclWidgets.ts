import { DateTime, Item, MapDownlinkFastener, TimeZone, Uri, Value, ValueDownlinkFastener } from "@swim/runtime";
import { BottomAxisTrait, ChartTrait, ColTrait, DataPointTrait, DataSetTrait, DialTrait, Feel, GaugeTrait, GraphTrait, LinePlotTrait, Look, Model, ModelRef, MoodVector, RowTrait, SelectableTrait, TableTrait, TextCellTrait, Theme, Trait, TraitRef } from "@swim/toolkit";
import { EntityTrait, Status, StatusTrait, StatusFactor, StatusVector, WidgetGroup, WidgetTrait } from "@swim/platform";

export class RclWidgets extends WidgetGroup {

  // Status Widget

  protected updateStatusTable(value: Value): void {
    const tableModel = this.statusTable.model!;

    const offline = value.get("isOffline").booleanValue(false);
    const offlineRowModel = tableModel.getChild("offline")!;
    offlineRowModel.getTrait("value", TextCellTrait)!.content(offline + "");
    offlineRowModel.getTrait(StatusTrait)!.setStatusFactor("status", this.getAlertStatusFromFlag(offline));

    const reportTime = new DateTime(value.get("reportTime").numberValue(void 0)!, TimeZone.forOffset(-480));
    const reportTimeRowModel = tableModel.getChild("reportTime")!;
    reportTimeRowModel.getTrait("value", TextCellTrait)!.content(this.getTimeStr(reportTime));
    reportTimeRowModel.getTrait(StatusTrait)!.setStatusFactor("status", this.getAlertStatusFromFlag(offline));

    const idle = value.get("isIdle").booleanValue(false);
    const idleRowModel = tableModel.getChild("idle")!;
    idleRowModel.getTrait("value", TextCellTrait)!.content(idle + "");
    idleRowModel.getTrait(StatusTrait)!.setStatusFactor("status", this.getWarningStatusFromFlag(idle));

    const locationChangeTime = new DateTime(value.get("locationChangeTime").numberValue(void 0)!, TimeZone.forOffset(-480));
    const locationChangeTimeRowModel = tableModel.getChild("locationChangeTime")!;
    locationChangeTimeRowModel.getTrait("value", TextCellTrait)!.content(this.getTimeStr(locationChangeTime));
    locationChangeTimeRowModel.getTrait(StatusTrait)!.setStatusFactor("status", this.getWarningStatusFromFlag(idle));

    const alertStatus = value.get("alertStatus").stringValue("");
    const alertStatusRowModel = tableModel.getChild("alertStatus")!;
    alertStatusRowModel.getTrait("value", TextCellTrait)!.content(alertStatus + "");
    alertStatusRowModel.getTrait(StatusTrait)!.setStatusFactor("status", this.getStatusFactorFromAlert(alertStatus));

    const alertTime = new DateTime(value.get("alertTime").numberValue(void 0)!, TimeZone.forOffset(-480));
    const alertTimeRowModel = tableModel.getChild("alertTime")!;
    alertTimeRowModel.getTrait("value", TextCellTrait)!.content(this.getTimeStr(alertTime));
    alertTimeRowModel.getTrait(StatusTrait)!.setStatusFactor("status", this.getStatusFactorFromAlert(alertStatus));

  }

  private getTimeStr(time: DateTime): string {
    const hour = time.hour < 10 ? "0" + time.hour : time.hour;
    const minute = time.minute < 10 ? "0" + time.minute : time.minute;
    const second = time.second < 10 ? "0" + time.second : time.second;
    return hour + ":" + minute + ":" + second;
  }
  
  private getStatusFactorFromAlert(alertType: string): StatusFactor | null {
    if (alertType == "Warning") return StatusFactor.create("Severity", StatusVector.of([Status.warning, 2]));
    if (alertType == "Critical") return StatusFactor.create("Severity", StatusVector.of([Status.alert, 2]));

    return null;
  }

  @ModelRef<RclWidgets, Model>({
    key: "statusTable",
    createModel(): Model {
      const tableModel = new Model();
      tableModel.appendTrait(TableTrait, "table")
        .colSpacing(12);
      tableModel.appendTrait(ColTrait, "key")
        .layout({ key: "key", grow: 3, textColor: Look.mutedColor });
      tableModel.appendTrait(ColTrait, "value")
        .layout({ key: "value", grow: 2, textColor: Look.accentColor });

      const offlineRowModel = new Model();
      offlineRowModel.appendTrait(RowTrait, "row");
      offlineRowModel.appendTrait(TextCellTrait, "key")
        .content("Offline");
      offlineRowModel.appendTrait(TextCellTrait, "value");
      offlineRowModel.appendTrait(StatusTrait, "status");
      tableModel.appendChild(offlineRowModel, "offline");

      const reportTimeRowModel = new Model();
      reportTimeRowModel.appendTrait(RowTrait, "row");
      reportTimeRowModel.appendTrait(TextCellTrait, "key")
        .content("Last Updated Time");
      reportTimeRowModel.appendTrait(TextCellTrait, "value");
      reportTimeRowModel.appendTrait(StatusTrait, "status");
      tableModel.appendChild(reportTimeRowModel, "reportTime");

      const idleRowModel = new Model();
      idleRowModel.appendTrait(RowTrait, "row");
      idleRowModel.appendTrait(TextCellTrait, "key")
        .content("Idle");
      idleRowModel.appendTrait(TextCellTrait, "value");
      idleRowModel.appendTrait(StatusTrait, "status");
      tableModel.appendChild(idleRowModel, "idle");

      const locationChangeTimeRowModel = new Model();
      locationChangeTimeRowModel.appendTrait(RowTrait, "row");
      locationChangeTimeRowModel.appendTrait(TextCellTrait, "key")
        .content("Last Location Change Time");
      locationChangeTimeRowModel.appendTrait(TextCellTrait, "value");
      locationChangeTimeRowModel.appendTrait(StatusTrait, "status");
      tableModel.appendChild(locationChangeTimeRowModel, "locationChangeTime");

      const alertStatusRowModel = new Model();
      alertStatusRowModel.appendTrait(RowTrait, "row");
      alertStatusRowModel.appendTrait(TextCellTrait, "key")
        .content("Alert Type");
      alertStatusRowModel.appendTrait(TextCellTrait, "value");
      alertStatusRowModel.appendTrait(StatusTrait, "status");
      tableModel.appendChild(alertStatusRowModel, "alertStatus");

      const alertTimeRowModel = new Model();
      alertTimeRowModel.appendTrait(RowTrait, "row");
      alertTimeRowModel.appendTrait(TextCellTrait, "key")
        .content("Alert Time");
      alertTimeRowModel.appendTrait(TextCellTrait, "value");
      alertTimeRowModel.appendTrait(StatusTrait, "status");
      tableModel.appendChild(alertTimeRowModel, "alertTime");

      return tableModel;
    },
  })
  readonly statusTable!: ModelRef<this, Model>;

  @ModelRef<RclWidgets, Model>({
    key: "status",
    binds: true,
    observes: true,
    createModel(): Model {
      const widgetModel = new Model();
      const widgetTrait = new WidgetTrait();
      widgetTrait.title.setValue("STATUS");
      widgetTrait.subtitle.setValue("RCL");
      widgetModel.setTrait("widget", widgetTrait);

      this.owner.statusTable.insertModel(widgetModel);

      return widgetModel;
    },
  })
  readonly statusWidget!: ModelRef<this, Model>;


  // Operation Widget

  // Operation Gauge
  protected updateOperationGauge(value: Value): void {
    const gaugeModel = this.operationGauge.model!;

    const brakeLevel = value.get("brakeLevel").numberValue();
    const brakeDialModel = gaugeModel.getChild("brake")!;
    brakeDialModel.getTrait(DialTrait)!
        .legend("Brake (" + brakeLevel + "%)")
        .value(brakeLevel!);
    //brakeDialModel.getTrait(StatusTrait)!.setStatusFactor("brake", this.getStatusFactorFromScore(brakeLevel));

    const fuelLevel = value.get("fuelLevel").numberValue();
    const fuelDialModel = gaugeModel.getChild("fuel")!;
    fuelDialModel.getTrait(DialTrait)!
        .legend("Fuel (" + fuelLevel + "%)")
        .value(fuelLevel!);
   fuelDialModel.getTrait(StatusTrait)!.setStatusFactor("fuel", this.getStatusFactorFromLowPercentage(fuelLevel!));
  }

  @ModelRef<RclWidgets, Model>({
    key: "operationGauge",
    createModel(): Model {
      const gaugeModel = new Model();
      gaugeModel.appendTrait(GaugeTrait, "gauge")
          .limit(100);

      const brakeDialModel = new Model();
      brakeDialModel.appendTrait(DialTrait, "brake");
      brakeDialModel.appendTrait(StatusTrait, "status");
      gaugeModel.setChild("brake", brakeDialModel);

      const fuelDialModel = new Model();
      fuelDialModel.appendTrait(DialTrait, "fuel");
      fuelDialModel.appendTrait(StatusTrait, "status");
      gaugeModel.setChild("fuel", fuelDialModel);
      return gaugeModel;
    },
  })
  readonly operationGauge!: ModelRef<this, Model>;

  protected updateOperationTable(value: Value): void {
    const tableModel = this.operationTable.model!;

    const doorOpen = value.get("isDoorOpen").booleanValue(false);
    const doorOpenRowModel = tableModel.getChild("doorOpen")!;
    doorOpenRowModel.getTrait("value", TextCellTrait)!.content(doorOpen + "");
    doorOpenRowModel.getTrait(StatusTrait)!.setStatusFactor("status", this.getWarningStatusFromFlag(doorOpen));

    const emergencyBrake = value.get("isEmergencyBrake").booleanValue(false);
    const emergencyBrakeRowModel = tableModel.getChild("emergencyBrake")!;
    emergencyBrakeRowModel.getTrait("value", TextCellTrait)!.content(emergencyBrake + "");
    emergencyBrakeRowModel.getTrait(StatusTrait)!.setStatusFactor("status", this.getWarningStatusFromFlag(emergencyBrake));

    const brakeLevel = value.get("brakeLevel").numberValue();
    const brakeLevelRowModel = tableModel.getChild("brakeLevel")!;
    brakeLevelRowModel.getTrait("value", TextCellTrait)!.content(brakeLevel + "%");

    const fuelLevel = value.get("fuelLevel").numberValue();
    const fuelLevelRowModel = tableModel.getChild("fuelLevel")!;
    fuelLevelRowModel.getTrait("value", TextCellTrait)!.content(fuelLevel + "%");
    fuelLevelRowModel.getTrait(StatusTrait)!.setStatusFactor("status", this.getStatusFactorFromLowPercentage(fuelLevel!));

    const engineFault = value.get("isEngineFault").booleanValue(false);
    const engineFaultRowModel = tableModel.getChild("engineFault")!;
    engineFaultRowModel.getTrait("value", TextCellTrait)!.content(engineFault + "");
    engineFaultRowModel.getTrait(StatusTrait)!.setStatusFactor("status", this.getWarningStatusFromFlag(engineFault));    

    const engineTemperature = value.get("engineTemperature").numberValue();
    const engineTemperatureRowModel = tableModel.getChild("engineTemperature")!;
    engineTemperatureRowModel.getTrait("value", TextCellTrait)!.content(engineTemperature + "F");

    const throttle = value.get("throttle").numberValue();
    const throttleRowModel = tableModel.getChild("throttle")!;
    throttleRowModel.getTrait("value", TextCellTrait)!.content(throttle + "%");
  }

  getWarningStatusFromFlag(flag: boolean): StatusFactor | null {
    if (flag) return StatusFactor.create("Severity", StatusVector.of([Status.warning, 2]));
    return null;    
  }

  getAlertStatusFromFlag(flag: boolean): StatusFactor | null {
    if (flag) return StatusFactor.create("Severity", StatusVector.of([Status.alert, 2]));
    return null;    
  }

  @ModelRef<RclWidgets, Model>({
    key: "operationTable",
    createModel(): Model {
      const tableModel = new Model();
      tableModel.appendTrait(TableTrait, "table")
        .colSpacing(12);
      tableModel.appendTrait(ColTrait, "key")
        .layout({ key: "key", grow: 3, textColor: Look.mutedColor });
      tableModel.appendTrait(ColTrait, "value")
        .layout({ key: "value", grow: 2, textColor: Look.accentColor });

      const doorOpenRowModel = new Model();
      doorOpenRowModel.appendTrait(RowTrait, "row");
      doorOpenRowModel.appendTrait(TextCellTrait, "key")
        .content("Door Open");
      doorOpenRowModel.appendTrait(TextCellTrait, "value");
      doorOpenRowModel.appendTrait(StatusTrait, "status");
      tableModel.appendChild(doorOpenRowModel, "doorOpen");

      const brakeLevelRowModel = new Model();
      brakeLevelRowModel.appendTrait(RowTrait, "row");
      brakeLevelRowModel.appendTrait(TextCellTrait, "key")
        .content("Brake Level");
      brakeLevelRowModel.appendTrait(TextCellTrait, "value");
      brakeLevelRowModel.appendTrait(StatusTrait, "status");
      tableModel.appendChild(brakeLevelRowModel, "brakeLevel");

      const emergencyBrakeRowModel = new Model();
      emergencyBrakeRowModel.appendTrait(RowTrait, "row");
      emergencyBrakeRowModel.appendTrait(TextCellTrait, "key")
        .content("Emergency Brake");
      emergencyBrakeRowModel.appendTrait(TextCellTrait, "value");
      emergencyBrakeRowModel.appendTrait(StatusTrait, "status");
      tableModel.appendChild(emergencyBrakeRowModel, "emergencyBrake");

      const fuelLevelRowModel = new Model();
      fuelLevelRowModel.appendTrait(RowTrait, "row");
      fuelLevelRowModel.appendTrait(TextCellTrait, "key")
        .content("Fuel Level");
      fuelLevelRowModel.appendTrait(TextCellTrait, "value");
      fuelLevelRowModel.appendTrait(StatusTrait, "status");
      tableModel.appendChild(fuelLevelRowModel, "fuelLevel");

      const engineFaultRowModel = new Model();
      engineFaultRowModel.appendTrait(RowTrait, "row");
      engineFaultRowModel.appendTrait(TextCellTrait, "key")
        .content("Engine Fault");
      engineFaultRowModel.appendTrait(TextCellTrait, "value");
      engineFaultRowModel.appendTrait(StatusTrait, "status");
      tableModel.appendChild(engineFaultRowModel, "engineFault");

      const engineTemperatureRowModel = new Model();
      engineTemperatureRowModel.appendTrait(RowTrait, "row");
      engineTemperatureRowModel.appendTrait(TextCellTrait, "key")
        .content("Engine Temperature");
      engineTemperatureRowModel.appendTrait(TextCellTrait, "value");
      engineTemperatureRowModel.appendTrait(StatusTrait, "status");
      tableModel.appendChild(engineTemperatureRowModel, "engineTemperature");

      const throttleRowModel = new Model();
      throttleRowModel.appendTrait(RowTrait, "row");
      throttleRowModel.appendTrait(TextCellTrait, "key")
        .content("Throttle");
      throttleRowModel.appendTrait(TextCellTrait, "value");
      throttleRowModel.appendTrait(StatusTrait, "status");
      tableModel.appendChild(throttleRowModel, "throttle");

      return tableModel;
    },
  })
  readonly operationTable!: ModelRef<this, Model>;

  @ModelRef<RclWidgets, Model>({
    key: "operation",
    binds: true,
    observes: true,
    createModel(): Model {
      const widgetModel = new Model();
      const widgetTrait = new WidgetTrait();
      widgetTrait.title.setValue("OPERATION");
      widgetTrait.subtitle.setValue("LOCOMOTIVE");
      widgetModel.setTrait("widget", widgetTrait);

      this.owner.operationGauge.insertModel(widgetModel);
      this.owner.operationTable.insertModel(widgetModel);

      return widgetModel;
    },
  })
  readonly operationWidget!: ModelRef<this, Model>;

  // Performance Widget

  // Performance Gauge
  protected updatePerformanceGauge(value: Value): void {
    const gaugeModel = this.performanceGauge.model!;

    const cpu = value.get("cpuUsage").numberValue();
    const cpuDialModel = gaugeModel.getChild("cpu")!;
    cpuDialModel.getTrait(DialTrait)!
        .legend("CPU (" + cpu + "%)")
        .value(cpu!);
    cpuDialModel.getTrait(StatusTrait)!.setStatusFactor("cpu", this.getStatusFactorFromHighPercentage(cpu!));

    const memory = value.get("memoryUsage").numberValue();
    const memoryDialModel = gaugeModel.getChild("memory")!;
    memoryDialModel.getTrait(DialTrait)!
        .legend("Memory (" + memory + "%)")
        .value(memory!);
   memoryDialModel.getTrait(StatusTrait)!.setStatusFactor("memory", this.getStatusFactorFromLowPercentage(memory!));
  }

  @ModelRef<RclWidgets, Model>({
    key: "performanceGauge",
    createModel(): Model {
      const gaugeModel = new Model();
      gaugeModel.appendTrait(GaugeTrait, "gauge")
          .limit(100);

      const cpuDialModel = new Model();
      cpuDialModel.appendTrait(DialTrait, "cpu");
      cpuDialModel.appendTrait(StatusTrait, "status");
      gaugeModel.setChild("cpu", cpuDialModel);

      const memoryDialModel = new Model();
      memoryDialModel.appendTrait(DialTrait, "memory");
      memoryDialModel.appendTrait(StatusTrait, "status");
      gaugeModel.setChild("memory", memoryDialModel);
      return gaugeModel;
    },
  })
  readonly performanceGauge!: ModelRef<this, Model>;

  protected updatePerformanceTable(value: Value): void {
    const tableModel = this.performanceTable.model!;

    const cpuUsage = value.get("cpuUsage").numberValue(0);
    const cpuUsageRowModel = tableModel.getChild("cpuUsage")!;
    cpuUsageRowModel.getTrait("value", TextCellTrait)!.content(cpuUsage + "");
    cpuUsageRowModel.getTrait(StatusTrait)!.setStatusFactor("status", this.getStatusFactorFromHighPercentage(cpuUsage));

    const memoryUsage = value.get("memoryUsage").numberValue(0);
    const memoryUsageRowModel = tableModel.getChild("memoryUsage")!;
    memoryUsageRowModel.getTrait("value", TextCellTrait)!.content(memoryUsage + "");      
    memoryUsageRowModel.getTrait(StatusTrait)!.setStatusFactor("status", this.getStatusFactorFromHighPercentage(memoryUsage));

    const networkBandwidthRowModel = tableModel.getChild("networkBandwidth")!;
    networkBandwidthRowModel.getTrait("value", TextCellTrait)!
      .content(value.get("networkBandwidth").stringValue(""));

    const storageRowModel = tableModel.getChild("storage")!;
    storageRowModel.getTrait("value", TextCellTrait)!
      .content(value.get("storage").stringValue(""));
  }

  getStatusFactorFromHighPercentage(usage: number): StatusFactor | null {
    if (usage > 95) return StatusFactor.create("Severity", StatusVector.of([Status.alert, 2]));
    if (usage > 85) return StatusFactor.create("Severity", StatusVector.of([Status.warning, 2]));
    return null;    
  }

  getStatusFactorFromLowPercentage(usage: number): StatusFactor | null {
    if (usage < 5) return StatusFactor.create("Severity", StatusVector.of([Status.alert, 2]));
    if (usage < 15) return StatusFactor.create("Severity", StatusVector.of([Status.warning, 2]));
    return null;
  }

  @ModelRef<RclWidgets, Model>({
    key: "performanceTable",
    createModel(): Model {
      const tableModel = new Model();
      tableModel.appendTrait(TableTrait, "table")
        .colSpacing(12);
      tableModel.appendTrait(ColTrait, "key")
        .layout({ key: "key", grow: 3, textColor: Look.mutedColor });
      tableModel.appendTrait(ColTrait, "value")
        .layout({ key: "value", grow: 2, textColor: Look.accentColor });

      const cpuUsageRowModel = new Model();
      cpuUsageRowModel.appendTrait(RowTrait, "row");
      cpuUsageRowModel.appendTrait(TextCellTrait, "key")
        .content("CPU Usage");
      cpuUsageRowModel.appendTrait(TextCellTrait, "value");
      cpuUsageRowModel.appendTrait(StatusTrait, "status");
      tableModel.appendChild(cpuUsageRowModel, "cpuUsage");

      const memoryUsageRowModel = new Model();
      memoryUsageRowModel.appendTrait(RowTrait, "row");
      memoryUsageRowModel.appendTrait(TextCellTrait, "key")
        .content("Memory Usage");
      memoryUsageRowModel.appendTrait(TextCellTrait, "value");
      memoryUsageRowModel.appendTrait(StatusTrait, "status");
      tableModel.appendChild(memoryUsageRowModel, "memoryUsage");

      const networkBandwidthRowModel = new Model();
      networkBandwidthRowModel.appendTrait(RowTrait, "row");
      networkBandwidthRowModel.appendTrait(TextCellTrait, "key")
        .content("Network Bandwidth");
      networkBandwidthRowModel.appendTrait(TextCellTrait, "value");
      tableModel.appendChild(networkBandwidthRowModel, "networkBandwidth");

      const storageRowModel = new Model();
      storageRowModel.appendTrait(RowTrait, "row");
      storageRowModel.appendTrait(TextCellTrait, "key")
        .content("Storage");
      storageRowModel.appendTrait(TextCellTrait, "value");
      tableModel.appendChild(storageRowModel, "storage");

      return tableModel;
    },
  })
  readonly performanceTable!: ModelRef<this, Model>;


  @ModelRef<RclWidgets, Model>({
    key: "performance",
    binds: true,
    observes: true,
    createModel(): Model {
      const widgetModel = new Model();
      const widgetTrait = new WidgetTrait();
      widgetTrait.title.setValue("PERFORMANCE");
      widgetTrait.subtitle.setValue("RCU");
      widgetModel.setTrait("widget", widgetTrait);

      this.owner.performanceGauge.insertModel(widgetModel);
      this.owner.performanceTable.insertModel(widgetModel);

      return widgetModel;
    },
  })
  readonly performanceWidget!: ModelRef<this, Model>;

  // Health Widget

  protected updateHealthTable(value: Value): void {
    const tableModel = this.healthTable.model!;

    const temperatureRowModel = tableModel.getChild("temperature")!;
    temperatureRowModel.getTrait("value", TextCellTrait)!
      .content(value.get("temperature").stringValue(""));

    const batteryRowModel = tableModel.getChild("battery")!;
    batteryRowModel.getTrait("value", TextCellTrait)!
      .content(value.get("battery").stringValue(""));      

    const signalStrengthRowModel = tableModel.getChild("signalStrength")!;
    signalStrengthRowModel.getTrait("value", TextCellTrait)!
      .content(value.get("signalStrength").stringValue(""));

    const powerSupplyStatusRowModel = tableModel.getChild("powerSupplyStatus")!;
    powerSupplyStatusRowModel.getTrait("value", TextCellTrait)!
      .content(value.get("powerSupplyStatus").stringValue(""));      
  }

  @ModelRef<RclWidgets, Model>({
    key: "healthTable",
    createModel(): Model {
      const tableModel = new Model();
      tableModel.appendTrait(TableTrait, "table")
        .colSpacing(12);
      tableModel.appendTrait(ColTrait, "key")
        .layout({ key: "key", grow: 3, textColor: Look.mutedColor });
      tableModel.appendTrait(ColTrait, "value")
        .layout({ key: "value", grow: 2, textColor: Look.accentColor });

      const temperatureRowModel = new Model();
      temperatureRowModel.appendTrait(RowTrait, "row");
      temperatureRowModel.appendTrait(TextCellTrait, "key")
        .content("Temperature");
      temperatureRowModel.appendTrait(TextCellTrait, "value");
      tableModel.appendChild(temperatureRowModel, "temperature");

      const batteryRowModel = new Model();
      batteryRowModel.appendTrait(RowTrait, "row");
      batteryRowModel.appendTrait(TextCellTrait, "key")
        .content("Battery");
      batteryRowModel.appendTrait(TextCellTrait, "value");
      tableModel.appendChild(batteryRowModel, "battery");

      const signalStrengthRowModel = new Model();
      signalStrengthRowModel.appendTrait(RowTrait, "row");
      signalStrengthRowModel.appendTrait(TextCellTrait, "key")
        .content("Signal Strength");
      signalStrengthRowModel.appendTrait(TextCellTrait, "value");
      tableModel.appendChild(signalStrengthRowModel, "signalStrength");

      const powerSupplyStatusRowModel = new Model();
      powerSupplyStatusRowModel.appendTrait(RowTrait, "row");
      powerSupplyStatusRowModel.appendTrait(TextCellTrait, "key")
        .content("Power Supply Status");
      powerSupplyStatusRowModel.appendTrait(TextCellTrait, "value");
      tableModel.appendChild(powerSupplyStatusRowModel, "powerSupplyStatus");

      return tableModel;
    },
  })
  readonly healthTable!: ModelRef<this, Model>;


  @ModelRef<RclWidgets, Model>({
    key: "health",
    binds: true,
    observes: true,
    createModel(): Model {
      const widgetModel = new Model();
      const widgetTrait = new WidgetTrait();
      widgetTrait.title.setValue("HEALTH");
      widgetTrait.subtitle.setValue("RCU");
      widgetModel.setTrait("widget", widgetTrait);

      this.owner.healthTable.insertModel(widgetModel);

      return widgetModel;
    },
  })
  readonly healthWidget!: ModelRef<this, Model>;

  // Info Widget

  protected updateInfoTable(value: Value): void {
    const tableModel = this.infoTable.model!;

    const systemNameRowModel = tableModel.getChild("systemName")!;
    systemNameRowModel.getTrait("value", TextCellTrait)!
      .content(value.get("systemName").stringValue(""));

    const systemTypeRowModel = tableModel.getChild("systemType")!;
    systemTypeRowModel.getTrait("value", TextCellTrait)!
      .content(value.get("systemType").stringValue(""));      

    const rclVersionRowModel = tableModel.getChild("rclVersion")!;
    rclVersionRowModel.getTrait("value", TextCellTrait)!
      .content(value.get("rclVersion").stringValue(""));

    const installDateRowModel = tableModel.getChild("installDate")!;
    installDateRowModel.getTrait("value", TextCellTrait)!
      .content(value.get("installDate").stringValue(""));      
  }

  @ModelRef<RclWidgets, Model>({
    key: "infoTable",
    createModel(): Model {
      const tableModel = new Model();
      tableModel.appendTrait(TableTrait, "table")
        .colSpacing(12);
      tableModel.appendTrait(ColTrait, "key")
        .layout({ key: "key", grow: 3, textColor: Look.mutedColor });
      tableModel.appendTrait(ColTrait, "value")
        .layout({ key: "value", grow: 2, textColor: Look.accentColor });

      const systemNameRowModel = new Model();
      systemNameRowModel.appendTrait(RowTrait, "row");
      systemNameRowModel.appendTrait(TextCellTrait, "key")
        .content("System Name");
      systemNameRowModel.appendTrait(TextCellTrait, "value");
      tableModel.appendChild(systemNameRowModel, "systemName");

      const systemTypeRowModel = new Model();
      systemTypeRowModel.appendTrait(RowTrait, "row");
      systemTypeRowModel.appendTrait(TextCellTrait, "key")
        .content("System Type");
      systemTypeRowModel.appendTrait(TextCellTrait, "value");
      tableModel.appendChild(systemTypeRowModel, "systemType");

      const rclVersionRowModel = new Model();
      rclVersionRowModel.appendTrait(RowTrait, "row");
      rclVersionRowModel.appendTrait(TextCellTrait, "key")
        .content("RCL Version");
      rclVersionRowModel.appendTrait(TextCellTrait, "value");
      tableModel.appendChild(rclVersionRowModel, "rclVersion");

      const installDateRowModel = new Model();
      installDateRowModel.appendTrait(RowTrait, "row");
      installDateRowModel.appendTrait(TextCellTrait, "key")
        .content("Install Date");
      installDateRowModel.appendTrait(TextCellTrait, "value");
      tableModel.appendChild(installDateRowModel, "installDate");

      return tableModel;
    },
  })
  readonly infoTable!: ModelRef<this, Model>;

  @ModelRef<RclWidgets, Model>({
    key: "info",
    binds: true,
    observes: true,
    createModel(): Model {
      const widgetModel = new Model();
      const widgetTrait = new WidgetTrait();
      widgetTrait.title.setValue("INFO");
      widgetTrait.subtitle.setValue("RCL");
      widgetModel.setTrait("widget", widgetTrait);

      this.owner.infoTable.insertModel(widgetModel);

      return widgetModel;
    },
  })
  readonly infoWidget!: ModelRef<this, Model>;


  // Downlinks

  @ValueDownlinkFastener<RclWidgets, Value>({
    nodeUri(): Uri {
      return this.owner.entity.trait!.uri;
    },
    laneUri: "status",
    didSet(newValue: Value, oldValue: Value): void {
      this.owner.updateStatusTable(newValue);
    },
  })
  readonly statusDownlink!: ValueDownlinkFastener<this, Value>;

  @ValueDownlinkFastener<RclWidgets, Value>({
    nodeUri(): Uri {
      return this.owner.entity.trait!.uri;
    },
    laneUri: "rcuMetrics",
    didSet(newValue: Value, oldValue: Value): void {
      this.owner.updatePerformanceTable(newValue);
      this.owner.updatePerformanceGauge(newValue);
      this.owner.updateHealthTable(newValue);
    },
  })
  readonly rcuMetricsDownlink!: ValueDownlinkFastener<this, Value>;

  @ValueDownlinkFastener<RclWidgets, Value>({
    nodeUri(): Uri {
      return this.owner.entity.trait!.uri;
    },
    laneUri: "locomotiveMetrics",
    didSet(newValue: Value, oldValue: Value): void {
      this.owner.updateOperationTable(newValue);
      this.owner.updateOperationGauge(newValue);
    },
  })
  readonly locomotiveMetricsDownlink!: ValueDownlinkFastener<this, Value>;

  @ValueDownlinkFastener<RclWidgets, Value>({
    nodeUri(): Uri {
      return this.owner.entity.trait!.uri;
    },
    laneUri: "info",
    didSet(newValue: Value, oldValue: Value): void {
      this.owner.updateInfoTable(newValue);

    },
  })
  readonly infoDownlink!: ValueDownlinkFastener<this, Value>;

  @TraitRef<RclWidgets, SelectableTrait>({
    type: SelectableTrait,
    binds: true,
    observes: true,
    traitDidSelect(): void {
      this.owner.statusWidget.insertModel();
      this.owner.operationWidget.insertModel();
      this.owner.performanceWidget.insertModel();
      this.owner.healthWidget.insertModel();
      this.owner.infoWidget.insertModel();

      this.owner.statusDownlink.consume(this.owner);
      this.owner.rcuMetricsDownlink.consume(this.owner);
      this.owner.locomotiveMetricsDownlink.consume(this.owner);
      this.owner.infoDownlink.consume(this.owner);
    },
    traitWillUnselect(): void {
      this.owner.statusDownlink.unconsume(this.owner);
      this.owner.rcuMetricsDownlink.unconsume(this.owner);
      this.owner.locomotiveMetricsDownlink.unconsume(this.owner);
      this.owner.infoDownlink.unconsume(this.owner);

      this.owner.statusWidget.deleteModel();
      this.owner.statusTable.deleteModel();

      this.owner.operationWidget.deleteModel();
      this.owner.operationTable.deleteModel();

      this.owner.performanceWidget.deleteModel();
      this.owner.performanceTable.deleteModel();

      this.owner.healthWidget.deleteModel();
      this.owner.healthTable.deleteModel();

      this.owner.infoWidget.deleteModel();
      this.owner.infoTable.deleteModel();

     },
    detectTrait(trait: Trait): SelectableTrait | null {
      return trait instanceof SelectableTrait ? trait : null;
    },
  })
  readonly selectable!: TraitRef<this, SelectableTrait>;

  @TraitRef<RclWidgets, EntityTrait>({
    type: EntityTrait,
    binds: true,
    detectTrait(trait: Trait): EntityTrait | null {
      return trait instanceof EntityTrait ? trait : null;
    },
  })
  readonly entity!: TraitRef<this, EntityTrait>;

}
