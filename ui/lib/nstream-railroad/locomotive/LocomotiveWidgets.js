import { __decorate } from "tslib";
import { DateTime, TimeZone, ValueDownlinkFastener } from "@swim/runtime";
import { ColTrait, Look, Model, ModelRef, RowTrait, SelectableTrait, TableTrait, TextCellTrait, TraitRef } from "@swim/toolkit";
import { EntityTrait, Status, StatusTrait, StatusFactor, StatusVector, WidgetGroup, WidgetTrait } from "@swim/platform";
const STATUS_NAMES = ["Critical", "Warning", "Informational"];
const SCORE_ALERT_THRESHOLD = 0.3;
const SCORE_WARNING_THRESHOLD = 0.4;
export class LocomotiveWidgets extends WidgetGroup {
    // Status Widget
    updateStatusTable(value) {
        const tableModel = this.statusTable.model;
        const alertType = value.get("alertType").stringValue("");
        const alertTime = new DateTime(value.get("alertTimestamp").numberValue(0), TimeZone.forOffset(-480));
        const statusRowModel = tableModel.getChild("statusName");
        statusRowModel.getTrait("key", TextCellTrait).content(alertType);
        const minute = alertTime.minute < 10 ? "0" + alertTime.minute : alertTime.minute;
        const second = alertTime.second < 10 ? "0" + alertTime.second : alertTime.second;
        statusRowModel.getTrait("value", TextCellTrait).content(alertTime.hour + ":" + minute + ":" + second);
        statusRowModel.getTrait(StatusTrait).setStatusFactor("status", this.getStatusFactorFromAlert(alertType));
    }
    getStatusFactorFromAlert(alertType) {
        if (alertType == "Warning")
            return StatusFactor.create("Severity", StatusVector.of([Status.warning, 2]));
        if (alertType == "Critical")
            return StatusFactor.create("Severity", StatusVector.of([Status.alert, 2]));
        return null;
    }
    // Metrics Widget
    updateMetricsTable(value) {
        const tableModel = this.metricsTable.model;
        const cpuUsage = value.get("cpuUsage").numberValue(0);
        const cpuUsageRowModel = tableModel.getChild("cpuUsage");
        cpuUsageRowModel.getTrait("value", TextCellTrait).content(cpuUsage + "");
        cpuUsageRowModel.getTrait(StatusTrait).setStatusFactor("status", this.getStatusFactorFromPercentage(cpuUsage));
        const memoryUsage = value.get("memoryUsage").numberValue(0);
        const memoryUsageRowModel = tableModel.getChild("memoryUsage");
        memoryUsageRowModel.getTrait("value", TextCellTrait).content(memoryUsage + "");
        memoryUsageRowModel.getTrait(StatusTrait).setStatusFactor("status", this.getStatusFactorFromPercentage(memoryUsage));
        const networkBandwidthRowModel = tableModel.getChild("networkBandwidth");
        networkBandwidthRowModel.getTrait("value", TextCellTrait)
            .content(value.get("networkBandwidth").stringValue(""));
        const storageRowModel = tableModel.getChild("storage");
        storageRowModel.getTrait("value", TextCellTrait)
            .content(value.get("storage").stringValue(""));
    }
    getStatusFactorFromPercentage(usage) {
        if (usage > 90)
            return StatusFactor.create("Severity", StatusVector.of([Status.alert, 2]));
        if (usage > 75)
            return StatusFactor.create("Severity", StatusVector.of([Status.warning, 2]));
        return null;
    }
    // Health Widget
    updateHealthTable(value) {
        const tableModel = this.healthTable.model;
        const temperatureRowModel = tableModel.getChild("temperature");
        temperatureRowModel.getTrait("value", TextCellTrait)
            .content(value.get("temperature").stringValue(""));
        const batteryRowModel = tableModel.getChild("battery");
        batteryRowModel.getTrait("value", TextCellTrait)
            .content(value.get("battery").stringValue(""));
        const signalStrengthRowModel = tableModel.getChild("signalStrength");
        signalStrengthRowModel.getTrait("value", TextCellTrait)
            .content(value.get("signalStrength").stringValue(""));
        const powerSupplyStatusRowModel = tableModel.getChild("powerSupplyStatus");
        powerSupplyStatusRowModel.getTrait("value", TextCellTrait)
            .content(value.get("powerSupplyStatus").stringValue(""));
    }
    // Info Widget
    updateInfoTable(value) {
        const tableModel = this.infoTable.model;
        const systemNameRowModel = tableModel.getChild("systemName");
        systemNameRowModel.getTrait("value", TextCellTrait)
            .content(value.get("systemName").stringValue(""));
        const systemTypeRowModel = tableModel.getChild("systemType");
        systemTypeRowModel.getTrait("value", TextCellTrait)
            .content(value.get("systemType").stringValue(""));
        const rclVersionRowModel = tableModel.getChild("rclVersion");
        rclVersionRowModel.getTrait("value", TextCellTrait)
            .content(value.get("rclVersion").stringValue(""));
        const installDateRowModel = tableModel.getChild("installDate");
        installDateRowModel.getTrait("value", TextCellTrait)
            .content(value.get("installDate").stringValue(""));
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
                .layout({ key: "key", grow: 1, textColor: Look.accentColor });
            tableModel.appendTrait(ColTrait, "value")
                .layout({ key: "value", grow: 1, textColor: Look.accentColor });
            const statusRowModel = new Model();
            statusRowModel.appendTrait(RowTrait, "row");
            statusRowModel.appendTrait(TextCellTrait, "key");
            statusRowModel.appendTrait(TextCellTrait, "value");
            statusRowModel.appendTrait(StatusTrait, "status");
            tableModel.appendChild(statusRowModel, "statusName");
            return tableModel;
        },
    })
], LocomotiveWidgets.prototype, "statusTable", void 0);
__decorate([
    ModelRef({
        key: "status",
        binds: true,
        observes: true,
        createModel() {
            const widgetModel = new Model();
            const widgetTrait = new WidgetTrait();
            widgetTrait.title.setValue("ALERT STATUS");
            widgetTrait.subtitle.setValue("RCL");
            widgetModel.setTrait("widget", widgetTrait);
            this.owner.statusTable.insertModel(widgetModel);
            return widgetModel;
        },
    })
], LocomotiveWidgets.prototype, "statusWidget", void 0);
__decorate([
    ModelRef({
        key: "metricsTable",
        createModel() {
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
], LocomotiveWidgets.prototype, "metricsTable", void 0);
__decorate([
    ModelRef({
        key: "metrics",
        binds: true,
        observes: true,
        createModel() {
            const widgetModel = new Model();
            const widgetTrait = new WidgetTrait();
            widgetTrait.title.setValue("PERFORMANCE");
            widgetTrait.subtitle.setValue("RCL");
            widgetModel.setTrait("widget", widgetTrait);
            this.owner.metricsTable.insertModel(widgetModel);
            return widgetModel;
        },
    })
], LocomotiveWidgets.prototype, "metricsWidget", void 0);
__decorate([
    ModelRef({
        key: "healthTable",
        createModel() {
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
], LocomotiveWidgets.prototype, "healthTable", void 0);
__decorate([
    ModelRef({
        key: "health",
        binds: true,
        observes: true,
        createModel() {
            const widgetModel = new Model();
            const widgetTrait = new WidgetTrait();
            widgetTrait.title.setValue("HEALTH");
            widgetTrait.subtitle.setValue("RCL");
            widgetModel.setTrait("widget", widgetTrait);
            this.owner.healthTable.insertModel(widgetModel);
            return widgetModel;
        },
    })
], LocomotiveWidgets.prototype, "healthWidget", void 0);
__decorate([
    ModelRef({
        key: "infoTable",
        createModel() {
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
], LocomotiveWidgets.prototype, "infoTable", void 0);
__decorate([
    ModelRef({
        key: "info",
        binds: true,
        observes: true,
        createModel() {
            const widgetModel = new Model();
            const widgetTrait = new WidgetTrait();
            widgetTrait.title.setValue("INFO");
            widgetTrait.subtitle.setValue("RCL");
            widgetModel.setTrait("widget", widgetTrait);
            this.owner.infoTable.insertModel(widgetModel);
            return widgetModel;
        },
    })
], LocomotiveWidgets.prototype, "infoWidget", void 0);
__decorate([
    ValueDownlinkFastener({
        nodeUri() {
            return this.owner.entity.trait.uri;
        },
        laneUri: "metrics",
        didSet(newValue, oldValue) {
            this.owner.updateStatusTable(newValue);
            this.owner.updateMetricsTable(newValue);
            this.owner.updateHealthTable(newValue);
        },
    })
], LocomotiveWidgets.prototype, "statusDownlink", void 0);
__decorate([
    ValueDownlinkFastener({
        nodeUri() {
            return this.owner.entity.trait.uri;
        },
        laneUri: "info",
        didSet(newValue, oldValue) {
            this.owner.updateInfoTable(newValue);
        },
    })
], LocomotiveWidgets.prototype, "infoDownlink", void 0);
__decorate([
    TraitRef({
        type: SelectableTrait,
        binds: true,
        observes: true,
        traitDidSelect() {
            this.owner.statusWidget.insertModel();
            this.owner.metricsWidget.insertModel();
            this.owner.healthWidget.insertModel();
            this.owner.infoWidget.insertModel();
            this.owner.statusDownlink.consume(this.owner);
            this.owner.infoDownlink.consume(this.owner);
        },
        traitWillUnselect() {
            this.owner.statusDownlink.unconsume(this.owner);
            this.owner.infoDownlink.unconsume(this.owner);
            this.owner.statusWidget.deleteModel();
            this.owner.statusTable.deleteModel();
            this.owner.metricsWidget.deleteModel();
            this.owner.metricsTable.deleteModel();
            this.owner.healthWidget.deleteModel();
            this.owner.healthTable.deleteModel();
            this.owner.infoWidget.deleteModel();
            this.owner.infoTable.deleteModel();
        },
        detectTrait(trait) {
            return trait instanceof SelectableTrait ? trait : null;
        },
    })
], LocomotiveWidgets.prototype, "selectable", void 0);
__decorate([
    TraitRef({
        type: EntityTrait,
        binds: true,
        detectTrait(trait) {
            return trait instanceof EntityTrait ? trait : null;
        },
    })
], LocomotiveWidgets.prototype, "entity", void 0);
//# sourceMappingURL=LocomotiveWidgets.js.map