import { DateTime, Item, MapDownlinkFastener, TimeZone, Uri, Value, ValueDownlinkFastener } from "@swim/runtime";
import { BottomAxisTrait, ChartTrait, ColTrait, DataPointTrait, DataSetTrait, DialTrait, Feel, GaugeTrait, GraphTrait, LinePlotTrait, Look, Model, ModelRef, MoodVector, RowTrait, SelectableTrait, TableTrait, TextCellTrait, Theme, Trait, TraitRef } from "@swim/toolkit";
import { EntityTrait, Status, StatusTrait, StatusFactor, StatusVector, WidgetGroup, WidgetTrait } from "@swim/platform";

export class YardWidgets extends WidgetGroup {

  protected updateTable(table: ModelRef<this, Model>, key: Value, value: Value): void {
    const rowModel = this.getOrCreateRowModel(table, key);
    const keyCell = rowModel.getTrait("key", TextCellTrait);
    keyCell!.content(key.stringValue(""));
    const timeCell = rowModel.getTrait("time", TextCellTrait);
    const reportTime = new DateTime(value.get("reportTime").numberValue(void 0)!, TimeZone.forOffset(-480));
    timeCell!.content(this.getTimeStr(reportTime));

    const statusCell = rowModel.getTrait("status", TextCellTrait);
    const offline = value.get("isOffline").booleanValue(false);
    const idle = value.get("isIdle").booleanValue(false);
    const alertStatus = value.get("alertStatus").stringValue("");
    let status;
    if (offline) {
      status = "Offline";
      rowModel.getTrait(StatusTrait)!.setStatusFactor("status", this.getAlertStatusFromFlag(true));
    } else if (idle) {
      status = "Idle";
      rowModel.getTrait(StatusTrait)!.setStatusFactor("status", this.getWarningStatusFromFlag(true));
    } else {
      status = alertStatus;
      rowModel.getTrait(StatusTrait)!.setStatusFactor("status", this.getStatusFactorFromAlert(alertStatus));
    }
    statusCell!.content(status);
  }

  protected updateStatusTable(value: Value): void {
    const tableModel = this.statusTable.model!;
    const total = value.get("totalCount").numberValue(0);
    const totalRowModel = tableModel.getChild("total")!;
    totalRowModel.getTrait("value", TextCellTrait)!.content(total + "");

    const alertCount = value.get("alertCount").numberValue(0);
    const alertRowModel = tableModel.getChild("alert")!;
    alertRowModel.getTrait("value", TextCellTrait)!.content(alertCount + "");

    const warningCount = value.get("warningCount").numberValue(0);
    const warningRowModel = tableModel.getChild("warning")!;
    warningRowModel.getTrait("value", TextCellTrait)!.content(warningCount + "");

  }

  protected removeFromTable(table: ModelRef<this, Model>, key: Value): void {
    const tableModel = table.model!;
    let rowModel = tableModel.getChild(key.stringValue(""));
    if (rowModel != null) {
      tableModel.removeChild(rowModel);      
    }
  }

  getOrCreateRowModel(table: ModelRef<this, Model>, key: Value): Model {
    const tableModel = table.model!;
    let rowModel = tableModel.getChild(key.stringValue(""));
    if (rowModel == null) {
      rowModel = this.createRowModel(key);
    }
    tableModel.appendChild(rowModel, key.stringValue(""));
    return rowModel;
  }

  createRowModel(key: Value): Model {
    const rowModel = new Model();
    const rowTrait = new RowTrait();
    const keyCell = new TextCellTrait();
    keyCell.content(key.stringValue(""));
    rowModel.setTrait("row", rowTrait);
    rowModel.setTrait("key", keyCell);
    rowModel.setTrait("time", new TextCellTrait());
    rowModel.setTrait("status", new TextCellTrait());
    rowModel.setTrait("statusTrait", new StatusTrait());
    return rowModel;
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

  getWarningStatusFromFlag(flag: boolean): StatusFactor | null {
    if (flag) return StatusFactor.create("Severity", StatusVector.of([Status.warning, 2]));
    return null;
  }

  getAlertStatusFromFlag(flag: boolean): StatusFactor | null {
    if (flag) return StatusFactor.create("Severity", StatusVector.of([Status.alert, 2]));
    return null;
  }

  @ModelRef<YardWidgets, Model>({
    key: "alertsTable",
    createModel(): Model {
      const tableModel = new Model();
      tableModel.appendTrait(TableTrait, "table")
        .colSpacing(12);
      tableModel.appendTrait(ColTrait, "key")
        .layout({ key: "key", grow: 1, textColor: Look.mutedColor });
      tableModel.appendTrait(ColTrait, "value")
        .layout({ key: "time", grow: 1, textColor: Look.accentColor });
      tableModel.appendTrait(ColTrait, "value")
        .layout({ key: "status", grow: 1, textColor: Look.accentColor });

      const headerRowModel = new Model();
      headerRowModel.appendTrait(RowTrait, "row");
      headerRowModel.appendTrait(TextCellTrait, "key").content("RCL");
      headerRowModel.appendTrait(TextCellTrait, "time").content("Report Time");
      headerRowModel.appendTrait(TextCellTrait, "status").content("Status");
      tableModel.appendChild(headerRowModel, "header");

      return tableModel;

    },
  })
  readonly alertsTable!: ModelRef<this, Model>;

  @ModelRef<YardWidgets, Model>({
    key: "warningsTable",
    createModel(): Model {
      const tableModel = new Model();
      tableModel.appendTrait(TableTrait, "table")
        .colSpacing(12);
      tableModel.appendTrait(ColTrait, "key")
        .layout({ key: "key", grow: 1, textColor: Look.mutedColor });
      tableModel.appendTrait(ColTrait, "value")
        .layout({ key: "time", grow: 1, textColor: Look.accentColor });
      tableModel.appendTrait(ColTrait, "value")
        .layout({ key: "status", grow: 1, textColor: Look.accentColor });

      const headerRowModel = new Model();
      headerRowModel.appendTrait(RowTrait, "row");
      headerRowModel.appendTrait(TextCellTrait, "key").content("RCL");
      headerRowModel.appendTrait(TextCellTrait, "time").content("Report Time");
      headerRowModel.appendTrait(TextCellTrait, "status").content("Status");
      tableModel.appendChild(headerRowModel, "header");

      return tableModel;

    },
  })
  readonly warningsTable!: ModelRef<this, Model>;

  @ModelRef<YardWidgets, Model>({
    key: "statusTable",
    createModel(): Model {
      const tableModel = new Model();
      tableModel.appendTrait(TableTrait, "table")
        .colSpacing(12);
      tableModel.appendTrait(ColTrait, "key")
        .layout({ key: "key", grow: 3, textColor: Look.mutedColor });
      tableModel.appendTrait(ColTrait, "value")
        .layout({ key: "value", grow: 2, textColor: Look.accentColor });

      const totalRowModel = new Model();
      totalRowModel.appendTrait(RowTrait, "row");
      totalRowModel.appendTrait(TextCellTrait, "key")
        .content("Total");
      totalRowModel.appendTrait(TextCellTrait, "value");
      tableModel.appendChild(totalRowModel, "total");

      const alertRowModel = new Model();
      alertRowModel.appendTrait(RowTrait, "row");
      alertRowModel.appendTrait(TextCellTrait, "key")
        .content("Alerts");
        alertRowModel.appendTrait(TextCellTrait, "value");
      tableModel.appendChild(alertRowModel, "alert");

      const warningRowModel = new Model();
      warningRowModel.appendTrait(RowTrait, "row");
      warningRowModel.appendTrait(TextCellTrait, "key")
        .content("Warnings");
      warningRowModel.appendTrait(TextCellTrait, "value");
      tableModel.appendChild(warningRowModel, "warning");

      return tableModel;

    },
  })
  readonly statusTable!: ModelRef<this, Model>;

  @ModelRef<YardWidgets, Model>({
    key: "alerts",
    binds: true,
    observes: true,
    createModel(): Model {
      const widgetModel = new Model();
      const widgetTrait = new WidgetTrait();
      widgetTrait.title.setValue("ALERTS");
      widgetTrait.subtitle.setValue("YARD");
      widgetModel.setTrait("widget", widgetTrait);

      this.owner.alertsTable.insertModel(widgetModel);

      return widgetModel;
    },
  })
  readonly alertsWidget!: ModelRef<this, Model>;

  @ModelRef<YardWidgets, Model>({
    key: "warnings",
    binds: true,
    observes: true,
    createModel(): Model {
      const widgetModel = new Model();
      const widgetTrait = new WidgetTrait();
      widgetTrait.title.setValue("WARNINGS");
      widgetTrait.subtitle.setValue("YARD");
      widgetModel.setTrait("widget", widgetTrait);

      this.owner.warningsTable.insertModel(widgetModel);

      return widgetModel;
    },
  })
  readonly warningsWidget!: ModelRef<this, Model>;

  @ModelRef<YardWidgets, Model>({
    key: "status",
    binds: true,
    observes: true,
    createModel(): Model {
      const widgetModel = new Model();
      const widgetTrait = new WidgetTrait();
      widgetTrait.title.setValue("SUMMARY");
      widgetTrait.subtitle.setValue("YARD");
      widgetModel.setTrait("widget", widgetTrait);

      this.owner.statusTable.insertModel(widgetModel);

      return widgetModel;
    },
  })
  readonly statusWidget!: ModelRef<this, Model>;

  // Downlinks

  @MapDownlinkFastener<YardWidgets, Value>({
    nodeUri(): Uri {
      return this.owner.entity.trait!.uri;
    },
    laneUri: "alertRcls",
    didUpdate(key: Value, newValue: Value, oldValue: Value): void {
      this.owner.updateTable(this.owner.alertsTable, key, newValue);
    },
    didRemove(key: Value): void {
      this.owner.removeFromTable(this.owner.alertsTable, key);
    },
  })
  readonly alertRclsDownlink!: MapDownlinkFastener<this, Value>;

  @MapDownlinkFastener<YardWidgets, Value>({
    nodeUri(): Uri {
      return this.owner.entity.trait!.uri;
    },
    laneUri: "warningRcls",
    didUpdate(key: Value, newValue: Value, oldValue: Value): void {
      this.owner.updateTable(this.owner.warningsTable, key, newValue);
    },
    didRemove(key: Value): void {
      this.owner.removeFromTable(this.owner.warningsTable, key);
    },    
  })
  readonly warningRclsDownlink!: MapDownlinkFastener<this, Value>;


  @ValueDownlinkFastener<YardWidgets, Value>({
    nodeUri(): Uri {
      return this.owner.entity.trait!.uri;
    },
    consumed: true,
    laneUri: "status",
    didSet(newValue: Value, oldValue: Value): void {
      this.owner.updateStatusTable(newValue);
    },
  })
  readonly statusDownlink!:ValueDownlinkFastener<this, Value>;

  @TraitRef<YardWidgets, SelectableTrait>({
    type: SelectableTrait,
    binds: true,
    observes: true,
    traitDidSelect(): void {
      this.owner.statusWidget.insertModel();
      this.owner.alertsWidget.insertModel();
      this.owner.warningsWidget.insertModel();
      this.owner.statusDownlink.consume(this.owner);
      this.owner.alertRclsDownlink.consume(this.owner);
      this.owner.warningRclsDownlink.consume(this.owner);
    },
    traitWillUnselect(): void {
      this.owner.statusDownlink.unconsume(this.owner);
      this.owner.statusWidget.deleteModel();
      this.owner.statusTable.deleteModel();

      this.owner.alertRclsDownlink.unconsume(this.owner);
      this.owner.alertsWidget.deleteModel();
      this.owner.alertsTable.deleteModel();
      
      this.owner.warningRclsDownlink.unconsume(this.owner);
      this.owner.warningsWidget.deleteModel();
      this.owner.warningsTable.deleteModel();
     },
    detectTrait(trait: Trait): SelectableTrait | null {
      return trait instanceof SelectableTrait ? trait : null;
    },
  })
  readonly selectable!: TraitRef<this, SelectableTrait>;

  @TraitRef<YardWidgets, EntityTrait>({
    type: EntityTrait,
    binds: true,
    detectTrait(trait: Trait): EntityTrait | null {
      return trait instanceof EntityTrait ? trait : null;
    },
  })
  readonly entity!: TraitRef<this, EntityTrait>;

}
