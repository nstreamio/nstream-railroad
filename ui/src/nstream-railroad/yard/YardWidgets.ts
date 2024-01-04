import { DateTime, Item, MapDownlinkFastener, TimeZone, Uri, Value, ValueDownlinkFastener } from "@swim/runtime";
import { BottomAxisTrait, ChartTrait, ColTrait, DataPointTrait, DataSetTrait, DialTrait, Feel, GaugeTrait, GraphTrait, LinePlotTrait, Look, Model, ModelRef, MoodVector, RowTrait, SelectableTrait, TableTrait, TextCellTrait, Theme, Trait, TraitRef } from "@swim/toolkit";
import { EntityTrait, Status, StatusTrait, StatusFactor, StatusVector, WidgetGroup, WidgetTrait } from "@swim/platform";

export class YardWidgets extends WidgetGroup {

  // Status Widget
  protected updateStatusTable(key: Value, value: Value): void {
    const rowModel = this.getOrCreateRowModel(key);
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

  getOrCreateRowModel(key: Value): Model {
    const tableModel = this.statusTable.model!;
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
    key: "statusTable",
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
  readonly statusTable!: ModelRef<this, Model>;

  @ModelRef<YardWidgets, Model>({
    key: "status",
    binds: true,
    observes: true,
    createModel(): Model {
      const widgetModel = new Model();
      const widgetTrait = new WidgetTrait();
      widgetTrait.title.setValue("STATUS");
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
    laneUri: "agents",
    didUpdate(key: Value, newValue: Value, oldValue: Value): void {
      this.owner.updateStatusTable(key, newValue);
    },
  })
  readonly agentsDownlink!: MapDownlinkFastener<this, Value>;

  @TraitRef<YardWidgets, SelectableTrait>({
    type: SelectableTrait,
    binds: true,
    observes: true,
    traitDidSelect(): void {
      this.owner.statusWidget.insertModel();
      this.owner.agentsDownlink.consume(this.owner);
    },
    traitWillUnselect(): void {
      this.owner.agentsDownlink.unconsume(this.owner);
      this.owner.statusWidget.deleteModel();
      this.owner.statusTable.deleteModel();
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
