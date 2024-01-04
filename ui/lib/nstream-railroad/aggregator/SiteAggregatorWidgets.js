import { __decorate } from "tslib";
import { DateTime, Value, MapDownlinkFastener, TimeZone, ValueDownlinkFastener } from "@swim/runtime";
import { BottomAxisTrait, ChartTrait, ColTrait, DataPointTrait, DataSetTrait, DialTrait, Feel, LinePlotTrait, Look, GaugeTrait, GraphTrait, Model, ModelRef, MoodVector, RowTrait, SelectableTrait, TableTrait, TextCellTrait, Theme, TraitRef } from "@swim/toolkit";
import { EntityTrait, Status, StatusFactor, StatusTrait, StatusVector, WidgetGroup, WidgetTrait } from "@swim/platform";
const ALERT_NAMES = ["Overall", "ENDC_Drop", "ENDC_Setup_Failure", "Peak_UE", "DL_Volume", "UL_Volume", "DL_UE_Throughput"];
const STATUS_NAMES = ["GOOD", "OK", "BAD", "VERY BAD"];
export class SiteAggregatorWidgets extends WidgetGroup {
    constructor(type) {
        super();
        this.type = type;
    }
    // Status Widget
    updateStatusTable(value) {
        const tableModel = this.statusTable.model;
        const alertAmount = Math.min(3, value.get("Alerts").length);
        const statusRowModel = tableModel.getChild("statusName");
        statusRowModel.getTrait("value", TextCellTrait)
            .content(STATUS_NAMES[alertAmount]);
        statusRowModel.getTrait(StatusTrait).setStatusFactor("status", this.getStatusFactorFromAlertCount(value));
    }
    getStatusFactorFromAlertCount(status) {
        const numOfAlerts = status.get("Alerts").length;
        if (numOfAlerts > 1)
            return StatusFactor.create("Severity", StatusVector.of([Status.warning, 2], [Status.alert, Math.min(numOfAlerts, 1)]));
        if (numOfAlerts > 0)
            return StatusFactor.create("Severity", StatusVector.of([Status.warning, 2]));
        return null;
    }
    // Info Widget
    updateInfoTable(value) {
        const tableModel = this.infoTable.model;
        const userCountRowModel = tableModel.getChild("users");
        userCountRowModel.getTrait("value", TextCellTrait)
            .content(value.get("user_count").stringValue(""));
        const aggregatorNameRowModel = tableModel.getChild("name");
        aggregatorNameRowModel.getTrait("value", TextCellTrait)
            .content(value.get("name").stringValue(""));
        const aggregatorSiteCountRowModel = tableModel.getChild("siteCount");
        aggregatorSiteCountRowModel.getTrait("value", TextCellTrait)
            .content(value.get("site_count").stringValue(""));
    }
    // Alerts Widget
    // -- Current Info Table (Timestamp)
    updateCurrentInfoTable(value) {
        const tableModel = this.currentInfoTable.model;
        if (value.get("most_recent_timestamp").isDefined()) {
            const time = new DateTime(value.get("most_recent_timestamp").numberValue(void 0) * 1000, TimeZone.forOffset(-480));
            const currentHourRowModel = tableModel === null || tableModel === void 0 ? void 0 : tableModel.getChild("hour");
            currentHourRowModel.getTrait("value", TextCellTrait)
                .content(time.hour + ":00 - " + (time.month + 1) + "/" + time.day + "/" + time.year);
        }
        else {
            const currentHourRowModel = tableModel === null || tableModel === void 0 ? void 0 : tableModel.getChild("hour");
            currentHourRowModel.getTrait("value", TextCellTrait)
                .content("-");
        }
        const dataCountRowModel = tableModel === null || tableModel === void 0 ? void 0 : tableModel.getChild("count");
        dataCountRowModel.getTrait("value", TextCellTrait)
            .content(value.get("Current_Site_Stats").get("Count").stringValue("") + " / " + value.get("Current_Site_Stats").get("Max_Sites").stringValue(""));
    }
    // -- Most Impacted KPI 
    updateMostImpactedKpiTable(value) {
        const tableModel = this.mostImpactedKpiTable.model;
        const increase = value.get("Most_Impacted_KPI_Increase").numberValue(0);
        const kpiRowModel = tableModel.getChild("mostImpactedKpi");
        kpiRowModel.getTrait("key", TextCellTrait)
            .content(value.get("Most_Impacted_KPI").stringValue(""));
        kpiRowModel.getTrait("value", TextCellTrait)
            .content(Math.round(increase * 100) + "%");
        kpiRowModel.getTrait(StatusTrait)
            .setStatusFactor("status", StatusFactor.create("status", StatusVector.of([Status.warning, Math.min(2, increase + 1)], [Status.alert, Math.max(0, Math.min(1, increase))])));
    }
    // -- Alert Counts
    updateAlertCountsTable(value) {
        const tableModel = this.alertCountsTable.model;
        const alertsRowModel = tableModel.getChild("Overall");
        const currentAlertCount = value.get("Current_Site_Stats").get("Overall").get("Alert_Count").numberValue(0);
        const previousAlertCount = value.get("prev_30_day_max_alert_count").get("Overall").numberValue(0);
        alertsRowModel.getTrait("current", TextCellTrait)
            .content(currentAlertCount + "");
        alertsRowModel.getTrait("previous", TextCellTrait)
            .content(previousAlertCount + "");
        const statusTrait = alertsRowModel.getTrait(StatusTrait);
        if (currentAlertCount > previousAlertCount) {
            statusTrait.setStatusFactor("status", StatusFactor.create("Rank", StatusVector.of([Status.warning, 2], [Status.alert, 1])));
        }
        else if (currentAlertCount > previousAlertCount * 0.8) {
            statusTrait.setStatusFactor("status", StatusFactor.create("Rank", StatusVector.of([Status.warning, 2])));
        }
        else {
            statusTrait.setStatusFactor("status", null);
        }
    }
    // Users Impacted Widget
    // -- Users Gauge
    updateOverallUsersImpactedGauge(value) {
        const gaugeModel = this.overallUsersImpactedGauge.model;
        const totalUserCount = value.get("Current_Site_Stats").get("User_Count").numberValue(void 0);
        const impactedUserCount = value.get("Current_Site_Stats").get("Overall").get("Alert_User_Count").numberValue(0);
        const impactedUsersPercent = (impactedUserCount / totalUserCount) * 100;
        gaugeModel.getTrait(GaugeTrait).title(totalUserCount === void 0 ? "N/A" : Math.round(impactedUsersPercent) + "%");
        const usersImpactedDialModel = gaugeModel.getChild("users");
        usersImpactedDialModel.getTrait(DialTrait)
            .value(totalUserCount === void 0 ? 0 : Math.round(impactedUsersPercent));
        usersImpactedDialModel.getTrait(StatusTrait).setStatusFactor("users", totalUserCount === void 0 ? null :
            StatusFactor.create("User", StatusVector.of([Status.warning, Math.min(2, impactedUsersPercent / 5)], [Status.alert, Math.min(1, (Math.max(0, impactedUsersPercent - 10) / 15))])));
    }
    // KPI Breakdown 
    // -- Alert History Charts
    updateAlertHistoryCharts(newStatus, oldStatus) {
        var _a, _b, _c, _d;
        if (newStatus.equals(oldStatus))
            return;
        const timestamp = newStatus.get("most_recent_timestamp").numberValue(void 0);
        if (timestamp === void 0)
            return;
        // New Hour
        if (timestamp !== oldStatus.get("most_recent_timestamp").numberValue(void 0)) {
            this.removeAllAlertHistoryCharts();
        }
        // Deal with the always showing 'Overall Chart' in the alertsWidget first...
        if (((_a = this.alertsWidget.model) === null || _a === void 0 ? void 0 : _a.getChild("OverallChart")) === null) {
            (_b = this.alertsWidget.model) === null || _b === void 0 ? void 0 : _b.appendChild(this.createAlertHistoryChart("Overall", timestamp, newStatus.get("prev_30_day_max_alert_count").get("Overall").numberValue(0)), "OverallChart");
        }
        else {
            const overallAlertCountPlot = (_d = (_c = this.alertsWidget.model) === null || _c === void 0 ? void 0 : _c.getChild("OverallChart")) === null || _d === void 0 ? void 0 : _d.getChild("alertCount");
            const overallAlertCount = newStatus.get("Current_Site_Stats").get("Overall").get("Alert_Count").numberValue(0);
            const overallPreviousMaxAlertCount = newStatus.get("prev_30_day_max_alert_count").get("Overall").numberValue(0);
            const alertCountDataPointModel = new Model();
            const dataPointTrait = alertCountDataPointModel
                .appendTrait(new DataPointTrait(new DateTime(timestamp * 1000, TimeZone.forOffset(-480)), overallAlertCount), "dataPoint");
            if (overallAlertCount > overallPreviousMaxAlertCount) {
                dataPointTrait.color.
                    setValue(Theme.dark.get(Look.accentColor, MoodVector.of([Feel.primary, 1], [Feel.warning, 2], [Feel.alert, 1.5])));
            }
            else if (overallAlertCount === overallPreviousMaxAlertCount) {
                dataPointTrait.color.
                    setValue(Theme.dark.get(Look.accentColor, MoodVector.of([Feel.primary, 1], [Feel.warning, 2])));
            }
            else {
                dataPointTrait.color.
                    setValue(Theme.dark.get(Look.accentColor, MoodVector.of([Feel.primary, 1])));
            }
            overallAlertCountPlot.removeChild("" + timestamp);
            overallAlertCountPlot.appendChild(alertCountDataPointModel, "" + timestamp);
        }
        // For each alert...
        newStatus.get("Alerts").forEach((item) => {
            var _a, _b, _c;
            const alertName = item.stringValue("");
            if ("" !== alertName) {
                // If it is a new alert, create a graph
                if (((_a = this.kpiBreakdownWidget.model) === null || _a === void 0 ? void 0 : _a.getChild(alertName)) === null) {
                    (_b = this.kpiBreakdownWidget.model) === null || _b === void 0 ? void 0 : _b.appendChild(this.createAlertHistoryChartTitle(alertName), alertName);
                    (_c = this.kpiBreakdownWidget.model) === null || _c === void 0 ? void 0 : _c.appendChild(this.createAlertHistoryChart(alertName, timestamp, newStatus.get("prev_30_day_max_alert_count").get(alertName).numberValue(0)), alertName + "_chart");
                }
                else { // Else this is just a status update so just update the current alert count of the plot
                    this.updateAlertChartCurrentTimestamp(alertName, timestamp, newStatus.get("Current_Site_Stats").get(alertName).get("Alert_Count").numberValue(0));
                }
            }
        });
    }
    createAlertHistoryChartTitle(alertName) {
        const tableModel = new Model();
        tableModel.appendTrait(TableTrait, "table")
            .colSpacing(12);
        tableModel.appendTrait(ColTrait, "key")
            .layout({ key: "key", grow: 1, textColor: Look.accentColor });
        const rowModel = new Model();
        rowModel.appendTrait(RowTrait, "row");
        rowModel.appendTrait(TextCellTrait, "key")
            .content(alertName);
        rowModel.appendTrait(StatusTrait, "status")
            .setStatusFactor("status", StatusFactor.create("status", StatusVector.of([Status.warning, 2], [Status.alert, 0.5])));
        tableModel.appendChild(rowModel, "alert");
        return tableModel;
    }
    createAlertHistoryChart(alertName, timestamp, previousMax) {
        const chartModel = new Model();
        chartModel.appendTrait(ChartTrait, "chart");
        chartModel.appendTrait(GraphTrait, "graph");
        chartModel.appendTrait(BottomAxisTrait, "bottomAxis");
        const alertCountPlot = new Model();
        alertCountPlot.appendTrait(LinePlotTrait, "plot");
        alertCountPlot.appendTrait(DataSetTrait, "dataSet");
        alertCountPlot.appendTrait(StatusTrait, "status");
        chartModel.appendChild(alertCountPlot, "alertCount");
        for (let i = 0; i < 30; i++) {
            const historyTimestamp = timestamp - (i * 86400);
            const alertCount = this.alertHistoryDownlink.get(historyTimestamp).get(alertName).get("Alert_Count").numberValue(void 0);
            if (alertCount !== void 0) { // We have a previous day to plot
                const alertCountDataPointModel = new Model();
                const dataPointTrait = alertCountDataPointModel
                    .appendTrait(new DataPointTrait(new DateTime(historyTimestamp * 1000, TimeZone.forOffset(-480)), alertCount), "dataPoint");
                if (alertCount > previousMax) {
                    dataPointTrait.color.
                        setValue(Theme.dark.get(Look.accentColor, MoodVector.of([Feel.primary, 1], [Feel.warning, 2], [Feel.alert, 1.5])));
                }
                else if (alertCount === previousMax) {
                    dataPointTrait.color.
                        setValue(Theme.dark.get(Look.accentColor, MoodVector.of([Feel.primary, 1], [Feel.warning, 2])));
                }
                else {
                    dataPointTrait.color.
                        setValue(Theme.dark.get(Look.accentColor, MoodVector.of([Feel.primary, 1])));
                }
                alertCountPlot.appendChild(alertCountDataPointModel, "" + historyTimestamp);
            }
        }
        return chartModel;
    }
    updateAlertChartCurrentTimestamp(alertName, timestamp, alertCount) {
        var _a, _b;
        const alertCountPlot = (_b = (_a = this.kpiBreakdownWidget.model) === null || _a === void 0 ? void 0 : _a.getChild(alertName + "_chart")) === null || _b === void 0 ? void 0 : _b.getChild("alertCount");
        const alertCountDataPointModel = new Model();
        const dataPointTrait = alertCountDataPointModel
            .appendTrait(new DataPointTrait(new DateTime(timestamp * 1000, TimeZone.forOffset(-480)), alertCount), "dataPoint");
        dataPointTrait.color.
            setValue(Theme.dark.get(Look.accentColor, MoodVector.of([Feel.primary, 1], [Feel.warning, 2], [Feel.alert, 1.5])));
        alertCountPlot.removeChild("" + timestamp);
        alertCountPlot.appendChild(alertCountDataPointModel, "" + timestamp);
    }
    removeAllAlertHistoryCharts() {
        var _a;
        (_a = this.alertsWidget.model) === null || _a === void 0 ? void 0 : _a.removeChild("OverallChart");
        ALERT_NAMES.forEach((alertName) => {
            var _a, _b;
            (_a = this.kpiBreakdownWidget.model) === null || _a === void 0 ? void 0 : _a.removeChild(alertName);
            (_b = this.kpiBreakdownWidget.model) === null || _b === void 0 ? void 0 : _b.removeChild(alertName + "_chart");
        });
    }
    // We need this for initial load of the widget 
    didSyncAlertHistory() {
        this.removeAllAlertHistoryCharts();
        this.updateAlertHistoryCharts(this.statusDownlink.get(), Value.absent());
    }
    // Worst Sites
    // -- Overall Degradation Table
    updateWorstOverallDegradationTable(key, value, oldValue) {
        var _a, _b, _c, _d, _e;
        const tableModel = this.worstOverallDegradationTable.model;
        const oldIndex = oldValue.get("worstSiteIndex").numberValue(void 0);
        const newIndex = value.get("worstSiteIndex").numberValue(void 0);
        if (newIndex !== oldIndex) {
            // The rank of the site has changed:
            if (oldIndex !== void 0 && oldIndex < 5) {
                // The site has moved rank so the old row must be removed
                const rowModel = tableModel.getChild(oldIndex + "");
                (_a = rowModel === null || rowModel === void 0 ? void 0 : rowModel.getTrait("key", TextCellTrait)) === null || _a === void 0 ? void 0 : _a.content("-");
                (_b = rowModel === null || rowModel === void 0 ? void 0 : rowModel.getTrait("value", TextCellTrait)) === null || _b === void 0 ? void 0 : _b.content("-");
            }
            if (newIndex !== void 0 && newIndex < 5) {
                // The site's new rank is in the top 5 and so the row must be added
                const rowModel = tableModel.getChild(newIndex + "");
                (_c = rowModel === null || rowModel === void 0 ? void 0 : rowModel.getTrait("key", TextCellTrait)) === null || _c === void 0 ? void 0 : _c.content(key.stringValue(""));
                (_d = rowModel === null || rowModel === void 0 ? void 0 : rowModel.getTrait("value", TextCellTrait)) === null || _d === void 0 ? void 0 : _d.content(value.get("Continuous_Degradation").get("Overall").stringValue("") + " hours");
            }
        }
        else if (newIndex !== void 0 && newIndex < 5) {
            // The rank hasn't changed but the value may have
            const rowModel = tableModel.getChild(newIndex + "");
            (_e = rowModel === null || rowModel === void 0 ? void 0 : rowModel.getTrait("value", TextCellTrait)) === null || _e === void 0 ? void 0 : _e.content(value.get("Continuous_Degradation").get("Overall").stringValue("") + " hours");
        }
    }
    // Missing Data Widget
    updateMissingDataTable(newValue, oldValue) {
        const tableModel = this.missingDataTable.model;
        if (newValue.equals(oldValue))
            return;
        tableModel.removeChildren();
        for (let i = 0; i < Math.min(5, newValue.length); i++) {
            const item = newValue.getItem(i);
            const missingTimestamp = item.key;
            const missingSites = item.toValue();
            const time = new DateTime(missingTimestamp.numberValue(0) * 1000, TimeZone.forOffset(-480));
            const missingTimestampRowModel = new Model();
            missingTimestampRowModel.appendTrait(RowTrait, "row");
            missingTimestampRowModel.appendTrait(TextCellTrait, "value1")
                .content(time.hour + ":00 - " + (time.month + 1) + "/" + time.day + "/" + time.year);
            missingTimestampRowModel.appendTrait(TextCellTrait, "value2")
                .content(missingSites.stringValue(""));
            missingTimestampRowModel.appendTrait(StatusTrait, "status").setStatusFactor("status", StatusFactor.create("status", StatusVector.of([Status.warning, 1], [Status.alert, 0.2])));
            tableModel.appendChild(missingTimestampRowModel, missingTimestamp.stringValue(""));
        }
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
                .layout({ key: "value", grow: 1, textColor: Look.accentColor });
            const statusRowModel = new Model();
            statusRowModel.appendTrait(RowTrait, "row");
            statusRowModel.appendTrait(TextCellTrait, "value");
            statusRowModel.appendTrait(StatusTrait, "status");
            tableModel.appendChild(statusRowModel, "statusName");
            return tableModel;
        },
    })
], SiteAggregatorWidgets.prototype, "statusTable", void 0);
__decorate([
    ModelRef({
        key: "status",
        binds: true,
        observes: true,
        createModel() {
            const widgetModel = new Model();
            const widgetTrait = new WidgetTrait();
            widgetTrait.title.setValue("STATUS");
            widgetTrait.subtitle.setValue(this.owner.type);
            widgetModel.setTrait("widget", widgetTrait);
            this.owner.statusTable.insertModel(widgetModel);
            return widgetModel;
        },
    })
], SiteAggregatorWidgets.prototype, "statusWidget", void 0);
__decorate([
    ModelRef({
        key: "infoTable",
        createModel() {
            const tableModel = new Model();
            tableModel.appendTrait(TableTrait, "table")
                .colSpacing(12);
            tableModel.appendTrait(ColTrait, "key")
                .layout({ key: "key", grow: 2, textColor: Look.mutedColor });
            tableModel.appendTrait(ColTrait, "value")
                .layout({ key: "value", grow: 3, textColor: Look.accentColor });
            const userCountRowModel = new Model();
            userCountRowModel.appendTrait(RowTrait, "row");
            userCountRowModel.appendTrait(TextCellTrait, "key")
                .content("User Count");
            userCountRowModel.appendTrait(TextCellTrait, "value");
            userCountRowModel.appendTrait(StatusTrait, "status");
            tableModel.appendChild(userCountRowModel, "users");
            const nameRowModel = new Model();
            nameRowModel.appendTrait(RowTrait, "row");
            nameRowModel.appendTrait(TextCellTrait, "key")
                .content("Name");
            nameRowModel.appendTrait(TextCellTrait, "value");
            tableModel.appendChild(nameRowModel, "name");
            const siteCountRowModel = new Model();
            siteCountRowModel.appendTrait(RowTrait, "row");
            siteCountRowModel.appendTrait(TextCellTrait, "key")
                .content("Site Count");
            siteCountRowModel.appendTrait(TextCellTrait, "value");
            tableModel.appendChild(siteCountRowModel, "siteCount");
            return tableModel;
        },
    })
], SiteAggregatorWidgets.prototype, "infoTable", void 0);
__decorate([
    ModelRef({
        key: "info",
        binds: true,
        observes: true,
        createModel() {
            const widgetModel = new Model();
            const widgetTrait = new WidgetTrait();
            widgetTrait.title.setValue("INFO");
            widgetTrait.subtitle.setValue(this.owner.type);
            widgetModel.setTrait("widget", widgetTrait);
            this.owner.infoTable.insertModel(widgetModel);
            return widgetModel;
        },
    })
], SiteAggregatorWidgets.prototype, "infoWidget", void 0);
__decorate([
    ModelRef({
        key: "currentInfo",
        createModel() {
            const tableModel = new Model();
            tableModel.appendTrait(TableTrait, "table")
                .colSpacing(12);
            tableModel.appendTrait(ColTrait, "key")
                .layout({ key: "key", grow: 1, textColor: Look.mutedColor });
            tableModel.appendTrait(ColTrait, "value")
                .layout({ key: "value", grow: 1, textColor: Look.accentColor });
            const currentHourRowModel = new Model();
            currentHourRowModel.appendTrait(RowTrait, "row");
            currentHourRowModel.appendTrait(TextCellTrait, "key")
                .content("Current Hour");
            currentHourRowModel.appendTrait(TextCellTrait, "value");
            currentHourRowModel.appendTrait(StatusTrait, "status");
            tableModel.appendChild(currentHourRowModel, "hour");
            const dataCountRowModel = new Model();
            dataCountRowModel.appendTrait(RowTrait, "row");
            dataCountRowModel.appendTrait(TextCellTrait, "key")
                .content("Reporting Sites");
            dataCountRowModel.appendTrait(TextCellTrait, "value");
            tableModel.appendChild(dataCountRowModel, "count");
            const paddingRowModel = new Model();
            paddingRowModel.appendTrait(RowTrait, "row");
            paddingRowModel.appendTrait(TextCellTrait, "value");
            tableModel.appendChild(paddingRowModel, "pad1");
            return tableModel;
        },
    })
], SiteAggregatorWidgets.prototype, "currentInfoTable", void 0);
__decorate([
    ModelRef({
        key: "mostImpactedKpiTable",
        createModel() {
            const tableModel = new Model();
            tableModel.appendTrait(TableTrait, "table")
                .colSpacing(12);
            tableModel.appendTrait(ColTrait, "key")
                .layout({ key: "key", grow: 3, textColor: Look.accentColor });
            tableModel.appendTrait(ColTrait, "value")
                .layout({ key: "value", grow: 1, textColor: Look.accentColor });
            const titleRowModel = new Model();
            titleRowModel.appendTrait(RowTrait, "row");
            titleRowModel.appendTrait(TextCellTrait, "key")
                .content("Most Impacted KPI");
            titleRowModel.appendTrait(TextCellTrait, "value")
                .content("Increase");
            tableModel.appendChild(titleRowModel, "title");
            const kpiRowModel = new Model();
            kpiRowModel.appendTrait(RowTrait, "row");
            kpiRowModel.appendTrait(TextCellTrait, "key");
            kpiRowModel.appendTrait(TextCellTrait, "value");
            kpiRowModel.appendTrait(StatusTrait, "status");
            tableModel.appendChild(kpiRowModel, "mostImpactedKpi");
            const paddingRowModel = new Model();
            paddingRowModel.appendTrait(RowTrait, "row");
            paddingRowModel.appendTrait(TextCellTrait, "value");
            tableModel.appendChild(paddingRowModel, "pad1");
            return tableModel;
        },
    })
], SiteAggregatorWidgets.prototype, "mostImpactedKpiTable", void 0);
__decorate([
    ModelRef({
        key: "alertCountsTable",
        createModel() {
            const tableModel = new Model();
            tableModel.appendTrait(TableTrait, "table")
                .colSpacing(12);
            tableModel.appendTrait(ColTrait, "value")
                .layout({ key: "key", grow: 2, textColor: Look.mutedColor });
            tableModel.appendTrait(ColTrait, "value")
                .layout({ key: "current", grow: 1, textColor: Look.accentColor });
            tableModel.appendTrait(ColTrait, "value")
                .layout({ key: "previous", grow: 1, textColor: Look.accentColor });
            const titleRowModel = new Model();
            titleRowModel.appendTrait(RowTrait, "row");
            titleRowModel.appendTrait(TextCellTrait, "key");
            titleRowModel.appendTrait(TextCellTrait, "current")
                .content("Current Issue Count");
            titleRowModel.appendTrait(TextCellTrait, "previous")
                .content("Baseline Issue Count");
            tableModel.appendChild(titleRowModel, "title");
            const alertsRowModel = new Model();
            alertsRowModel.appendTrait(RowTrait, "row");
            alertsRowModel.appendTrait(TextCellTrait, "key")
                .content("Overall");
            alertsRowModel.appendTrait(TextCellTrait, "current");
            alertsRowModel.appendTrait(TextCellTrait, "previous");
            alertsRowModel.appendTrait(StatusTrait, "status");
            tableModel.appendChild(alertsRowModel, "Overall");
            return tableModel;
        },
    })
], SiteAggregatorWidgets.prototype, "alertCountsTable", void 0);
__decorate([
    ModelRef({
        key: "alerts",
        binds: true,
        observes: true,
        createModel() {
            const widgetModel = new Model();
            const widgetTrait = new WidgetTrait();
            widgetTrait.title.setValue("ALERTS");
            widgetTrait.subtitle.setValue(this.owner.type);
            widgetModel.setTrait("widget", widgetTrait);
            this.owner.currentInfoTable.insertModel(widgetModel);
            this.owner.mostImpactedKpiTable.insertModel(widgetModel);
            this.owner.alertCountsTable.insertModel(widgetModel);
            return widgetModel;
        },
    })
], SiteAggregatorWidgets.prototype, "alertsWidget", void 0);
__decorate([
    ModelRef({
        key: "overallUsersImpactedGauge",
        createModel() {
            const gaugeModel = new Model();
            gaugeModel.appendTrait(GaugeTrait, "gauge")
                .title("Overall").limit(100);
            const usersImpactedDialModel = new Model();
            usersImpactedDialModel.appendTrait(DialTrait, "dial")
                .legend("Overall");
            usersImpactedDialModel.appendTrait(StatusTrait, "status");
            gaugeModel.setChild("users", usersImpactedDialModel);
            return gaugeModel;
        },
    })
], SiteAggregatorWidgets.prototype, "overallUsersImpactedGauge", void 0);
__decorate([
    ModelRef({
        key: "usersImpacted",
        binds: true,
        observes: true,
        createModel() {
            const widgetModel = new Model();
            const widgetTrait = new WidgetTrait();
            widgetTrait.title.setValue("IMPACTED USERS");
            widgetTrait.subtitle.setValue(this.owner.type);
            widgetModel.setTrait("widget", widgetTrait);
            this.owner.overallUsersImpactedGauge.insertModel(widgetModel);
            return widgetModel;
        },
    })
], SiteAggregatorWidgets.prototype, "usersImpactedWidget", void 0);
__decorate([
    ModelRef({
        key: "kpiBreakdown",
        binds: true,
        observes: true,
        createModel() {
            const widgetModel = new Model();
            const widgetTrait = new WidgetTrait();
            widgetTrait.title.setValue("KPIs DRIVING DEGRADATION");
            widgetTrait.subtitle.setValue(this.owner.type);
            widgetModel.setTrait("widget", widgetTrait);
            return widgetModel;
        },
    })
], SiteAggregatorWidgets.prototype, "kpiBreakdownWidget", void 0);
__decorate([
    ModelRef({
        key: "worstOverallDegradationTable",
        createModel() {
            const tableModel = new Model();
            tableModel.appendTrait(TableTrait, "table")
                .colSpacing(12);
            tableModel.appendTrait(ColTrait, "key")
                .layout({ key: "key", grow: 1, textColor: Look.accentColor });
            tableModel.appendTrait(ColTrait, "value")
                .layout({ key: "value", grow: 1, textColor: Look.accentColor });
            const worstSiteRowModel = new Model();
            worstSiteRowModel.appendTrait(RowTrait, "row");
            worstSiteRowModel.appendTrait(TextCellTrait, "key")
                .content("Overall");
            worstSiteRowModel.appendTrait(TextCellTrait, "value")
                .content("Continuous Degradation");
            tableModel.appendChild(worstSiteRowModel, "header");
            for (let i = 0; i < 5; i++) {
                const worstSiteRowModel = new Model();
                worstSiteRowModel.appendTrait(RowTrait, "row");
                worstSiteRowModel.appendTrait(TextCellTrait, "key")
                    .content("-");
                worstSiteRowModel.appendTrait(TextCellTrait, "value")
                    .content("-");
                worstSiteRowModel.appendTrait(StatusTrait, "status").setStatusFactor("status", StatusFactor.create("status", StatusVector.of([Status.warning, 2], [Status.alert, 0.5])));
                tableModel.appendChild(worstSiteRowModel, i + "");
            }
            return tableModel;
        },
    })
], SiteAggregatorWidgets.prototype, "worstOverallDegradationTable", void 0);
__decorate([
    ModelRef({
        key: "worstSites",
        binds: true,
        observes: true,
        createModel() {
            const widgetModel = new Model();
            const widgetTrait = new WidgetTrait();
            widgetTrait.title.setValue("WORST SITES");
            widgetTrait.subtitle.setValue(this.owner.type);
            widgetModel.setTrait("widget", widgetTrait);
            this.owner.worstOverallDegradationTable.insertModel(widgetModel);
            return widgetModel;
        },
    })
], SiteAggregatorWidgets.prototype, "worstSitesWidget", void 0);
__decorate([
    ModelRef({
        key: "missingDataTable",
        createModel() {
            const tableModel = new Model();
            tableModel.appendTrait(TableTrait, "table")
                .colSpacing(12);
            tableModel.appendTrait(ColTrait, "value1")
                .layout({ key: "value1", grow: 1, textColor: Look.accentColor });
            tableModel.appendTrait(ColTrait, "value2")
                .layout({ key: "value2", grow: 1, textColor: Look.accentColor });
            return tableModel;
        },
    })
], SiteAggregatorWidgets.prototype, "missingDataTable", void 0);
__decorate([
    ModelRef({
        key: "missingData",
        binds: true,
        observes: true,
        createModel() {
            const widgetModel = new Model();
            const widgetTrait = new WidgetTrait();
            widgetTrait.title.setValue("OUTAGE INFO");
            widgetTrait.subtitle.setValue(this.owner.type);
            widgetModel.setTrait("widget", widgetTrait);
            this.owner.missingDataTable.insertModel(widgetModel);
            return widgetModel;
        },
    })
], SiteAggregatorWidgets.prototype, "missingDataWidget", void 0);
__decorate([
    ValueDownlinkFastener({
        nodeUri() {
            return this.owner.entity.trait.uri;
        },
        laneUri: "info",
        didSet(newValue) {
            this.owner.updateInfoTable(newValue);
        },
    })
], SiteAggregatorWidgets.prototype, "infoDownlink", void 0);
__decorate([
    ValueDownlinkFastener({
        nodeUri() {
            return this.owner.entity.trait.uri;
        },
        laneUri: "status",
        didSet(newValue, oldValue) {
            this.owner.updateStatusTable(newValue);
            this.owner.updateCurrentInfoTable(newValue);
            this.owner.updateMostImpactedKpiTable(newValue);
            this.owner.updateAlertCountsTable(newValue);
            this.owner.updateOverallUsersImpactedGauge(newValue);
            this.owner.updateAlertHistoryCharts(newValue, oldValue);
        },
    })
], SiteAggregatorWidgets.prototype, "statusDownlink", void 0);
__decorate([
    MapDownlinkFastener({
        nodeUri() {
            return this.owner.entity.trait.uri;
        },
        laneUri: "alertHistory",
        didSync() {
            this.owner.didSyncAlertHistory();
        }
    })
], SiteAggregatorWidgets.prototype, "alertHistoryDownlink", void 0);
__decorate([
    MapDownlinkFastener({
        nodeUri() {
            return this.owner.entity.trait.uri;
        },
        laneUri: "worstSites",
        didUpdate(key, newValue, oldValue) {
            this.owner.updateWorstOverallDegradationTable(key, newValue, oldValue);
        },
    })
], SiteAggregatorWidgets.prototype, "worstOverallDegradationDownlink", void 0);
__decorate([
    ValueDownlinkFastener({
        nodeUri() {
            return this.owner.entity.trait.uri;
        },
        laneUri: "missingData",
        didSet(newValue, oldValue) {
            this.owner.updateMissingDataTable(newValue, oldValue);
        },
    })
], SiteAggregatorWidgets.prototype, "missingDataDownlink", void 0);
__decorate([
    TraitRef({
        type: SelectableTrait,
        binds: true,
        observes: true,
        traitDidSelect() {
            this.owner.statusWidget.insertModel();
            this.owner.infoWidget.insertModel();
            this.owner.alertsWidget.insertModel();
            this.owner.usersImpactedWidget.insertModel();
            this.owner.kpiBreakdownWidget.insertModel();
            this.owner.worstSitesWidget.insertModel();
            this.owner.missingDataWidget.insertModel();
            this.owner.infoDownlink.consume(this.owner);
            this.owner.statusDownlink.consume(this.owner);
            this.owner.alertHistoryDownlink.consume(this.owner);
            this.owner.worstOverallDegradationDownlink.consume(this.owner);
            this.owner.missingDataDownlink.consume(this.owner);
        },
        traitWillUnselect() {
            this.owner.statusDownlink.unconsume(this.owner);
            this.owner.alertHistoryDownlink.unconsume(this.owner);
            this.owner.worstOverallDegradationDownlink.unconsume(this.owner);
            this.owner.missingDataDownlink.unconsume(this.owner);
            this.owner.infoDownlink.unconsume(this.owner);
            this.owner.statusWidget.deleteModel();
            this.owner.statusTable.deleteModel();
            this.owner.infoWidget.deleteModel();
            this.owner.infoTable.deleteModel();
            this.owner.alertsWidget.deleteModel();
            this.owner.currentInfoTable.deleteModel();
            this.owner.mostImpactedKpiTable.deleteModel();
            this.owner.alertCountsTable.deleteModel();
            this.owner.usersImpactedWidget.deleteModel();
            this.owner.overallUsersImpactedGauge.deleteModel();
            this.owner.kpiBreakdownWidget.deleteModel();
            this.owner.worstSitesWidget.deleteModel();
            this.owner.worstOverallDegradationTable.deleteModel();
            this.owner.missingDataWidget.deleteModel();
            this.owner.missingDataTable.deleteModel();
        },
        detectTrait(trait) {
            return trait instanceof SelectableTrait ? trait : null;
        },
    })
], SiteAggregatorWidgets.prototype, "selectable", void 0);
__decorate([
    TraitRef({
        type: EntityTrait,
        binds: true,
        detectTrait(trait) {
            return trait instanceof EntityTrait ? trait : null;
        },
    })
], SiteAggregatorWidgets.prototype, "entity", void 0);
//# sourceMappingURL=SiteAggregatorWidgets.js.map