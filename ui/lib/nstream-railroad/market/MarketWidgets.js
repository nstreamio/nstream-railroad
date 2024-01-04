import { __decorate } from "tslib";
import { DateTime, Value, MapDownlinkFastener, TimeZone, ValueDownlinkFastener } from "@swim/runtime";
import { BottomAxisTrait, ChartTrait, ColTrait, DataPointTrait, DataSetTrait, DialTrait, Feel, GraphTrait, LinePlotTrait, Look, GaugeTrait, Model, ModelRef, MoodVector, RowTrait, SelectableTrait, TableTrait, TextCellTrait, Theme, TraitRef } from "@swim/toolkit";
import { EntityTrait, Status, StatusFactor, StatusTrait, StatusVector, WidgetGroup, WidgetTrait } from "@swim/platform";
const ALERT_NAMES = ["Overall", "ENDC_Drop", "ENDC_Setup_Failure", "Peak_UE", "DL_Volume", "UL_Volume", "DL_UE_Throughput"];
const SCORE_ALERT_THRESHOLD = 0.3;
const SCORE_WARNING_THRESHOLD = 0.4;
export class MarketWidgets extends WidgetGroup {
    // Alerts Widget
    // -- Current Info Table (Timestamp)
    updateCurrentInfoTable(value) {
        const tableModel = this.currentInfoTable.model;
        const time = new DateTime(value.get("most_recent_timestamp").numberValue(0) * 1000, TimeZone.forOffset(-480));
        const currentHourRowModel = tableModel === null || tableModel === void 0 ? void 0 : tableModel.getChild("hour");
        currentHourRowModel.getTrait("value", TextCellTrait)
            .content(time.hour + ":00 - " + (time.month + 1) + "/" + time.day + "/" + time.year);
        const dataCountRowModel = tableModel === null || tableModel === void 0 ? void 0 : tableModel.getChild("count");
        dataCountRowModel.getTrait("value", TextCellTrait)
            .content(value.get("Current_Site_Stats").get("Count").stringValue(""));
    }
    // -- Most Impacted KPI 
    updateMostImpactedKpiTable(value) {
        const tableModel = this.mostImpactedKpiTable.model;
        const kpiRowModel = tableModel.getChild("mostImpactedKpi");
        kpiRowModel.getTrait("value", TextCellTrait)
            .content(value.get("Most_Impacted_KPI").stringValue(""));
    }
    // -- Alert Counts
    updateAlertCountsTable(value) {
        const tableModel = this.alertCountsTable.model;
        for (let i = 0; i < ALERT_NAMES.length; i++) {
            const alertsRowModel = tableModel.getChild(ALERT_NAMES[i]);
            const currentAlertCount = value.get("Current_Site_Stats").get(ALERT_NAMES[i]).get("Alert_Count").numberValue(0);
            const previousAlertCount = value.get("prev_30_day_max_alert_count").get(ALERT_NAMES[i]).numberValue(0);
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
    }
    // Alert History Charts
    updateAlertHistoryCharts(newStatus, oldStatus) {
        if (newStatus.equals(oldStatus))
            return;
        const timestamp = newStatus.get("most_recent_timestamp").numberValue(void 0);
        if (timestamp === void 0)
            return;
        // New Hour
        if (timestamp !== oldStatus.get("most_recent_timestamp").numberValue(void 0)) {
            this.removeAllAlertHistoryCharts();
        }
        // For each alert...
        newStatus.get("Alerts").forEach((item) => {
            var _a, _b, _c;
            const alertName = item.stringValue("");
            if ("" !== alertName) {
                // If it is a new alert, create a graph
                if (((_a = this.alertsWidget.model) === null || _a === void 0 ? void 0 : _a.getChild(alertName)) === null) {
                    (_b = this.alertsWidget.model) === null || _b === void 0 ? void 0 : _b.appendChild(this.createAlertHistoryChartTitle(alertName), alertName);
                    (_c = this.alertsWidget.model) === null || _c === void 0 ? void 0 : _c.appendChild(this.createAlertHistoryChart(alertName, timestamp, newStatus.get("prev_30_day_max_alert_count").get(alertName).numberValue(0)), alertName + "_chart");
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
                if (i === 0) {
                    dataPointTrait.color.
                        setValue(Theme.dark.get(Look.accentColor, MoodVector.of([Feel.primary, 1], [Feel.warning, 2], [Feel.alert, 1.5])));
                }
                else if (alertCount >= previousMax) {
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
        const alertCountPlot = (_b = (_a = this.alertsWidget.model) === null || _a === void 0 ? void 0 : _a.getChild(alertName + "_chart")) === null || _b === void 0 ? void 0 : _b.getChild("alertCount");
        const alertCountDataPointModel = new Model();
        const dataPointTrait = alertCountDataPointModel
            .appendTrait(new DataPointTrait(new DateTime(timestamp * 1000, TimeZone.forOffset(-480)), alertCount), "dataPoint");
        dataPointTrait.color.
            setValue(Theme.dark.get(Look.accentColor, MoodVector.of([Feel.primary, 1], [Feel.warning, 2], [Feel.alert, 1.5])));
        alertCountPlot.removeChild("" + timestamp);
        alertCountPlot.appendChild(alertCountDataPointModel, "" + timestamp);
    }
    removeAllAlertHistoryCharts() {
        ALERT_NAMES.forEach((alertName) => {
            var _a, _b;
            (_a = this.alertsWidget.model) === null || _a === void 0 ? void 0 : _a.removeChild(alertName);
            (_b = this.alertsWidget.model) === null || _b === void 0 ? void 0 : _b.removeChild(alertName + "_chart");
        });
    }
    // We need this for initial load of the widget 
    didSyncAlertHistory() {
        this.removeAllAlertHistoryCharts();
        this.updateAlertHistoryCharts(this.statusDownlink.get(), Value.absent());
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
    // -- Users Impacted Breakdown
    updateUsersImpactedBreakdown(value) {
        const tableModel = this.usersImpactedBreakdown.model;
        const totalUserCount = value.get("Current_Site_Stats").get("User_Count").numberValue(void 0);
        for (let i = 0; i < ALERT_NAMES.length; i++) {
            const impactedUserCount = value.get("Current_Site_Stats").get(ALERT_NAMES[i]).get("Alert_User_Count").numberValue(0);
            const impactedUsersPercent = (impactedUserCount / totalUserCount) * 100;
            const usersImpactedRowModel = tableModel.getChild(ALERT_NAMES[i]);
            usersImpactedRowModel.getTrait("count", TextCellTrait)
                .content(totalUserCount === void 0 ? "N/A" : impactedUserCount + "");
            usersImpactedRowModel.getTrait("percent", TextCellTrait)
                .content(totalUserCount === void 0 ? "N/A" : Math.round(impactedUsersPercent) + "%");
            usersImpactedRowModel.getTrait(StatusTrait).setStatusFactor("user", totalUserCount === void 0 ? null :
                StatusFactor.create("User", StatusVector.of([Status.warning, Math.min(2, impactedUsersPercent / 5)], [Status.alert, Math.min(1, (Math.max(0, impactedUsersPercent - 10) / 15))])));
        }
    }
    // Worst Offenders
    // -- Table
    updateWorstOffendersTable(value) {
        var _a, _b, _c, _d, _e, _f;
        const tableModel = this.worstOffendersBreakdown.model;
        for (let i = 0; i < ALERT_NAMES.length; i++) {
            const longestDegradationRowModel = tableModel.getChild(ALERT_NAMES[i] + "__ld");
            const longestDegradation = value.get(ALERT_NAMES[i]).get("Longest_Continuous_Degradation").get("Continuous_Degradation").numberValue(0);
            (_a = longestDegradationRowModel === null || longestDegradationRowModel === void 0 ? void 0 : longestDegradationRowModel.getTrait("key", TextCellTrait)) === null || _a === void 0 ? void 0 : _a.content(value.get(ALERT_NAMES[i]).get("Longest_Continuous_Degradation").get("Site").stringValue(""));
            (_b = longestDegradationRowModel === null || longestDegradationRowModel === void 0 ? void 0 : longestDegradationRowModel.getTrait("value", TextCellTrait)) === null || _b === void 0 ? void 0 : _b.content(longestDegradation + " hours");
            (_c = longestDegradationRowModel === null || longestDegradationRowModel === void 0 ? void 0 : longestDegradationRowModel.getTrait(StatusTrait)) === null || _c === void 0 ? void 0 : _c.setStatusFactor("longestDegradation", StatusFactor.create("longestDegradation", StatusVector.of([Status.warning, Math.min(2, longestDegradation / 5)], [Status.alert, Math.min(1, longestDegradation / 10)])));
            const alertPercentRowModel = tableModel.getChild(ALERT_NAMES[i] + "__wap");
            const alertPercent = value.get(ALERT_NAMES[i]).get("Highest_30_Day_Alert_Percent").get("Alert_Percent").numberValue(0.0);
            (_d = alertPercentRowModel === null || alertPercentRowModel === void 0 ? void 0 : alertPercentRowModel.getTrait("key", TextCellTrait)) === null || _d === void 0 ? void 0 : _d.content(value.get(ALERT_NAMES[i]).get("Highest_30_Day_Alert_Percent").get("Site").stringValue(""));
            (_e = alertPercentRowModel === null || alertPercentRowModel === void 0 ? void 0 : alertPercentRowModel.getTrait("value", TextCellTrait)) === null || _e === void 0 ? void 0 : _e.content(Math.round(alertPercent * 100) + "%");
            (_f = alertPercentRowModel === null || alertPercentRowModel === void 0 ? void 0 : alertPercentRowModel.getTrait(StatusTrait)) === null || _f === void 0 ? void 0 : _f.setStatusFactor("alertPercent", StatusFactor.create("alertPercent", StatusVector.of([Status.warning, alertPercent * 2], [Status.alert, alertPercent])));
        }
    }
    // Score Widget
    // -- Score Gauge
    updateOverallScoreGauge(value) {
        const gaugeModel = this.overallScoreGauge.model;
        const count = value.get("Current_Site_Stats").get("Count").numberValue(void 0);
        const score = value.get("Current_Site_Stats").get("Overall").get("Total_Score").numberValue(0);
        const averageScore = score / count;
        gaugeModel.getTrait(GaugeTrait).title(count === void 0 ? "N/A" : Math.round(averageScore * 100) + "%");
        const scoreDialModel = gaugeModel.getChild("score");
        scoreDialModel.getTrait(DialTrait)
            .value(Math.round(count === void 0 ? 0 : averageScore * 100));
        scoreDialModel.getTrait(StatusTrait).setStatusFactor("score", count === void 0 ? null : this.getStatusFactorFromScore(averageScore));
    }
    // -- Score Breakdown
    updateScoreBreakdown(value) {
        const tableModel = this.scoreBreakdown.model;
        for (let i = 0; i < ALERT_NAMES.length; i++) {
            const count = value.get("Current_Site_Stats").get("Count").numberValue(void 0);
            const score = value.get("Current_Site_Stats").get(ALERT_NAMES[i]).get("Total_Score").numberValue(0);
            const averageScore = score / count;
            const scoreRowModel = tableModel.getChild(ALERT_NAMES[i]);
            scoreRowModel.getTrait("value", TextCellTrait)
                .content(count === void 0 ? "N/A" : Math.round(averageScore * 100) + "%");
            scoreRowModel.getTrait(StatusTrait).setStatusFactor("score", count === void 0 ? null : this.getStatusFactorFromScore(averageScore));
        }
    }
    getStatusFactorFromScore(score) {
        if (score > SCORE_WARNING_THRESHOLD)
            return null;
        if (score > SCORE_ALERT_THRESHOLD)
            return StatusFactor.create("Score", StatusVector.of([Status.warning, 1]));
        return StatusFactor.create("Score", StatusVector.of([Status.warning, 2], [Status.alert, 1 - (score / SCORE_ALERT_THRESHOLD)]));
    }
    // Info Widget
    updateInfoTable(value) {
        const tableModel = this.infoTable.model;
        const userCountRowModel = tableModel.getChild("users");
        userCountRowModel.getTrait("value", TextCellTrait)
            .content(value.get("user_count").stringValue(""));
        const cmaNameRowModel = tableModel.getChild("name");
        cmaNameRowModel.getTrait("value", TextCellTrait)
            .content(value.get("name").stringValue(""));
        const cmaSiteRowCount = tableModel.getChild("siteCount");
        cmaSiteRowCount.getTrait("value", TextCellTrait)
            .content(value.get("site_count").stringValue(""));
    }
}
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
                .content("Current Hour Score Count");
            dataCountRowModel.appendTrait(TextCellTrait, "value");
            tableModel.appendChild(dataCountRowModel, "count");
            const paddingRowModel = new Model();
            paddingRowModel.appendTrait(RowTrait, "row");
            paddingRowModel.appendTrait(TextCellTrait, "value");
            tableModel.appendChild(paddingRowModel, "pad1");
            return tableModel;
        },
    })
], MarketWidgets.prototype, "currentInfoTable", void 0);
__decorate([
    ModelRef({
        key: "mostImpactedKpiTable",
        createModel() {
            const tableModel = new Model();
            tableModel.appendTrait(TableTrait, "table")
                .colSpacing(12);
            tableModel.appendTrait(ColTrait, "value")
                .layout({ key: "value", grow: 1, textColor: Look.accentColor });
            const titleRowModel = new Model();
            titleRowModel.appendTrait(RowTrait, "row");
            titleRowModel.appendTrait(TextCellTrait, "value")
                .content("Most Impacted KPI");
            tableModel.appendChild(titleRowModel, "title");
            const kpiRowModel = new Model();
            kpiRowModel.appendTrait(RowTrait, "row");
            kpiRowModel.appendTrait(TextCellTrait, "value");
            kpiRowModel.appendTrait(StatusTrait, "status")
                .setStatusFactor("status", StatusFactor.create("status", StatusVector.of([Status.warning, 2], [Status.alert, 0.5])));
            tableModel.appendChild(kpiRowModel, "mostImpactedKpi");
            const paddingRowModel = new Model();
            paddingRowModel.appendTrait(RowTrait, "row");
            paddingRowModel.appendTrait(TextCellTrait, "value");
            tableModel.appendChild(paddingRowModel, "pad1");
            return tableModel;
        },
    })
], MarketWidgets.prototype, "mostImpactedKpiTable", void 0);
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
                .content("Now");
            titleRowModel.appendTrait(TextCellTrait, "previous")
                .content("Prev 30 Day Max");
            tableModel.appendChild(titleRowModel, "title");
            for (let i = 0; i < ALERT_NAMES.length; i++) {
                const alertsRowModel = new Model();
                alertsRowModel.appendTrait(RowTrait, "row");
                alertsRowModel.appendTrait(TextCellTrait, "key")
                    .content(ALERT_NAMES[i]);
                alertsRowModel.appendTrait(TextCellTrait, "current");
                alertsRowModel.appendTrait(TextCellTrait, "previous");
                alertsRowModel.appendTrait(StatusTrait, "status");
                tableModel.appendChild(alertsRowModel, ALERT_NAMES[i]);
            }
            const paddingRowModel = new Model();
            paddingRowModel.appendTrait(RowTrait, "row");
            paddingRowModel.appendTrait(TextCellTrait, "value");
            tableModel.appendChild(paddingRowModel, "pad1");
            return tableModel;
        },
    })
], MarketWidgets.prototype, "alertCountsTable", void 0);
__decorate([
    ModelRef({
        key: "alerts",
        binds: true,
        observes: true,
        createModel() {
            const widgetModel = new Model();
            const widgetTrait = new WidgetTrait();
            widgetTrait.title.setValue("ALERTS");
            widgetTrait.subtitle.setValue("MARKET");
            widgetModel.setTrait("widget", widgetTrait);
            this.owner.currentInfoTable.insertModel(widgetModel);
            this.owner.mostImpactedKpiTable.insertModel(widgetModel);
            this.owner.alertCountsTable.insertModel(widgetModel);
            return widgetModel;
        },
    })
], MarketWidgets.prototype, "alertsWidget", void 0);
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
], MarketWidgets.prototype, "overallUsersImpactedGauge", void 0);
__decorate([
    ModelRef({
        key: "usersImpactedBreakdown",
        createModel() {
            const tableModel = new Model();
            tableModel.appendTrait(TableTrait, "table")
                .colSpacing(12);
            tableModel.appendTrait(ColTrait, "key")
                .layout({ key: "key", grow: 3, textColor: Look.mutedColor });
            tableModel.appendTrait(ColTrait, "count")
                .layout({ key: "count", grow: 2, textColor: Look.accentColor });
            tableModel.appendTrait(ColTrait, "percent")
                .layout({ key: "percent", grow: 1, textColor: Look.accentColor });
            for (let i = 0; i < ALERT_NAMES.length; i++) {
                const rankRowModel = new Model();
                rankRowModel.appendTrait(RowTrait, "row");
                rankRowModel.appendTrait(TextCellTrait, "key")
                    .content(ALERT_NAMES[i]);
                rankRowModel.appendTrait(TextCellTrait, "count");
                rankRowModel.appendTrait(TextCellTrait, "percent");
                rankRowModel.appendTrait(StatusTrait, "status");
                tableModel.appendChild(rankRowModel, ALERT_NAMES[i]);
            }
            return tableModel;
        },
    })
], MarketWidgets.prototype, "usersImpactedBreakdown", void 0);
__decorate([
    ModelRef({
        key: "usersImpacted",
        binds: true,
        observes: true,
        createModel() {
            const widgetModel = new Model();
            const widgetTrait = new WidgetTrait();
            widgetTrait.title.setValue("IMPACTED USERS");
            widgetTrait.subtitle.setValue("MARKET");
            widgetModel.setTrait("widget", widgetTrait);
            this.owner.overallUsersImpactedGauge.insertModel(widgetModel);
            this.owner.usersImpactedBreakdown.insertModel(widgetModel);
            return widgetModel;
        },
    })
], MarketWidgets.prototype, "usersImpactedWidget", void 0);
__decorate([
    ModelRef({
        key: "worstOffendersBreakdown",
        createModel() {
            const tableModel = new Model();
            tableModel.appendTrait(TableTrait, "table")
                .colSpacing(12);
            tableModel.appendTrait(ColTrait, "key")
                .layout({ key: "key", grow: 3, textColor: Look.accentColor });
            tableModel.appendTrait(ColTrait, "value")
                .layout({ key: "value", grow: 2, textColor: Look.accentColor });
            for (let i = 0; i < ALERT_NAMES.length; i++) {
                const alertTypeRowModel = new Model();
                alertTypeRowModel.appendTrait(RowTrait, "row");
                alertTypeRowModel.appendTrait(TextCellTrait, "key")
                    .content(ALERT_NAMES[i]);
                alertTypeRowModel.appendTrait(TextCellTrait, "value");
                tableModel.appendChild(alertTypeRowModel, ALERT_NAMES[i]);
                const longestDegradationTitleRowModel = new Model();
                longestDegradationTitleRowModel.appendTrait(RowTrait, "row");
                longestDegradationTitleRowModel.appendTrait(TextCellTrait, "key")
                    .content("Longest Degradation");
                longestDegradationTitleRowModel.appendTrait(TextCellTrait, "value");
                tableModel.appendChild(longestDegradationTitleRowModel, ALERT_NAMES[i] + "_longestDegradationTitle");
                const longestDegradationRowModel = new Model();
                longestDegradationRowModel.appendTrait(RowTrait, "row");
                longestDegradationRowModel.appendTrait(TextCellTrait, "key");
                longestDegradationRowModel.appendTrait(TextCellTrait, "value");
                longestDegradationRowModel.appendTrait(StatusTrait, "status");
                tableModel.appendChild(longestDegradationRowModel, ALERT_NAMES[i] + "__ld");
                const worstAlertPercentTitleRowModel = new Model();
                worstAlertPercentTitleRowModel.appendTrait(RowTrait, "row");
                worstAlertPercentTitleRowModel.appendTrait(TextCellTrait, "key")
                    .content("Highest Alert Percent");
                worstAlertPercentTitleRowModel.appendTrait(TextCellTrait, "value");
                tableModel.appendChild(worstAlertPercentTitleRowModel, ALERT_NAMES[i] + "_worstAlertPercentTitle");
                const worstAlertPercentRowModel = new Model();
                worstAlertPercentRowModel.appendTrait(RowTrait, "row");
                worstAlertPercentRowModel.appendTrait(TextCellTrait, "key");
                worstAlertPercentRowModel.appendTrait(TextCellTrait, "value");
                worstAlertPercentRowModel.appendTrait(StatusTrait, "status");
                tableModel.appendChild(worstAlertPercentRowModel, ALERT_NAMES[i] + "__wap");
                const paddingRowModel = new Model();
                paddingRowModel.appendTrait(RowTrait, "row");
                paddingRowModel.appendTrait(TextCellTrait, "key");
                paddingRowModel.appendTrait(TextCellTrait, "value");
                tableModel.appendChild(paddingRowModel, ALERT_NAMES[i] + "_paddingRow");
            }
            return tableModel;
        },
    })
], MarketWidgets.prototype, "worstOffendersBreakdown", void 0);
__decorate([
    ModelRef({
        key: "worstOffenders",
        binds: true,
        observes: true,
        createModel() {
            const widgetModel = new Model();
            const widgetTrait = new WidgetTrait();
            widgetTrait.title.setValue("WORST SITES");
            widgetTrait.subtitle.setValue("MARKET");
            widgetModel.setTrait("widget", widgetTrait);
            this.owner.worstOffendersBreakdown.insertModel(widgetModel);
            return widgetModel;
        },
    })
], MarketWidgets.prototype, "worstOffendersWidget", void 0);
__decorate([
    ModelRef({
        key: "overallScoreGauge",
        createModel() {
            const gaugeModel = new Model();
            gaugeModel.appendTrait(GaugeTrait, "gauge")
                .title("Overall").limit(100);
            const scoreDialModel = new Model();
            scoreDialModel.appendTrait(DialTrait, "dial")
                .legend("Overall Score");
            scoreDialModel.appendTrait(StatusTrait, "status");
            gaugeModel.setChild("score", scoreDialModel);
            return gaugeModel;
        },
    })
], MarketWidgets.prototype, "overallScoreGauge", void 0);
__decorate([
    ModelRef({
        key: "scoreBreakdown",
        createModel() {
            const tableModel = new Model();
            tableModel.appendTrait(TableTrait, "table")
                .colSpacing(12);
            tableModel.appendTrait(ColTrait, "key")
                .layout({ key: "key", grow: 3, textColor: Look.mutedColor });
            tableModel.appendTrait(ColTrait, "value")
                .layout({ key: "value", grow: 1, textColor: Look.accentColor });
            for (let i = 0; i < ALERT_NAMES.length; i++) {
                const scoreRowModel = new Model();
                scoreRowModel.appendTrait(RowTrait, "row");
                scoreRowModel.appendTrait(TextCellTrait, "key")
                    .content(ALERT_NAMES[i]);
                scoreRowModel.appendTrait(TextCellTrait, "value");
                scoreRowModel.appendTrait(StatusTrait, "status");
                tableModel.appendChild(scoreRowModel, ALERT_NAMES[i]);
            }
            return tableModel;
        },
    })
], MarketWidgets.prototype, "scoreBreakdown", void 0);
__decorate([
    ModelRef({
        key: "score",
        binds: true,
        observes: true,
        createModel() {
            const widgetModel = new Model();
            const widgetTrait = new WidgetTrait();
            widgetTrait.title.setValue("SCORES");
            widgetTrait.subtitle.setValue("MARKET");
            widgetModel.setTrait("widget", widgetTrait);
            this.owner.overallScoreGauge.insertModel(widgetModel);
            this.owner.scoreBreakdown.insertModel(widgetModel);
            return widgetModel;
        },
    })
], MarketWidgets.prototype, "scoreWidget", void 0);
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
            const cmaNameRowModel = new Model();
            cmaNameRowModel.appendTrait(RowTrait, "row");
            cmaNameRowModel.appendTrait(TextCellTrait, "key")
                .content("Name");
            cmaNameRowModel.appendTrait(TextCellTrait, "value");
            tableModel.appendChild(cmaNameRowModel, "name");
            const cmaSiteRowCount = new Model();
            cmaSiteRowCount.appendTrait(RowTrait, "row");
            cmaSiteRowCount.appendTrait(TextCellTrait, "key")
                .content("Site Count");
            cmaSiteRowCount.appendTrait(TextCellTrait, "value");
            tableModel.appendChild(cmaSiteRowCount, "siteCount");
            return tableModel;
        },
    })
], MarketWidgets.prototype, "infoTable", void 0);
__decorate([
    ModelRef({
        key: "info",
        binds: true,
        observes: true,
        createModel() {
            const widgetModel = new Model();
            const widgetTrait = new WidgetTrait();
            widgetTrait.title.setValue("INFO");
            widgetTrait.subtitle.setValue("MARKET");
            widgetModel.setTrait("widget", widgetTrait);
            this.owner.infoTable.insertModel(widgetModel);
            return widgetModel;
        },
    })
], MarketWidgets.prototype, "infoWidget", void 0);
__decorate([
    ValueDownlinkFastener({
        nodeUri() {
            return this.owner.entity.trait.uri;
        },
        laneUri: "status",
        didSet(newValue, oldValue) {
            this.owner.updateCurrentInfoTable(newValue);
            this.owner.updateMostImpactedKpiTable(newValue);
            this.owner.updateAlertCountsTable(newValue);
            this.owner.updateAlertHistoryCharts(newValue, oldValue);
            this.owner.updateOverallUsersImpactedGauge(newValue);
            this.owner.updateUsersImpactedBreakdown(newValue);
            this.owner.updateOverallScoreGauge(newValue);
            this.owner.updateScoreBreakdown(newValue);
        },
    })
], MarketWidgets.prototype, "statusDownlink", void 0);
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
], MarketWidgets.prototype, "alertHistoryDownlink", void 0);
__decorate([
    ValueDownlinkFastener({
        nodeUri() {
            return this.owner.entity.trait.uri;
        },
        laneUri: "poorPerformers",
        didSet(newValue) {
            this.owner.updateWorstOffendersTable(newValue);
        },
    })
], MarketWidgets.prototype, "poorPerformersDownlink", void 0);
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
], MarketWidgets.prototype, "infoDownlink", void 0);
__decorate([
    TraitRef({
        type: SelectableTrait,
        binds: true,
        observes: true,
        traitDidSelect() {
            this.owner.alertsWidget.insertModel();
            this.owner.usersImpactedWidget.insertModel();
            this.owner.worstOffendersWidget.insertModel();
            this.owner.scoreWidget.insertModel();
            this.owner.infoWidget.insertModel();
            this.owner.statusDownlink.consume(this.owner);
            this.owner.alertHistoryDownlink.consume(this.owner);
            this.owner.poorPerformersDownlink.consume(this.owner);
            this.owner.infoDownlink.consume(this.owner);
        },
        traitWillUnselect() {
            this.owner.statusDownlink.unconsume(this.owner);
            this.owner.infoDownlink.unconsume(this.owner);
            this.owner.poorPerformersDownlink.unconsume(this.owner);
            this.owner.alertHistoryDownlink.unconsume(this.owner);
            this.owner.alertsWidget.deleteModel();
            this.owner.currentInfoTable.deleteModel();
            this.owner.mostImpactedKpiTable.deleteModel();
            this.owner.alertCountsTable.deleteModel();
            this.owner.usersImpactedWidget.deleteModel();
            this.owner.overallUsersImpactedGauge.deleteModel();
            this.owner.usersImpactedBreakdown.deleteModel();
            this.owner.worstOffendersWidget.deleteModel();
            this.owner.worstOffendersBreakdown.deleteModel();
            this.owner.scoreWidget.deleteModel();
            this.owner.overallScoreGauge.deleteModel();
            this.owner.scoreBreakdown.deleteModel();
            this.owner.infoWidget.deleteModel();
            this.owner.infoTable.deleteModel();
        },
        detectTrait(trait) {
            return trait instanceof SelectableTrait ? trait : null;
        },
    })
], MarketWidgets.prototype, "selectable", void 0);
__decorate([
    TraitRef({
        type: EntityTrait,
        binds: true,
        detectTrait(trait) {
            return trait instanceof EntityTrait ? trait : null;
        },
    })
], MarketWidgets.prototype, "entity", void 0);
//# sourceMappingURL=MarketWidgets.js.map