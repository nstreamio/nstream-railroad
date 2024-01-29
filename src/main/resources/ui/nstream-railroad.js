this.nstream = this.nstream || {};
this.nstream.railroad = (function (exports, runtime, toolkit, platform) {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    class RclWidgets extends platform.WidgetGroup {
        // Status Widget
        updateStatusTable(value) {
            const tableModel = this.statusTable.model;
            const offline = value.get("isOffline").booleanValue(false);
            const offlineRowModel = tableModel.getChild("offline");
            offlineRowModel.getTrait("value", toolkit.TextCellTrait).content(offline + "");
            offlineRowModel.getTrait(platform.StatusTrait).setStatusFactor("status", this.getAlertStatusFromFlag(offline));
            const reportTime = new runtime.DateTime(value.get("reportTime").numberValue(void 0), runtime.TimeZone.forOffset(-480));
            const reportTimeRowModel = tableModel.getChild("reportTime");
            reportTimeRowModel.getTrait("value", toolkit.TextCellTrait).content(this.getTimeStr(reportTime));
            reportTimeRowModel.getTrait(platform.StatusTrait).setStatusFactor("status", this.getAlertStatusFromFlag(offline));
            const idle = value.get("isIdle").booleanValue(false);
            const idleRowModel = tableModel.getChild("idle");
            idleRowModel.getTrait("value", toolkit.TextCellTrait).content(idle + "");
            idleRowModel.getTrait(platform.StatusTrait).setStatusFactor("status", this.getWarningStatusFromFlag(idle));
            const locationChangeTime = new runtime.DateTime(value.get("locationChangeTime").numberValue(void 0), runtime.TimeZone.forOffset(-480));
            const locationChangeTimeRowModel = tableModel.getChild("locationChangeTime");
            locationChangeTimeRowModel.getTrait("value", toolkit.TextCellTrait).content(this.getTimeStr(locationChangeTime));
            locationChangeTimeRowModel.getTrait(platform.StatusTrait).setStatusFactor("status", this.getWarningStatusFromFlag(idle));
            const alertStatus = value.get("alertStatus").stringValue("");
            const alertStatusRowModel = tableModel.getChild("alertStatus");
            alertStatusRowModel.getTrait("value", toolkit.TextCellTrait).content(alertStatus + "");
            alertStatusRowModel.getTrait(platform.StatusTrait).setStatusFactor("status", this.getStatusFactorFromAlert(alertStatus));
            const alertTime = new runtime.DateTime(value.get("alertTime").numberValue(void 0), runtime.TimeZone.forOffset(-480));
            const alertTimeRowModel = tableModel.getChild("alertTime");
            alertTimeRowModel.getTrait("value", toolkit.TextCellTrait).content(this.getTimeStr(alertTime));
            alertTimeRowModel.getTrait(platform.StatusTrait).setStatusFactor("status", this.getStatusFactorFromAlert(alertStatus));
        }
        getTimeStr(time) {
            const hour = time.hour < 10 ? "0" + time.hour : time.hour;
            const minute = time.minute < 10 ? "0" + time.minute : time.minute;
            const second = time.second < 10 ? "0" + time.second : time.second;
            return hour + ":" + minute + ":" + second;
        }
        getStatusFactorFromAlert(alertType) {
            if (alertType == "Warning")
                return platform.StatusFactor.create("Severity", platform.StatusVector.of([platform.Status.warning, 2]));
            if (alertType == "Critical")
                return platform.StatusFactor.create("Severity", platform.StatusVector.of([platform.Status.alert, 2]));
            return null;
        }
        // Operation Widget
        // Operation Gauge
        updateOperationGauge(value) {
            const gaugeModel = this.operationGauge.model;
            const brakeLevel = value.get("brakeLevel").numberValue();
            const brakeDialModel = gaugeModel.getChild("brake");
            brakeDialModel.getTrait(toolkit.DialTrait)
                .legend("Brake (" + brakeLevel + "%)")
                .value(brakeLevel);
            //brakeDialModel.getTrait(StatusTrait)!.setStatusFactor("brake", this.getStatusFactorFromScore(brakeLevel));
            const fuelLevel = value.get("fuelLevel").numberValue();
            const fuelDialModel = gaugeModel.getChild("fuel");
            fuelDialModel.getTrait(toolkit.DialTrait)
                .legend("Fuel (" + fuelLevel + "%)")
                .value(fuelLevel);
            fuelDialModel.getTrait(platform.StatusTrait).setStatusFactor("fuel", this.getStatusFactorFromLowPercentage(fuelLevel));
        }
        updateOperationTable(value) {
            const tableModel = this.operationTable.model;
            const doorOpen = value.get("isDoorOpen").booleanValue(false);
            const doorOpenRowModel = tableModel.getChild("doorOpen");
            doorOpenRowModel.getTrait("value", toolkit.TextCellTrait).content(doorOpen + "");
            doorOpenRowModel.getTrait(platform.StatusTrait).setStatusFactor("status", this.getWarningStatusFromFlag(doorOpen));
            const emergencyBrake = value.get("isEmergencyBrake").booleanValue(false);
            const emergencyBrakeRowModel = tableModel.getChild("emergencyBrake");
            emergencyBrakeRowModel.getTrait("value", toolkit.TextCellTrait).content(emergencyBrake + "");
            emergencyBrakeRowModel.getTrait(platform.StatusTrait).setStatusFactor("status", this.getWarningStatusFromFlag(emergencyBrake));
            const brakeLevel = value.get("brakeLevel").numberValue();
            const brakeLevelRowModel = tableModel.getChild("brakeLevel");
            brakeLevelRowModel.getTrait("value", toolkit.TextCellTrait).content(brakeLevel + "%");
            const fuelLevel = value.get("fuelLevel").numberValue();
            const fuelLevelRowModel = tableModel.getChild("fuelLevel");
            fuelLevelRowModel.getTrait("value", toolkit.TextCellTrait).content(fuelLevel + "%");
            fuelLevelRowModel.getTrait(platform.StatusTrait).setStatusFactor("status", this.getStatusFactorFromLowPercentage(fuelLevel));
            const engineFault = value.get("isEngineFault").booleanValue(false);
            const engineFaultRowModel = tableModel.getChild("engineFault");
            engineFaultRowModel.getTrait("value", toolkit.TextCellTrait).content(engineFault + "");
            engineFaultRowModel.getTrait(platform.StatusTrait).setStatusFactor("status", this.getWarningStatusFromFlag(engineFault));
            const engineTemperature = value.get("engineTemperature").numberValue();
            const engineTemperatureRowModel = tableModel.getChild("engineTemperature");
            engineTemperatureRowModel.getTrait("value", toolkit.TextCellTrait).content(engineTemperature + "F");
            const throttle = value.get("throttle").numberValue();
            const throttleRowModel = tableModel.getChild("throttle");
            throttleRowModel.getTrait("value", toolkit.TextCellTrait).content(throttle + "%");
        }
        getWarningStatusFromFlag(flag) {
            if (flag)
                return platform.StatusFactor.create("Severity", platform.StatusVector.of([platform.Status.warning, 2]));
            return null;
        }
        getAlertStatusFromFlag(flag) {
            if (flag)
                return platform.StatusFactor.create("Severity", platform.StatusVector.of([platform.Status.alert, 2]));
            return null;
        }
        // Performance Widget
        // Performance Gauge
        updatePerformanceGauge(value) {
            const gaugeModel = this.performanceGauge.model;
            const cpu = value.get("cpuUsage").numberValue();
            const cpuDialModel = gaugeModel.getChild("cpu");
            cpuDialModel.getTrait(toolkit.DialTrait)
                .legend("CPU (" + cpu + "%)")
                .value(cpu);
            cpuDialModel.getTrait(platform.StatusTrait).setStatusFactor("cpu", this.getStatusFactorFromHighPercentage(cpu));
            const memory = value.get("memoryUsage").numberValue();
            const memoryDialModel = gaugeModel.getChild("memory");
            memoryDialModel.getTrait(toolkit.DialTrait)
                .legend("Memory (" + memory + "%)")
                .value(memory);
            memoryDialModel.getTrait(platform.StatusTrait).setStatusFactor("memory", this.getStatusFactorFromLowPercentage(memory));
        }
        updatePerformanceTable(value) {
            const tableModel = this.performanceTable.model;
            const cpuUsage = value.get("cpuUsage").numberValue(0);
            const cpuUsageRowModel = tableModel.getChild("cpuUsage");
            cpuUsageRowModel.getTrait("value", toolkit.TextCellTrait).content(cpuUsage + "");
            cpuUsageRowModel.getTrait(platform.StatusTrait).setStatusFactor("status", this.getStatusFactorFromHighPercentage(cpuUsage));
            const memoryUsage = value.get("memoryUsage").numberValue(0);
            const memoryUsageRowModel = tableModel.getChild("memoryUsage");
            memoryUsageRowModel.getTrait("value", toolkit.TextCellTrait).content(memoryUsage + "");
            memoryUsageRowModel.getTrait(platform.StatusTrait).setStatusFactor("status", this.getStatusFactorFromHighPercentage(memoryUsage));
            const networkBandwidthRowModel = tableModel.getChild("networkBandwidth");
            networkBandwidthRowModel.getTrait("value", toolkit.TextCellTrait)
                .content(value.get("networkBandwidth").stringValue(""));
            const storageRowModel = tableModel.getChild("storage");
            storageRowModel.getTrait("value", toolkit.TextCellTrait)
                .content(value.get("storage").stringValue(""));
        }
        getStatusFactorFromHighPercentage(usage) {
            if (usage > 95)
                return platform.StatusFactor.create("Severity", platform.StatusVector.of([platform.Status.alert, 2]));
            if (usage > 85)
                return platform.StatusFactor.create("Severity", platform.StatusVector.of([platform.Status.warning, 2]));
            return null;
        }
        getStatusFactorFromLowPercentage(usage) {
            if (usage < 5)
                return platform.StatusFactor.create("Severity", platform.StatusVector.of([platform.Status.alert, 2]));
            if (usage < 15)
                return platform.StatusFactor.create("Severity", platform.StatusVector.of([platform.Status.warning, 2]));
            return null;
        }
        // Health Widget
        updateHealthTable(value) {
            const tableModel = this.healthTable.model;
            const temperatureRowModel = tableModel.getChild("temperature");
            temperatureRowModel.getTrait("value", toolkit.TextCellTrait)
                .content(value.get("temperature").stringValue(""));
            const batteryRowModel = tableModel.getChild("battery");
            batteryRowModel.getTrait("value", toolkit.TextCellTrait)
                .content(value.get("battery").stringValue(""));
            const signalStrengthRowModel = tableModel.getChild("signalStrength");
            signalStrengthRowModel.getTrait("value", toolkit.TextCellTrait)
                .content(value.get("signalStrength").stringValue(""));
            const powerSupplyStatusRowModel = tableModel.getChild("powerSupplyStatus");
            powerSupplyStatusRowModel.getTrait("value", toolkit.TextCellTrait)
                .content(value.get("powerSupplyStatus").stringValue(""));
        }
        // Info Widget
        updateInfoTable(value) {
            const tableModel = this.infoTable.model;
            const systemNameRowModel = tableModel.getChild("systemName");
            systemNameRowModel.getTrait("value", toolkit.TextCellTrait)
                .content(value.get("systemName").stringValue(""));
            const systemTypeRowModel = tableModel.getChild("systemType");
            systemTypeRowModel.getTrait("value", toolkit.TextCellTrait)
                .content(value.get("systemType").stringValue(""));
            const rclVersionRowModel = tableModel.getChild("rclVersion");
            rclVersionRowModel.getTrait("value", toolkit.TextCellTrait)
                .content(value.get("rclVersion").stringValue(""));
            const installDateRowModel = tableModel.getChild("installDate");
            installDateRowModel.getTrait("value", toolkit.TextCellTrait)
                .content(value.get("installDate").stringValue(""));
        }
    }
    __decorate([
        toolkit.ModelRef({
            key: "statusTable",
            createModel() {
                const tableModel = new toolkit.Model();
                tableModel.appendTrait(toolkit.TableTrait, "table")
                    .colSpacing(12);
                tableModel.appendTrait(toolkit.ColTrait, "key")
                    .layout({ key: "key", grow: 3, textColor: toolkit.Look.mutedColor });
                tableModel.appendTrait(toolkit.ColTrait, "value")
                    .layout({ key: "value", grow: 2, textColor: toolkit.Look.accentColor });
                const offlineRowModel = new toolkit.Model();
                offlineRowModel.appendTrait(toolkit.RowTrait, "row");
                offlineRowModel.appendTrait(toolkit.TextCellTrait, "key")
                    .content("Offline");
                offlineRowModel.appendTrait(toolkit.TextCellTrait, "value");
                offlineRowModel.appendTrait(platform.StatusTrait, "status");
                tableModel.appendChild(offlineRowModel, "offline");
                const reportTimeRowModel = new toolkit.Model();
                reportTimeRowModel.appendTrait(toolkit.RowTrait, "row");
                reportTimeRowModel.appendTrait(toolkit.TextCellTrait, "key")
                    .content("Last Updated Time");
                reportTimeRowModel.appendTrait(toolkit.TextCellTrait, "value");
                reportTimeRowModel.appendTrait(platform.StatusTrait, "status");
                tableModel.appendChild(reportTimeRowModel, "reportTime");
                const idleRowModel = new toolkit.Model();
                idleRowModel.appendTrait(toolkit.RowTrait, "row");
                idleRowModel.appendTrait(toolkit.TextCellTrait, "key")
                    .content("Idle");
                idleRowModel.appendTrait(toolkit.TextCellTrait, "value");
                idleRowModel.appendTrait(platform.StatusTrait, "status");
                tableModel.appendChild(idleRowModel, "idle");
                const locationChangeTimeRowModel = new toolkit.Model();
                locationChangeTimeRowModel.appendTrait(toolkit.RowTrait, "row");
                locationChangeTimeRowModel.appendTrait(toolkit.TextCellTrait, "key")
                    .content("Last Location Change Time");
                locationChangeTimeRowModel.appendTrait(toolkit.TextCellTrait, "value");
                locationChangeTimeRowModel.appendTrait(platform.StatusTrait, "status");
                tableModel.appendChild(locationChangeTimeRowModel, "locationChangeTime");
                const alertStatusRowModel = new toolkit.Model();
                alertStatusRowModel.appendTrait(toolkit.RowTrait, "row");
                alertStatusRowModel.appendTrait(toolkit.TextCellTrait, "key")
                    .content("Alert Type");
                alertStatusRowModel.appendTrait(toolkit.TextCellTrait, "value");
                alertStatusRowModel.appendTrait(platform.StatusTrait, "status");
                tableModel.appendChild(alertStatusRowModel, "alertStatus");
                const alertTimeRowModel = new toolkit.Model();
                alertTimeRowModel.appendTrait(toolkit.RowTrait, "row");
                alertTimeRowModel.appendTrait(toolkit.TextCellTrait, "key")
                    .content("Alert Time");
                alertTimeRowModel.appendTrait(toolkit.TextCellTrait, "value");
                alertTimeRowModel.appendTrait(platform.StatusTrait, "status");
                tableModel.appendChild(alertTimeRowModel, "alertTime");
                return tableModel;
            },
        })
    ], RclWidgets.prototype, "statusTable", void 0);
    __decorate([
        toolkit.ModelRef({
            key: "status",
            binds: true,
            observes: true,
            createModel() {
                const widgetModel = new toolkit.Model();
                const widgetTrait = new platform.WidgetTrait();
                widgetTrait.title.setValue("STATUS");
                widgetTrait.subtitle.setValue("RCL");
                widgetModel.setTrait("widget", widgetTrait);
                this.owner.statusTable.insertModel(widgetModel);
                return widgetModel;
            },
        })
    ], RclWidgets.prototype, "statusWidget", void 0);
    __decorate([
        toolkit.ModelRef({
            key: "operationGauge",
            createModel() {
                const gaugeModel = new toolkit.Model();
                gaugeModel.appendTrait(toolkit.GaugeTrait, "gauge")
                    .limit(100);
                const brakeDialModel = new toolkit.Model();
                brakeDialModel.appendTrait(toolkit.DialTrait, "brake");
                brakeDialModel.appendTrait(platform.StatusTrait, "status");
                gaugeModel.setChild("brake", brakeDialModel);
                const fuelDialModel = new toolkit.Model();
                fuelDialModel.appendTrait(toolkit.DialTrait, "fuel");
                fuelDialModel.appendTrait(platform.StatusTrait, "status");
                gaugeModel.setChild("fuel", fuelDialModel);
                return gaugeModel;
            },
        })
    ], RclWidgets.prototype, "operationGauge", void 0);
    __decorate([
        toolkit.ModelRef({
            key: "operationTable",
            createModel() {
                const tableModel = new toolkit.Model();
                tableModel.appendTrait(toolkit.TableTrait, "table")
                    .colSpacing(12);
                tableModel.appendTrait(toolkit.ColTrait, "key")
                    .layout({ key: "key", grow: 3, textColor: toolkit.Look.mutedColor });
                tableModel.appendTrait(toolkit.ColTrait, "value")
                    .layout({ key: "value", grow: 2, textColor: toolkit.Look.accentColor });
                const doorOpenRowModel = new toolkit.Model();
                doorOpenRowModel.appendTrait(toolkit.RowTrait, "row");
                doorOpenRowModel.appendTrait(toolkit.TextCellTrait, "key")
                    .content("Door Open");
                doorOpenRowModel.appendTrait(toolkit.TextCellTrait, "value");
                doorOpenRowModel.appendTrait(platform.StatusTrait, "status");
                tableModel.appendChild(doorOpenRowModel, "doorOpen");
                const brakeLevelRowModel = new toolkit.Model();
                brakeLevelRowModel.appendTrait(toolkit.RowTrait, "row");
                brakeLevelRowModel.appendTrait(toolkit.TextCellTrait, "key")
                    .content("Brake Level");
                brakeLevelRowModel.appendTrait(toolkit.TextCellTrait, "value");
                brakeLevelRowModel.appendTrait(platform.StatusTrait, "status");
                tableModel.appendChild(brakeLevelRowModel, "brakeLevel");
                const emergencyBrakeRowModel = new toolkit.Model();
                emergencyBrakeRowModel.appendTrait(toolkit.RowTrait, "row");
                emergencyBrakeRowModel.appendTrait(toolkit.TextCellTrait, "key")
                    .content("Emergency Brake");
                emergencyBrakeRowModel.appendTrait(toolkit.TextCellTrait, "value");
                emergencyBrakeRowModel.appendTrait(platform.StatusTrait, "status");
                tableModel.appendChild(emergencyBrakeRowModel, "emergencyBrake");
                const fuelLevelRowModel = new toolkit.Model();
                fuelLevelRowModel.appendTrait(toolkit.RowTrait, "row");
                fuelLevelRowModel.appendTrait(toolkit.TextCellTrait, "key")
                    .content("Fuel Level");
                fuelLevelRowModel.appendTrait(toolkit.TextCellTrait, "value");
                fuelLevelRowModel.appendTrait(platform.StatusTrait, "status");
                tableModel.appendChild(fuelLevelRowModel, "fuelLevel");
                const engineFaultRowModel = new toolkit.Model();
                engineFaultRowModel.appendTrait(toolkit.RowTrait, "row");
                engineFaultRowModel.appendTrait(toolkit.TextCellTrait, "key")
                    .content("Engine Fault");
                engineFaultRowModel.appendTrait(toolkit.TextCellTrait, "value");
                engineFaultRowModel.appendTrait(platform.StatusTrait, "status");
                tableModel.appendChild(engineFaultRowModel, "engineFault");
                const engineTemperatureRowModel = new toolkit.Model();
                engineTemperatureRowModel.appendTrait(toolkit.RowTrait, "row");
                engineTemperatureRowModel.appendTrait(toolkit.TextCellTrait, "key")
                    .content("Engine Temperature");
                engineTemperatureRowModel.appendTrait(toolkit.TextCellTrait, "value");
                engineTemperatureRowModel.appendTrait(platform.StatusTrait, "status");
                tableModel.appendChild(engineTemperatureRowModel, "engineTemperature");
                const throttleRowModel = new toolkit.Model();
                throttleRowModel.appendTrait(toolkit.RowTrait, "row");
                throttleRowModel.appendTrait(toolkit.TextCellTrait, "key")
                    .content("Throttle");
                throttleRowModel.appendTrait(toolkit.TextCellTrait, "value");
                throttleRowModel.appendTrait(platform.StatusTrait, "status");
                tableModel.appendChild(throttleRowModel, "throttle");
                return tableModel;
            },
        })
    ], RclWidgets.prototype, "operationTable", void 0);
    __decorate([
        toolkit.ModelRef({
            key: "operation",
            binds: true,
            observes: true,
            createModel() {
                const widgetModel = new toolkit.Model();
                const widgetTrait = new platform.WidgetTrait();
                widgetTrait.title.setValue("OPERATION");
                widgetTrait.subtitle.setValue("LOCOMOTIVE");
                widgetModel.setTrait("widget", widgetTrait);
                this.owner.operationGauge.insertModel(widgetModel);
                this.owner.operationTable.insertModel(widgetModel);
                return widgetModel;
            },
        })
    ], RclWidgets.prototype, "operationWidget", void 0);
    __decorate([
        toolkit.ModelRef({
            key: "performanceGauge",
            createModel() {
                const gaugeModel = new toolkit.Model();
                gaugeModel.appendTrait(toolkit.GaugeTrait, "gauge")
                    .limit(100);
                const cpuDialModel = new toolkit.Model();
                cpuDialModel.appendTrait(toolkit.DialTrait, "cpu");
                cpuDialModel.appendTrait(platform.StatusTrait, "status");
                gaugeModel.setChild("cpu", cpuDialModel);
                const memoryDialModel = new toolkit.Model();
                memoryDialModel.appendTrait(toolkit.DialTrait, "memory");
                memoryDialModel.appendTrait(platform.StatusTrait, "status");
                gaugeModel.setChild("memory", memoryDialModel);
                return gaugeModel;
            },
        })
    ], RclWidgets.prototype, "performanceGauge", void 0);
    __decorate([
        toolkit.ModelRef({
            key: "performanceTable",
            createModel() {
                const tableModel = new toolkit.Model();
                tableModel.appendTrait(toolkit.TableTrait, "table")
                    .colSpacing(12);
                tableModel.appendTrait(toolkit.ColTrait, "key")
                    .layout({ key: "key", grow: 3, textColor: toolkit.Look.mutedColor });
                tableModel.appendTrait(toolkit.ColTrait, "value")
                    .layout({ key: "value", grow: 2, textColor: toolkit.Look.accentColor });
                const cpuUsageRowModel = new toolkit.Model();
                cpuUsageRowModel.appendTrait(toolkit.RowTrait, "row");
                cpuUsageRowModel.appendTrait(toolkit.TextCellTrait, "key")
                    .content("CPU Usage");
                cpuUsageRowModel.appendTrait(toolkit.TextCellTrait, "value");
                cpuUsageRowModel.appendTrait(platform.StatusTrait, "status");
                tableModel.appendChild(cpuUsageRowModel, "cpuUsage");
                const memoryUsageRowModel = new toolkit.Model();
                memoryUsageRowModel.appendTrait(toolkit.RowTrait, "row");
                memoryUsageRowModel.appendTrait(toolkit.TextCellTrait, "key")
                    .content("Memory Usage");
                memoryUsageRowModel.appendTrait(toolkit.TextCellTrait, "value");
                memoryUsageRowModel.appendTrait(platform.StatusTrait, "status");
                tableModel.appendChild(memoryUsageRowModel, "memoryUsage");
                const networkBandwidthRowModel = new toolkit.Model();
                networkBandwidthRowModel.appendTrait(toolkit.RowTrait, "row");
                networkBandwidthRowModel.appendTrait(toolkit.TextCellTrait, "key")
                    .content("Network Bandwidth");
                networkBandwidthRowModel.appendTrait(toolkit.TextCellTrait, "value");
                tableModel.appendChild(networkBandwidthRowModel, "networkBandwidth");
                const storageRowModel = new toolkit.Model();
                storageRowModel.appendTrait(toolkit.RowTrait, "row");
                storageRowModel.appendTrait(toolkit.TextCellTrait, "key")
                    .content("Storage");
                storageRowModel.appendTrait(toolkit.TextCellTrait, "value");
                tableModel.appendChild(storageRowModel, "storage");
                return tableModel;
            },
        })
    ], RclWidgets.prototype, "performanceTable", void 0);
    __decorate([
        toolkit.ModelRef({
            key: "performance",
            binds: true,
            observes: true,
            createModel() {
                const widgetModel = new toolkit.Model();
                const widgetTrait = new platform.WidgetTrait();
                widgetTrait.title.setValue("PERFORMANCE");
                widgetTrait.subtitle.setValue("RCU");
                widgetModel.setTrait("widget", widgetTrait);
                this.owner.performanceGauge.insertModel(widgetModel);
                this.owner.performanceTable.insertModel(widgetModel);
                return widgetModel;
            },
        })
    ], RclWidgets.prototype, "performanceWidget", void 0);
    __decorate([
        toolkit.ModelRef({
            key: "healthTable",
            createModel() {
                const tableModel = new toolkit.Model();
                tableModel.appendTrait(toolkit.TableTrait, "table")
                    .colSpacing(12);
                tableModel.appendTrait(toolkit.ColTrait, "key")
                    .layout({ key: "key", grow: 3, textColor: toolkit.Look.mutedColor });
                tableModel.appendTrait(toolkit.ColTrait, "value")
                    .layout({ key: "value", grow: 2, textColor: toolkit.Look.accentColor });
                const temperatureRowModel = new toolkit.Model();
                temperatureRowModel.appendTrait(toolkit.RowTrait, "row");
                temperatureRowModel.appendTrait(toolkit.TextCellTrait, "key")
                    .content("Temperature");
                temperatureRowModel.appendTrait(toolkit.TextCellTrait, "value");
                tableModel.appendChild(temperatureRowModel, "temperature");
                const batteryRowModel = new toolkit.Model();
                batteryRowModel.appendTrait(toolkit.RowTrait, "row");
                batteryRowModel.appendTrait(toolkit.TextCellTrait, "key")
                    .content("Battery");
                batteryRowModel.appendTrait(toolkit.TextCellTrait, "value");
                tableModel.appendChild(batteryRowModel, "battery");
                const signalStrengthRowModel = new toolkit.Model();
                signalStrengthRowModel.appendTrait(toolkit.RowTrait, "row");
                signalStrengthRowModel.appendTrait(toolkit.TextCellTrait, "key")
                    .content("Signal Strength");
                signalStrengthRowModel.appendTrait(toolkit.TextCellTrait, "value");
                tableModel.appendChild(signalStrengthRowModel, "signalStrength");
                const powerSupplyStatusRowModel = new toolkit.Model();
                powerSupplyStatusRowModel.appendTrait(toolkit.RowTrait, "row");
                powerSupplyStatusRowModel.appendTrait(toolkit.TextCellTrait, "key")
                    .content("Power Supply Status");
                powerSupplyStatusRowModel.appendTrait(toolkit.TextCellTrait, "value");
                tableModel.appendChild(powerSupplyStatusRowModel, "powerSupplyStatus");
                return tableModel;
            },
        })
    ], RclWidgets.prototype, "healthTable", void 0);
    __decorate([
        toolkit.ModelRef({
            key: "health",
            binds: true,
            observes: true,
            createModel() {
                const widgetModel = new toolkit.Model();
                const widgetTrait = new platform.WidgetTrait();
                widgetTrait.title.setValue("HEALTH");
                widgetTrait.subtitle.setValue("RCU");
                widgetModel.setTrait("widget", widgetTrait);
                this.owner.healthTable.insertModel(widgetModel);
                return widgetModel;
            },
        })
    ], RclWidgets.prototype, "healthWidget", void 0);
    __decorate([
        toolkit.ModelRef({
            key: "infoTable",
            createModel() {
                const tableModel = new toolkit.Model();
                tableModel.appendTrait(toolkit.TableTrait, "table")
                    .colSpacing(12);
                tableModel.appendTrait(toolkit.ColTrait, "key")
                    .layout({ key: "key", grow: 3, textColor: toolkit.Look.mutedColor });
                tableModel.appendTrait(toolkit.ColTrait, "value")
                    .layout({ key: "value", grow: 2, textColor: toolkit.Look.accentColor });
                const systemNameRowModel = new toolkit.Model();
                systemNameRowModel.appendTrait(toolkit.RowTrait, "row");
                systemNameRowModel.appendTrait(toolkit.TextCellTrait, "key")
                    .content("System Name");
                systemNameRowModel.appendTrait(toolkit.TextCellTrait, "value");
                tableModel.appendChild(systemNameRowModel, "systemName");
                const systemTypeRowModel = new toolkit.Model();
                systemTypeRowModel.appendTrait(toolkit.RowTrait, "row");
                systemTypeRowModel.appendTrait(toolkit.TextCellTrait, "key")
                    .content("System Type");
                systemTypeRowModel.appendTrait(toolkit.TextCellTrait, "value");
                tableModel.appendChild(systemTypeRowModel, "systemType");
                const rclVersionRowModel = new toolkit.Model();
                rclVersionRowModel.appendTrait(toolkit.RowTrait, "row");
                rclVersionRowModel.appendTrait(toolkit.TextCellTrait, "key")
                    .content("RCL Version");
                rclVersionRowModel.appendTrait(toolkit.TextCellTrait, "value");
                tableModel.appendChild(rclVersionRowModel, "rclVersion");
                const installDateRowModel = new toolkit.Model();
                installDateRowModel.appendTrait(toolkit.RowTrait, "row");
                installDateRowModel.appendTrait(toolkit.TextCellTrait, "key")
                    .content("Install Date");
                installDateRowModel.appendTrait(toolkit.TextCellTrait, "value");
                tableModel.appendChild(installDateRowModel, "installDate");
                return tableModel;
            },
        })
    ], RclWidgets.prototype, "infoTable", void 0);
    __decorate([
        toolkit.ModelRef({
            key: "info",
            binds: true,
            observes: true,
            createModel() {
                const widgetModel = new toolkit.Model();
                const widgetTrait = new platform.WidgetTrait();
                widgetTrait.title.setValue("INFO");
                widgetTrait.subtitle.setValue("RCL");
                widgetModel.setTrait("widget", widgetTrait);
                this.owner.infoTable.insertModel(widgetModel);
                return widgetModel;
            },
        })
    ], RclWidgets.prototype, "infoWidget", void 0);
    __decorate([
        runtime.ValueDownlinkFastener({
            nodeUri() {
                return this.owner.entity.trait.uri;
            },
            laneUri: "status",
            didSet(newValue, oldValue) {
                this.owner.updateStatusTable(newValue);
            },
        })
    ], RclWidgets.prototype, "statusDownlink", void 0);
    __decorate([
        runtime.ValueDownlinkFastener({
            nodeUri() {
                return this.owner.entity.trait.uri;
            },
            laneUri: "rcuMetrics",
            didSet(newValue, oldValue) {
                this.owner.updatePerformanceTable(newValue);
                this.owner.updatePerformanceGauge(newValue);
                this.owner.updateHealthTable(newValue);
            },
        })
    ], RclWidgets.prototype, "rcuMetricsDownlink", void 0);
    __decorate([
        runtime.ValueDownlinkFastener({
            nodeUri() {
                return this.owner.entity.trait.uri;
            },
            laneUri: "locomotiveMetrics",
            didSet(newValue, oldValue) {
                this.owner.updateOperationTable(newValue);
                this.owner.updateOperationGauge(newValue);
            },
        })
    ], RclWidgets.prototype, "locomotiveMetricsDownlink", void 0);
    __decorate([
        runtime.ValueDownlinkFastener({
            nodeUri() {
                return this.owner.entity.trait.uri;
            },
            laneUri: "info",
            didSet(newValue, oldValue) {
                this.owner.updateInfoTable(newValue);
            },
        })
    ], RclWidgets.prototype, "infoDownlink", void 0);
    __decorate([
        toolkit.TraitRef({
            type: toolkit.SelectableTrait,
            binds: true,
            observes: true,
            traitDidSelect() {
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
            traitWillUnselect() {
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
            detectTrait(trait) {
                return trait instanceof toolkit.SelectableTrait ? trait : null;
            },
        })
    ], RclWidgets.prototype, "selectable", void 0);
    __decorate([
        toolkit.TraitRef({
            type: platform.EntityTrait,
            binds: true,
            detectTrait(trait) {
                return trait instanceof platform.EntityTrait ? trait : null;
            },
        })
    ], RclWidgets.prototype, "entity", void 0);

    const RAIL_LINE_WIDTH = 1;
    class RailLocation extends platform.LocationTrait {
        constructor(geoPoints) {
            super();
            this.initLine(geoPoints);
        }
        initLine(geoPoints) {
            //const newLocal = latLngs as AnyGeoPath;
            const geographic = platform.GeographicLine.fromInit({
                geometry: runtime.GeoPath.fromPoints(geoPoints),
                // Subdued green / olive
                stroke: "rgb(85, 107, 47)",
                strokeWidth: RAIL_LINE_WIDTH
            });
            this.setGeographic(geographic);
        }
    }

    const MIN_RAIL_ZOOM$1 = 10;
    const MAX_RAIL_ZOOM$1 = 30;
    class RailGroup extends platform.NodeGroup {
        constructor(nodeUri) {
            super();
            this.downlink.nodeUri(nodeUri);
        }
        initNodeModel(nodeModel) {
            nodeModel.getTrait(platform.EntityTrait);
            //const locationTrait = new RailLocation(entityTrait.uri);
            //locationTrait.setZoomRange(MIN_RAIL_ZOOM, MAX_RAIL_ZOOM);
            //nodeModel.setTrait("location", locationTrait);
        }
        updateNodeModel(nodeModel, value) {
            nodeModel.getTrait(platform.EntityTrait);
            const coordinates = value.get("coordinates").stringValue("").split(",");
            const geoPoints = [];
            for (var i = 0; i < coordinates.length; i += 2) {
                const lng = parseFloat(coordinates[i + 1]);
                const lat = parseFloat(coordinates[i]);
                if (isFinite(lng) && isFinite(lat)) {
                    geoPoints.push(new runtime.GeoPoint(lng, lat));
                }
            }
            const railTrait = new RailLocation(geoPoints);
            railTrait.setZoomRange(MIN_RAIL_ZOOM$1, MAX_RAIL_ZOOM$1);
            nodeModel.setTrait("railLocation", railTrait);
        }
    }
    __decorate([
        runtime.MapDownlinkFastener({
            consumed: true,
            laneUri: "rails",
            didUpdate(key, value) {
                if (this.owner.consuming) {
                    const nodeModel = this.owner.getOrCreateNodeModel(key.stringValue(""));
                    this.owner.updateNodeModel(nodeModel, value);
                }
            },
            didRemove(key, value) {
                if (this.owner.consuming) {
                    this.owner.removeNodeModel(key.stringValue(""));
                }
            },
        })
    ], RailGroup.prototype, "downlink", void 0);

    const YARD_ICON = toolkit.VectorIcon.create(24, 24, "M15,11L15,5L12,2L9,5L9,7L3,7L3,21L21,21L21,11L15,11ZM7,19L5,19L5,17L7,17L7,19ZM7,15L5,15L5,13L7,13L7,15ZM7,11L5,11L5,9L7,9L7,11ZM13,19L11,19L11,17L13,17L13,19ZM13,15L11,15L11,13L13,13L13,15ZM13,11L11,11L11,9L13,9L13,11ZM13,7L11,7L11,5L13,5L13,7ZM19,19L17,19L17,17L19,17L19,19ZM19,15L17,15L17,13L19,13L19,15Z");
    const YARD_ICON_SIZE = 48;
    class YardLocation extends platform.LocationTrait {
        constructor(nodeUri) {
            super();
            this.geometryDownlink.nodeUri(nodeUri);
            this.statusDownlink.nodeUri(nodeUri);
        }
        getStatusFactor(status) {
            const numOfAlerts = status.get("Alerts").length;
            if (numOfAlerts > 0)
                return platform.StatusFactor.create("Severity", platform.StatusVector.of([platform.Status.warning, 2], [platform.Status.alert, Math.min(numOfAlerts / 2, 1)]));
            return null;
        }
    }
    __decorate([
        runtime.ValueDownlinkFastener({
            consumed: true,
            laneUri: "info",
            didSet(newValue, oldValue) {
                const lng = newValue.get("longitude").numberValue(NaN);
                const lat = newValue.get("latitude").numberValue(NaN);
                if (isFinite(lng) && isFinite(lat)) {
                    const geographic = platform.GeographicPoint.fromInit({
                        geometry: new runtime.GeoPoint(lng, lat),
                        width: YARD_ICON_SIZE,
                        height: YARD_ICON_SIZE,
                        graphics: YARD_ICON,
                        // Yellow
                        fill: "rgb(255, 255, 0)",
                    });
                    this.owner.setGeographic(geographic);
                }
                else {
                    this.owner.setGeographic(null);
                }
            },
        })
    ], YardLocation.prototype, "geometryDownlink", void 0);
    __decorate([
        runtime.ValueDownlinkFastener({
            consumed: true,
            laneUri: "status",
            didSet(newValue, oldValue) {
                this.owner.getTrait(platform.StatusTrait).setStatusFactor("Status", this.owner.getStatusFactor(newValue));
            },
        })
    ], YardLocation.prototype, "statusDownlink", void 0);

    class YardWidgets extends platform.WidgetGroup {
        // Status Widget
        updateStatusTable(key, value) {
            const rowModel = this.getOrCreateRowModel(key);
            const keyCell = rowModel.getTrait("key", toolkit.TextCellTrait);
            keyCell.content(key.stringValue(""));
            const timeCell = rowModel.getTrait("time", toolkit.TextCellTrait);
            const reportTime = new runtime.DateTime(value.get("reportTime").numberValue(void 0), runtime.TimeZone.forOffset(-480));
            timeCell.content(this.getTimeStr(reportTime));
            const statusCell = rowModel.getTrait("status", toolkit.TextCellTrait);
            const offline = value.get("isOffline").booleanValue(false);
            const idle = value.get("isIdle").booleanValue(false);
            const alertStatus = value.get("alertStatus").stringValue("");
            let status;
            if (offline) {
                status = "Offline";
                rowModel.getTrait(platform.StatusTrait).setStatusFactor("status", this.getAlertStatusFromFlag(true));
            }
            else if (idle) {
                status = "Idle";
                rowModel.getTrait(platform.StatusTrait).setStatusFactor("status", this.getWarningStatusFromFlag(true));
            }
            else {
                status = alertStatus;
                rowModel.getTrait(platform.StatusTrait).setStatusFactor("status", this.getStatusFactorFromAlert(alertStatus));
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
            const rowModel = new toolkit.Model();
            const rowTrait = new toolkit.RowTrait();
            const keyCell = new toolkit.TextCellTrait();
            keyCell.content(key.stringValue(""));
            rowModel.setTrait("row", rowTrait);
            rowModel.setTrait("key", keyCell);
            rowModel.setTrait("time", new toolkit.TextCellTrait());
            rowModel.setTrait("status", new toolkit.TextCellTrait());
            rowModel.setTrait("statusTrait", new platform.StatusTrait());
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
                return platform.StatusFactor.create("Severity", platform.StatusVector.of([platform.Status.warning, 2]));
            if (alertType == "Critical")
                return platform.StatusFactor.create("Severity", platform.StatusVector.of([platform.Status.alert, 2]));
            return null;
        }
        getWarningStatusFromFlag(flag) {
            if (flag)
                return platform.StatusFactor.create("Severity", platform.StatusVector.of([platform.Status.warning, 2]));
            return null;
        }
        getAlertStatusFromFlag(flag) {
            if (flag)
                return platform.StatusFactor.create("Severity", platform.StatusVector.of([platform.Status.alert, 2]));
            return null;
        }
    }
    __decorate([
        toolkit.ModelRef({
            key: "statusTable",
            createModel() {
                const tableModel = new toolkit.Model();
                tableModel.appendTrait(toolkit.TableTrait, "table")
                    .colSpacing(12);
                tableModel.appendTrait(toolkit.ColTrait, "key")
                    .layout({ key: "key", grow: 1, textColor: toolkit.Look.mutedColor });
                tableModel.appendTrait(toolkit.ColTrait, "value")
                    .layout({ key: "time", grow: 1, textColor: toolkit.Look.accentColor });
                tableModel.appendTrait(toolkit.ColTrait, "value")
                    .layout({ key: "status", grow: 1, textColor: toolkit.Look.accentColor });
                const headerRowModel = new toolkit.Model();
                headerRowModel.appendTrait(toolkit.RowTrait, "row");
                headerRowModel.appendTrait(toolkit.TextCellTrait, "key").content("RCL");
                headerRowModel.appendTrait(toolkit.TextCellTrait, "time").content("Report Time");
                headerRowModel.appendTrait(toolkit.TextCellTrait, "status").content("Status");
                tableModel.appendChild(headerRowModel, "header");
                return tableModel;
            },
        })
    ], YardWidgets.prototype, "statusTable", void 0);
    __decorate([
        toolkit.ModelRef({
            key: "status",
            binds: true,
            observes: true,
            createModel() {
                const widgetModel = new toolkit.Model();
                const widgetTrait = new platform.WidgetTrait();
                widgetTrait.title.setValue("STATUS");
                widgetTrait.subtitle.setValue("YARD");
                widgetModel.setTrait("widget", widgetTrait);
                this.owner.statusTable.insertModel(widgetModel);
                return widgetModel;
            },
        })
    ], YardWidgets.prototype, "statusWidget", void 0);
    __decorate([
        runtime.MapDownlinkFastener({
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
        toolkit.TraitRef({
            type: toolkit.SelectableTrait,
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
                return trait instanceof toolkit.SelectableTrait ? trait : null;
            },
        })
    ], YardWidgets.prototype, "selectable", void 0);
    __decorate([
        toolkit.TraitRef({
            type: platform.EntityTrait,
            binds: true,
            detectTrait(trait) {
                return trait instanceof platform.EntityTrait ? trait : null;
            },
        })
    ], YardWidgets.prototype, "entity", void 0);

    // For now remove yard icon
    const MAX_YARD_ZOOM$1 = -Infinity;
    const MIN_RAIL_ZOOM = 10;
    const MAX_RAIL_ZOOM = 18;
    class YardGroup extends platform.NodeGroup {
        initNodeModel(nodeModel) {
            const entityTrait = nodeModel.getTrait(platform.EntityTrait);
            const locationTrait = new YardLocation(entityTrait.uri);
            locationTrait.setZoomRange(-Infinity, MAX_YARD_ZOOM$1);
            nodeModel.setTrait("location", locationTrait);
            const widgetGroup = new YardWidgets();
            entityTrait.setTrait("widgets", widgetGroup);
            const RailModel = this.createNodeModel("/Rail");
            const railEntityTrait = RailModel.getTrait(platform.EntityTrait);
            const districtTrait = new platform.DistrictTrait();
            districtTrait.setZoomRange(MIN_RAIL_ZOOM, MAX_RAIL_ZOOM);
            districtTrait.setBoundary(runtime.GeoBox.globe());
            RailModel.setTrait("district", districtTrait);
            const subdistricts = new RailGroup(entityTrait.uri);
            RailModel.setChild("subdistricts", subdistricts);
            railEntityTrait.subentities.binds = false;
            railEntityTrait.subentities.setModel(subdistricts);
            this.appendChild(RailModel, "/Rail");
        }
        updateNodeModel(nodeModel, value) {
        }
    }
    __decorate([
        runtime.MapDownlinkFastener({
            consumed: true,
            nodeUri: "swim:meta:mesh",
            laneUri: "nodes#%2fyard%2f",
            didUpdate(key, value) {
                if (this.owner.consuming) {
                    const nodeModel = this.owner.getOrCreateNodeModel(key.stringValue(""));
                    this.owner.updateNodeModel(nodeModel, value);
                }
            },
            didRemove(key, value) {
                if (this.owner.consuming) {
                    this.owner.removeNodeModel(key.stringValue(""));
                }
            },
        })
    ], YardGroup.prototype, "downlink", void 0);

    const LOCOMOTIVE_ICON = toolkit.VectorIcon.create(24, 24, "M12.2,4C15.9,4,18.9,4.4,19,7.2L19,7.3L19,15.8C19,16.5,18.7,17.1,18.2,17.5L18.1,17.6L18.1,19.1C18.1,19.6,17.8,19.9,17.3,20L17.2,20L16.4,20C15.9,20,15.5,19.6,15.5,19.2L15.5,19.1L15.5,18L8.5,18L8.5,19.1C8.5,19.6,8.2,19.9,7.7,20L7.6,20L6.7,20C6.3,20,5.9,19.6,5.9,19.2L5.9,19.1L5.9,17.6C5.4,17.2,5,16.6,5,15.9L5,15.8L5,7.3C5,4.4,8,4,11.8,4L12.2,4ZM8,16.5C8.8,16.5,9.5,15.8,9.5,15C9.5,14.2,8.8,13.5,8,13.5C7.2,13.5,6.5,14.2,6.5,15C6.5,15.8,7.2,16.5,8,16.5ZM16,16.5C16.8,16.5,17.5,15.8,17.5,15C17.5,14.2,16.8,13.5,16,13.5C15.2,13.5,14.5,14.2,14.5,15C14.5,15.8,15.2,16.5,16,16.5ZM17,7L7,7L7,12L17,12L17,7Z");
    const LOCOMOTIVE_ICON_SIZE = 25;
    const RCU_ICON = toolkit.VectorIcon.create(24, 24, "M12,7C13.05,7,13.92,7.82,13.99,8.85L14,9C14,9.74,13.6,10.39,13,10.73L13,18L18.15,18C19.28,18,20.32,18.64,20.83,19.66L21.28,20.55C21.61,21.22,21.13,22,20.38,22L3.62,22C2.87,22,2.39,21.22,2.72,20.55L3.17,19.66C3.68,18.64,4.72,18,5.85,18L11,18L11,10.73C10.4,10.39,10,9.74,10,9C10,7.9,10.9,7,12,7ZM19.07,2.28C22.98,5.99,22.98,12.01,19.07,15.72C18.68,16.09,18.05,16.09,17.66,15.72C17.27,15.35,17.27,14.75,17.66,14.38C20.78,11.41,20.78,6.59,17.66,3.62C17.27,3.25,17.27,2.65,17.66,2.28C18.05,1.91,18.68,1.91,19.07,2.28ZM6.34,2.28C6.73,2.65,6.73,3.25,6.34,3.62C3.22,6.59,3.22,11.41,6.34,14.38C6.73,14.75,6.73,15.35,6.34,15.72C5.95,16.09,5.32,16.09,4.93,15.72C1.02,12.01,1.02,5.99,4.93,2.28C5.32,1.91,5.95,1.91,6.34,2.28ZM16.24,4.97C18.59,7.19,18.59,10.81,16.24,13.03C15.85,13.4,15.22,13.4,14.83,13.03C14.44,12.66,14.44,12.06,14.83,11.69C16.39,10.2,16.39,7.8,14.83,6.31C14.44,5.94,14.44,5.34,14.83,4.97C15.22,4.6,15.85,4.6,16.24,4.97ZM9.17,4.97C9.56,5.34,9.56,5.94,9.17,6.31C7.61,7.8,7.61,10.2,9.17,11.69C9.56,12.06,9.56,12.66,9.17,13.03C8.78,13.4,8.15,13.4,7.76,13.03C5.41,10.81,5.41,7.19,7.76,4.97C8.15,4.6,8.78,4.6,9.17,4.97Z");
    const RCU_ICON_SIZE = 25;
    const MIN_LOCOMOTIVE_ZOOM = -Infinity;
    const MAX_LOCOMOTIVE_ZOOM = Infinity;
    // To change zoom level also change _Group class
    // For now remove yard icon
    const MAX_YARD_ZOOM = -Infinity;
    class GridGroup extends platform.NodeGroup {
        constructor(geoTile, nodeUri, metaHostUri) {
            super(metaHostUri);
            this.geoTile = geoTile;
            this.rclsDownlink.nodeUri(nodeUri);
        }
        initSubtiles() {
            const geoTile = this.geoTile;
            const southWestTile = geoTile.southWestTile;
            const southWestTileId = southWestTile.x + "," + southWestTile.y + "," + southWestTile.z;
            const southWestNodeUri = runtime.Uri.path(runtime.UriPath.of("/", "map", "/", southWestTileId));
            const southWestModel = this.createNodeModel(southWestNodeUri.path, southWestNodeUri);
            this.initTileModel(southWestModel, southWestTile);
            this.appendChild(southWestModel, southWestNodeUri.toString());
            const northWestTile = geoTile.northWestTile;
            const northWestTileId = northWestTile.x + "," + northWestTile.y + "," + northWestTile.z;
            const northWestNodeUri = runtime.Uri.path(runtime.UriPath.of("/", "map", "/", northWestTileId));
            const northWestModel = this.createNodeModel(northWestNodeUri.path, northWestNodeUri);
            this.initTileModel(northWestModel, northWestTile);
            this.appendChild(northWestModel, northWestNodeUri.toString());
            const southEastTile = geoTile.southEastTile;
            const southEastTileId = southEastTile.x + "," + southEastTile.y + "," + southEastTile.z;
            const southEastNodeUri = runtime.Uri.path(runtime.UriPath.of("/", "map", "/", southEastTileId));
            const southEastModel = this.createNodeModel(southEastNodeUri.path, southEastNodeUri);
            this.initTileModel(southEastModel, southEastTile);
            this.appendChild(southEastModel, southEastNodeUri.toString());
            const northEastTile = geoTile.northEastTile;
            const northEastTileId = northEastTile.x + "," + northEastTile.y + "," + northEastTile.z;
            const northEastNodeUri = runtime.Uri.path(runtime.UriPath.of("/", "map", "/", northEastTileId));
            const northEastModel = this.createNodeModel(northEastNodeUri.path, northEastNodeUri);
            this.initTileModel(northEastModel, northEastTile);
            this.appendChild(northEastModel, northEastNodeUri.toString());
        }
        initTileModel(nodeModel, geoTile) {
            const entityTrait = nodeModel.getTrait(platform.EntityTrait);
            if (geoTile.z <= 16) {
                const districtTrait = new platform.DistrictTrait();
                districtTrait.setZoomRange(this.geoTile.z, geoTile.z < MAX_LOCOMOTIVE_ZOOM ? this.geoTile.z + 2 : Infinity);
                districtTrait.setBoundary(this.geoTile.bounds);
                nodeModel.setTrait("district", districtTrait);
                const subdistricts = new GridGroup(geoTile, entityTrait.uri, this.metaHostUri);
                nodeModel.setChild("subdistricts", subdistricts);
                entityTrait.subentities.binds = false;
                entityTrait.subentities.setModel(subdistricts);
                subdistricts.district.setTrait(districtTrait);
            }
        }
        // Yards
        initYards() {
            const YardModel = this.createNodeModel("/Yard");
            const entityTrait = YardModel.getTrait(platform.EntityTrait);
            const districtTrait = new platform.DistrictTrait();
            districtTrait.setZoomRange(-Infinity, MAX_YARD_ZOOM);
            districtTrait.setBoundary(runtime.GeoBox.globe());
            YardModel.setTrait("district", districtTrait);
            const subdistricts = new YardGroup();
            subdistricts.setTrait("status", new platform.StatusTrait());
            YardModel.setChild("subdistricts", subdistricts);
            entityTrait.subentities.binds = false;
            entityTrait.subentities.setModel(subdistricts);
            this.appendChild(YardModel, "/Yard");
        }
        // Rcls
        initRclNodeModel(nodeModel) {
            const entityTrait = nodeModel.getTrait(platform.EntityTrait);
            entityTrait.icon.setValue(LOCOMOTIVE_ICON);
            const locationTrait = new platform.LocationTrait();
            locationTrait.setZoomRange(MIN_LOCOMOTIVE_ZOOM - 1, Infinity);
            nodeModel.setTrait("location", locationTrait);
            const statusTrait = nodeModel.getTrait(platform.StatusTrait);
            statusTrait.setStatusFactor("severity", platform.StatusFactor.create("Severity", platform.StatusVector.of([platform.Status.normal, 2])));
            const widgetGroup = new RclWidgets();
            entityTrait.setTrait("widgets", widgetGroup);
        }
        updateRclNodeModel(nodeModel, value) {
            const locationTrait = nodeModel.getTrait(platform.LocationTrait);
            const lng = value.get("longitude").numberValue(NaN);
            const lat = value.get("latitude").numberValue(NaN);
            if (isFinite(lng) && isFinite(lat)) {
                const geographic = platform.GeographicPoint.fromInit({
                    geometry: new runtime.GeoPoint(lng, lat),
                    width: LOCOMOTIVE_ICON_SIZE,
                    height: LOCOMOTIVE_ICON_SIZE,
                    graphics: LOCOMOTIVE_ICON,
                });
                locationTrait.setGeographic(geographic);
            }
            else {
                locationTrait.setGeographic(null);
            }
            nodeModel.getTrait(platform.StatusTrait).setStatusFactor("Status", this.getStatusFactor(value));
        }
        getStatusFactor(status) {
            const isOffline = status.get("isOffline").booleanValue();
            const isCritical = status.get("isCriticalAlert").booleanValue();
            const isIdle = status.get("isIdle").booleanValue();
            const isWarning = status.get("alertStatus").stringValue("") == "Warning";
            if (isOffline || isCritical)
                return platform.StatusFactor.create("Severity", platform.StatusVector.of([platform.Status.alert, 2]));
            if (isIdle || isWarning)
                return platform.StatusFactor.create("Severity", platform.StatusVector.of([platform.Status.warning, 2]));
            return null;
        }
        getOrCreateRclNodeModel(nodePath) {
            if (typeof nodePath !== "string") {
                nodePath = runtime.UriPath.fromAny(nodePath).toString();
            }
            let nodeModel = this.getChild(nodePath);
            if (nodeModel === null) {
                nodeModel = this.createNodeModel(nodePath);
                this.initRclNodeModel(nodeModel);
                this.appendChild(nodeModel, nodePath);
            }
            return nodeModel;
        }
        // RCUs
        initRcuNodeModel(nodeModel) {
            const entityTrait = nodeModel.getTrait(platform.EntityTrait);
            entityTrait.icon.setValue(RCU_ICON);
            const locationTrait = new platform.LocationTrait();
            locationTrait.setZoomRange(MIN_LOCOMOTIVE_ZOOM - 1, Infinity);
            nodeModel.setTrait("location", locationTrait);
            const statusTrait = nodeModel.getTrait(platform.StatusTrait);
            statusTrait.setStatusFactor("severity", platform.StatusFactor.create("Severity", platform.StatusVector.of([platform.Status.normal, 2])));
            const widgetGroup = new RclWidgets();
            entityTrait.setTrait("widgets", widgetGroup);
        }
        updateRcuNodeModel(nodeModel, value) {
            const locationTrait = nodeModel.getTrait(platform.LocationTrait);
            const lng = value.get("longitude").numberValue(NaN);
            const lat = value.get("latitude").numberValue(NaN);
            if (isFinite(lng) && isFinite(lat)) {
                const geographic = platform.GeographicPoint.fromInit({
                    geometry: new runtime.GeoPoint(lng, lat),
                    width: RCU_ICON_SIZE,
                    height: RCU_ICON_SIZE,
                    graphics: RCU_ICON,
                });
                locationTrait.setGeographic(geographic);
            }
            else {
                locationTrait.setGeographic(null);
            }
            nodeModel.getTrait(platform.StatusTrait).setStatusFactor("Status", this.getStatusFactor(value));
        }
        getOrCreateRcuNodeModel(nodePath) {
            if (typeof nodePath !== "string") {
                nodePath = runtime.UriPath.fromAny(nodePath).toString();
            }
            let nodeModel = this.getChild(nodePath);
            if (nodeModel === null) {
                nodeModel = this.createNodeModel(nodePath);
                this.initRcuNodeModel(nodeModel);
                this.appendChild(nodeModel, nodePath);
            }
            return nodeModel;
        }
        onStartConsuming() {
            super.onStartConsuming();
            if (this.geoTile.z === 0) {
                this.initYards();
            }
            this.initSubtiles();
        }
        onStopConsuming() {
            super.onStopConsuming();
            this.removeChildren();
        }
    }
    __decorate([
        runtime.MapDownlinkFastener({
            laneUri: "agents",
            didUpdate(key, value) {
                if (this.owner.consuming && this.owner.district.trait.consuming) {
                    if (key.stringValue("").startsWith("/rcl")) {
                        const nodeModel = this.owner.getOrCreateRclNodeModel(key.stringValue(""));
                        this.owner.updateRclNodeModel(nodeModel, value);
                    }
                    else if (key.stringValue("").startsWith("/rcu")) {
                        const nodeModel = this.owner.getOrCreateRcuNodeModel(key.stringValue(""));
                        this.owner.updateRcuNodeModel(nodeModel, value);
                    }
                }
            },
            didRemove(key, value) {
                if (this.owner.consuming && this.owner.district.trait.consuming) {
                    this.owner.removeNodeModel(key.stringValue(""));
                }
            },
        })
    ], GridGroup.prototype, "rclsDownlink", void 0);
    __decorate([
        toolkit.TraitRef({
            type: platform.DistrictTrait,
            observes: true,
            traitDidStartConsuming() {
                if (this.owner.geoTile.z % 2 === 0 && this.owner.geoTile.z > MIN_LOCOMOTIVE_ZOOM - 1) {
                    this.owner.rclsDownlink.consume(this.owner);
                }
            },
            traitWillStopConsuming() {
                this.owner.rclsDownlink.unconsume(this.owner);
                let child = this.owner.firstChild;
                while (child !== null) {
                    const next = child.nextSibling;
                    if (!(child.getChild("subdistricts") instanceof GridGroup)) {
                        child.remove();
                    }
                    child = next;
                }
            },
        })
    ], GridGroup.prototype, "district", void 0);

    const DOMAIN_ICON = toolkit.VectorIcon.create(24, 24, "M12.2,4C15.9,4,18.9,4.4,19,7.2L19,7.3L19,15.8C19,16.5,18.7,17.1,18.2,17.5L18.1,17.6L18.1,19.1C18.1,19.6,17.8,19.9,17.3,20L17.2,20L16.4,20C15.9,20,15.5,19.6,15.5,19.2L15.5,19.1L15.5,18L8.5,18L8.5,19.1C8.5,19.6,8.2,19.9,7.7,20L7.6,20L6.7,20C6.3,20,5.9,19.6,5.9,19.2L5.9,19.1L5.9,17.6C5.4,17.2,5,16.6,5,15.9L5,15.8L5,7.3C5,4.4,8,4,11.8,4L12.2,4ZM8,16.5C8.8,16.5,9.5,15.8,9.5,15C9.5,14.2,8.8,13.5,8,13.5C7.2,13.5,6.5,14.2,6.5,15C6.5,15.8,7.2,16.5,8,16.5ZM16,16.5C16.8,16.5,17.5,15.8,17.5,15C17.5,14.2,16.8,13.5,16,13.5C15.2,13.5,14.5,14.2,14.5,15C14.5,15.8,15.2,16.5,16,16.5ZM17,7L7,7L7,12L17,12L17,7Z");
    class NstreamRailroadPlugin extends platform.EntityPlugin {
        get id() {
            return "nstream-railroad";
        }
        get title() {
            return "Nstream Railroad";
        }
        injectEntity(entityTrait, domainTrait) {
            const entityUri = entityTrait.uri.toString();
            if (entityUri.startsWith("warp://") || entityUri.startsWith("warps://")) {
                entityTrait.title.setValue("Nstream Railroad");
                entityTrait.icon.setValue(DOMAIN_ICON);
                const districtTrait = new platform.DistrictTrait();
                districtTrait.setZoomRange(-Infinity, Infinity);
                entityTrait.setTrait("district", districtTrait);
                const rootTile = runtime.GeoTile.root();
                const rootTileId = rootTile.x + "," + rootTile.y + "," + rootTile.z;
                const rootNodeUri = runtime.Uri.path(runtime.UriPath.of("/", "map", "/", rootTileId));
                const subdistricts = new GridGroup(rootTile, rootNodeUri);
                districtTrait.setChild("subdistricts", subdistricts);
            }
        }
    }

    platform.PrismService.insertPlugin(new NstreamRailroadPlugin());

    exports.GridGroup = GridGroup;
    exports.NstreamRailroadPlugin = NstreamRailroadPlugin;
    exports.RailGroup = RailGroup;
    exports.RailLocation = RailLocation;
    exports.RclWidgets = RclWidgets;
    exports.YardGroup = YardGroup;
    exports.YardLocation = YardLocation;
    exports.YardWidgets = YardWidgets;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({}, swim, swim, swim);
//# sourceMappingURL=nstream-railroad.js.map
