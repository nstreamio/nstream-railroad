import { __decorate } from "tslib";
import { DateTime, MapDownlinkFastener, TimeZone } from "@swim/runtime";
import { ColTrait, Look, Model, ModelRef, RowTrait, SelectableTrait, TableTrait, TextCellTrait, TraitRef } from "@swim/toolkit";
import { EntityTrait, Status, StatusTrait, StatusFactor, StatusVector, WidgetGroup, WidgetTrait } from "@swim/platform";
export class YardWidgets extends WidgetGroup {
    // Status Widget
    updateStatusTable(key, value) {
        const rowModel = this.getOrCreateRowModel(key);
        const keyCell = rowModel.getTrait("key", TextCellTrait);
        keyCell.content(key.stringValue(""));
        const timeCell = rowModel.getTrait("time", TextCellTrait);
        const reportTime = new DateTime(value.get("reportTime").numberValue(void 0), TimeZone.forOffset(-480));
        timeCell.content(this.getTimeStr(reportTime));
        const statusCell = rowModel.getTrait("status", TextCellTrait);
        const offline = value.get("isOffline").booleanValue(false);
        const idle = value.get("isIdle").booleanValue(false);
        const alertStatus = value.get("alertStatus").stringValue("");
        let status;
        if (offline) {
            status = "Offline";
            rowModel.getTrait(StatusTrait).setStatusFactor("status", this.getAlertStatusFromFlag(true));
        }
        else if (idle) {
            status = "Idle";
            rowModel.getTrait(StatusTrait).setStatusFactor("status", this.getWarningStatusFromFlag(true));
        }
        else {
            status = alertStatus;
            rowModel.getTrait(StatusTrait).setStatusFactor("status", this.getStatusFactorFromAlert(alertStatus));
        }
        statusCell.content(status);
    }
    getOrCreateRowModel(key) {
        const tableModel = this.statusTable.model;
        let rowModel = tableModel.getChild(key.stringValue(""));
        if (rowModel == null) {
            rowModel = this.createRowModel(key);
        }
        tableModel.appendChild(rowModel, key.stringValue(""));
        return rowModel;
    }
    createRowModel(key) {
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
    getTimeStr(time) {
        const hour = time.hour < 10 ? "0" + time.hour : time.hour;
        const minute = time.minute < 10 ? "0" + time.minute : time.minute;
        const second = time.second < 10 ? "0" + time.second : time.second;
        return hour + ":" + minute + ":" + second;
    }
    getStatusFactorFromAlert(alertType) {
        if (alertType == "Warning")
            return StatusFactor.create("Severity", StatusVector.of([Status.warning, 2]));
        if (alertType == "Critical")
            return StatusFactor.create("Severity", StatusVector.of([Status.alert, 2]));
        return null;
    }
    getWarningStatusFromFlag(flag) {
        if (flag)
            return StatusFactor.create("Severity", StatusVector.of([Status.warning, 2]));
        return null;
    }
    getAlertStatusFromFlag(flag) {
        if (flag)
            return StatusFactor.create("Severity", StatusVector.of([Status.alert, 2]));
        return null;
    }
}
__decorate([
    ModelRef({
        key: "statusTable",
        createModel() {
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
], YardWidgets.prototype, "statusTable", void 0);
__decorate([
    ModelRef({
        key: "status",
        binds: true,
        observes: true,
        createModel() {
            const widgetModel = new Model();
            const widgetTrait = new WidgetTrait();
            widgetTrait.title.setValue("STATUS");
            widgetTrait.subtitle.setValue("YARD");
            widgetModel.setTrait("widget", widgetTrait);
            this.owner.statusTable.insertModel(widgetModel);
            return widgetModel;
        },
    })
], YardWidgets.prototype, "statusWidget", void 0);
__decorate([
    MapDownlinkFastener({
        nodeUri() {
            return this.owner.entity.trait.uri;
        },
        laneUri: "agents",
        didUpdate(key, newValue, oldValue) {
            this.owner.updateStatusTable(key, newValue);
        },
    })
], YardWidgets.prototype, "agentsDownlink", void 0);
__decorate([
    TraitRef({
        type: SelectableTrait,
        binds: true,
        observes: true,
        traitDidSelect() {
            this.owner.statusWidget.insertModel();
            this.owner.agentsDownlink.consume(this.owner);
        },
        traitWillUnselect() {
            this.owner.agentsDownlink.unconsume(this.owner);
            this.owner.statusWidget.deleteModel();
            this.owner.statusTable.deleteModel();
        },
        detectTrait(trait) {
            return trait instanceof SelectableTrait ? trait : null;
        },
    })
], YardWidgets.prototype, "selectable", void 0);
__decorate([
    TraitRef({
        type: EntityTrait,
        binds: true,
        detectTrait(trait) {
            return trait instanceof EntityTrait ? trait : null;
        },
    })
], YardWidgets.prototype, "entity", void 0);
//# sourceMappingURL=YardWidgets.js.map