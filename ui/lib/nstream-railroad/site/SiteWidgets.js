import { __decorate } from "tslib";
import { DateTime, MapDownlinkFastener, TimeZone, Value, ValueDownlinkFastener } from "@swim/runtime";
import { BottomAxisTrait, ChartTrait, ColTrait, DataPointTrait, DataSetTrait, DialTrait, Feel, GaugeTrait, GraphTrait, LinePlotTrait, Look, Model, ModelRef, MoodVector, RowTrait, SelectableTrait, TableTrait, TextCellTrait, Theme, TraitRef } from "@swim/toolkit";
import { EntityTrait, Status, StatusTrait, StatusFactor, StatusVector, WidgetGroup, WidgetTrait } from "@swim/platform";
const SCORE_NAMES = ["Overall_Score", "5GNR_ENDC_Drop_%_Score", "5GNR_ENDC_Setup_Failure_%_Score", "5GNR_Peak_numOf_UE_Score",
    "5GNR_DL_MAC_Volume_MB_Score", "5GNR_UL_MAC_Volume_MB_Score", "5GNR_DL_UE_MAC_Throughput_Mbps_19Q3_Score"];
const ALERT_NAMES = ["Overall", "ENDC_Drop", "ENDC_Setup_Failure", "Peak_UE", "DL_Volume", "UL_Volume", "DL_UE_Throughput"];
const STATUS_NAMES = ["GOOD", "OK", "BAD", "VERY BAD"];
const SCORE_ALERT_THRESHOLD = 0.3;
const SCORE_WARNING_THRESHOLD = 0.4;
export class SiteWidgets extends WidgetGroup {
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
        const gnbRowModel = tableModel.getChild("gnb");
        gnbRowModel.getTrait("value", TextCellTrait)
            .content(value.get("GNB").stringValue(""));
        const cmaRowModel = tableModel.getChild("cmaPea");
        cmaRowModel.getTrait("value", TextCellTrait)
            .content(value.get("CMA").stringValue("") + " / " + value.get("PEA").stringValue(""));
        const marketRowModel = tableModel.getChild("market");
        marketRowModel.getTrait("value", TextCellTrait)
            .content(value.get("MARKET").stringValue(""));
        const radioAccessTechRowModel = tableModel.getChild("rat");
        radioAccessTechRowModel.getTrait("value", TextCellTrait)
            .content(value.get("radio_access_technology").stringValue(""));
        const gnbVendorRowModel = tableModel.getChild("gnbVendor");
        gnbVendorRowModel.getTrait("value", TextCellTrait)
            .content(value.get("gnb_enb_vendor").stringValue(""));
        const envMorphologyRowModel = tableModel.getChild("envMorph");
        envMorphologyRowModel.getTrait("value", TextCellTrait)
            .content(value.get("environment_morphology").stringValue(""));
        const fregBandRowModel = tableModel.getChild("freqBand");
        fregBandRowModel.getTrait("value", TextCellTrait)
            .content(value.get("frequency_band").stringValue(""));
    }
    // Score Widget
    // -- Score Gauge
    updateOverallScoreGauge(value) {
        const gaugeModel = this.overallScoreGauge.model;
        const score = value.get("Overall_Score").numberValue(void 0);
        gaugeModel.getTrait(GaugeTrait).title(score === void 0 ? "N/A" : Math.round(score * 100) + "%");
        const scoreDialModel = gaugeModel.getChild("score");
        scoreDialModel.getTrait(DialTrait)
            .value(Math.round(score === void 0 ? 0 : score * 100));
        scoreDialModel.getTrait(StatusTrait).setStatusFactor("score", score === void 0 ? null : this.getStatusFactorFromScore(score));
    }
    // -- Score History
    updateScoreHistory(newStatus, oldStatus) {
        if (newStatus.equals(oldStatus))
            return;
        const timestamp = newStatus.get("score_timestamp").numberValue(void 0);
        if (timestamp === void 0)
            return;
        // New Hour
        if (timestamp !== oldStatus.get("score_timestamp").numberValue(void 0)) {
            this.repopulateScoreHistoryChart(timestamp, newStatus.get("Overall_Score").numberValue(void 0));
        }
    }
    repopulateScoreHistoryChart(timestamp, currentOverallScore) {
        var _a;
        const plotModel = (_a = this.overallScoreHistory.model) === null || _a === void 0 ? void 0 : _a.getChild("overallScore");
        plotModel === null || plotModel === void 0 ? void 0 : plotModel.removeChildren();
        for (let i = 0; i < 30; i++) {
            const historyTimestamp = timestamp - (i * 86400);
            const overallScore = i === 0 ? currentOverallScore : this.scoreHistoryDownlink.get(historyTimestamp).get("Overall_Score").numberValue(void 0);
            if (overallScore !== void 0) {
                const scoreDataPointModel = new Model();
                const dataPointTrait = scoreDataPointModel
                    .appendTrait(new DataPointTrait(new DateTime(historyTimestamp * 1000, TimeZone.forOffset(-480)), overallScore), "dataPoint");
                if (overallScore <= SCORE_ALERT_THRESHOLD) {
                    dataPointTrait.color.
                        setValue(Theme.dark.get(Look.accentColor, MoodVector.of([Feel.primary, 1], [Feel.warning, 2], [Feel.alert, 1.5])));
                }
                else if (overallScore <= SCORE_WARNING_THRESHOLD) {
                    dataPointTrait.color.
                        setValue(Theme.dark.get(Look.accentColor, MoodVector.of([Feel.primary, 1], [Feel.warning, 2])));
                }
                else {
                    dataPointTrait.color.
                        setValue(Theme.dark.get(Look.accentColor, MoodVector.of([Feel.primary, 1])));
                }
                plotModel === null || plotModel === void 0 ? void 0 : plotModel.appendChild(scoreDataPointModel, "" + historyTimestamp);
            }
        }
    }
    getStatusFactorFromScore(score) {
        if (score > SCORE_WARNING_THRESHOLD)
            return null;
        if (score > SCORE_ALERT_THRESHOLD)
            return StatusFactor.create("Score", StatusVector.of([Status.warning, 1]));
        return StatusFactor.create("Score", StatusVector.of([Status.warning, 2], [Status.alert, 1 - (score / SCORE_ALERT_THRESHOLD)]));
    }
    // KPI Breakdown Widget
    updateScoreHistoryCharts(newStatus, oldStatus) {
        if (newStatus.equals(oldStatus))
            return;
        const timestamp = newStatus.get("score_timestamp").numberValue(void 0);
        if (timestamp === void 0)
            return;
        if (timestamp === oldStatus.get("score_timestamp").numberValue(void 0)) {
            return;
        }
        // New hour
        this.removeAllScoreHistoryCharts();
        // For each alert...
        newStatus.get("Alerts").forEach((item) => {
            var _a, _b;
            const alertName = item.stringValue("");
            if ("" !== alertName) {
                // If it is a new alert, create a graph
                (_a = this.kpiBreakdownWidget.model) === null || _a === void 0 ? void 0 : _a.appendChild(this.createScoreHistoryTitle(alertName), alertName);
                (_b = this.kpiBreakdownWidget.model) === null || _b === void 0 ? void 0 : _b.appendChild(this.createScoreHistoryChart(SCORE_NAMES[ALERT_NAMES.indexOf(alertName)], timestamp), alertName + "_chart");
            }
        });
    }
    createScoreHistoryChart(scoreName, timestamp) {
        const chartModel = new Model();
        chartModel.appendTrait(ChartTrait, "chart");
        chartModel.appendTrait(GraphTrait, "graph");
        chartModel.appendTrait(BottomAxisTrait, "bottomAxis");
        const scorePlot = new Model();
        scorePlot.appendTrait(LinePlotTrait, "plot");
        scorePlot.appendTrait(DataSetTrait, "dataSet");
        scorePlot.appendTrait(StatusTrait, "status");
        chartModel.appendChild(scorePlot, "score");
        for (let i = 0; i < 30; i++) {
            const historyTimestamp = timestamp - (i * 86400);
            const score = this.scoreHistoryDownlink.get(historyTimestamp).get(scoreName).numberValue(void 0);
            if (score !== void 0) { // We have a previous day to plot
                const scoreDataPointModel = new Model();
                const dataPointTrait = scoreDataPointModel
                    .appendTrait(new DataPointTrait(new DateTime(historyTimestamp * 1000, TimeZone.forOffset(-480)), score), "dataPoint");
                if (score <= SCORE_ALERT_THRESHOLD) {
                    dataPointTrait.color.
                        setValue(Theme.dark.get(Look.accentColor, MoodVector.of([Feel.primary, 1], [Feel.warning, 2], [Feel.alert, 1.5])));
                }
                else if (score <= SCORE_WARNING_THRESHOLD) {
                    dataPointTrait.color.
                        setValue(Theme.dark.get(Look.accentColor, MoodVector.of([Feel.primary, 1], [Feel.warning, 2])));
                }
                else {
                    dataPointTrait.color.
                        setValue(Theme.dark.get(Look.accentColor, MoodVector.of([Feel.primary, 1])));
                }
                scorePlot.appendChild(scoreDataPointModel, "" + historyTimestamp);
            }
        }
        return chartModel;
    }
    createScoreHistoryTitle(alertName) {
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
    removeAllScoreHistoryCharts() {
        ALERT_NAMES.forEach((alertName) => {
            var _a, _b;
            (_a = this.kpiBreakdownWidget.model) === null || _a === void 0 ? void 0 : _a.removeChild(alertName);
            (_b = this.kpiBreakdownWidget.model) === null || _b === void 0 ? void 0 : _b.removeChild(alertName + "_chart");
        });
    }
    didSyncScoreHistory() {
        this.removeAllScoreHistoryCharts();
        this.updateScoreHistoryCharts(this.statusDownlink.get(), Value.absent());
    }
    // Missing Data Widget
    updateMissingDataTable(newValue, oldValue) {
        const tableModel = this.missingDataTable.model;
        const currentMissingTimestamps = newValue.get("missing_timestamps");
        if (currentMissingTimestamps.equals(oldValue.get("missing_timestamps")))
            return;
        tableModel.removeChildren();
        for (let i = 0; i < Math.min(5, currentMissingTimestamps.length); i++) {
            const missingTimestamp = currentMissingTimestamps.getItem(i);
            const time = new DateTime(missingTimestamp.numberValue(0) * 1000, TimeZone.forOffset(-480));
            const missingTimestampRowModel = new Model();
            missingTimestampRowModel.appendTrait(RowTrait, "row");
            missingTimestampRowModel.appendTrait(TextCellTrait, "value")
                .content(time.hour + ":00 - " + (time.month + 1) + "/" + time.day + "/" + time.year);
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
], SiteWidgets.prototype, "statusTable", void 0);
__decorate([
    ModelRef({
        key: "status",
        binds: true,
        observes: true,
        createModel() {
            const widgetModel = new Model();
            const widgetTrait = new WidgetTrait();
            widgetTrait.title.setValue("STATUS");
            widgetTrait.subtitle.setValue("SITE");
            widgetModel.setTrait("widget", widgetTrait);
            this.owner.statusTable.insertModel(widgetModel);
            return widgetModel;
        },
    })
], SiteWidgets.prototype, "statusWidget", void 0);
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
            const gnbRowModel = new Model();
            gnbRowModel.appendTrait(RowTrait, "row");
            gnbRowModel.appendTrait(TextCellTrait, "key")
                .content("GNB");
            gnbRowModel.appendTrait(TextCellTrait, "value");
            tableModel.appendChild(gnbRowModel, "gnb");
            const cmaRowModel = new Model();
            cmaRowModel.appendTrait(RowTrait, "row");
            cmaRowModel.appendTrait(TextCellTrait, "key")
                .content("CMA / PEA");
            cmaRowModel.appendTrait(TextCellTrait, "value");
            tableModel.appendChild(cmaRowModel, "cmaPea");
            const marketRowModel = new Model();
            marketRowModel.appendTrait(RowTrait, "row");
            marketRowModel.appendTrait(TextCellTrait, "key")
                .content("Market");
            marketRowModel.appendTrait(TextCellTrait, "value");
            tableModel.appendChild(marketRowModel, "market");
            const radioAccessTechRowModel = new Model();
            radioAccessTechRowModel.appendTrait(RowTrait, "row");
            radioAccessTechRowModel.appendTrait(TextCellTrait, "key")
                .content("Radio Access Tech.");
            radioAccessTechRowModel.appendTrait(TextCellTrait, "value");
            tableModel.appendChild(radioAccessTechRowModel, "rat");
            const gnbVendorRowModel = new Model();
            gnbVendorRowModel.appendTrait(RowTrait, "row");
            gnbVendorRowModel.appendTrait(TextCellTrait, "key")
                .content("GNB Vendor");
            gnbVendorRowModel.appendTrait(TextCellTrait, "value");
            tableModel.appendChild(gnbVendorRowModel, "gnbVendor");
            const envMorphologyRowModel = new Model();
            envMorphologyRowModel.appendTrait(RowTrait, "row");
            envMorphologyRowModel.appendTrait(TextCellTrait, "key")
                .content("Env. Morphology");
            envMorphologyRowModel.appendTrait(TextCellTrait, "value");
            tableModel.appendChild(envMorphologyRowModel, "envMorph");
            const fregBandRowModel = new Model();
            fregBandRowModel.appendTrait(RowTrait, "row");
            fregBandRowModel.appendTrait(TextCellTrait, "key")
                .content("Freq. Band");
            fregBandRowModel.appendTrait(TextCellTrait, "value");
            tableModel.appendChild(fregBandRowModel, "freqBand");
            return tableModel;
        },
    })
], SiteWidgets.prototype, "infoTable", void 0);
__decorate([
    ModelRef({
        key: "info",
        binds: true,
        observes: true,
        createModel() {
            const widgetModel = new Model();
            const widgetTrait = new WidgetTrait();
            widgetTrait.title.setValue("INFO");
            widgetTrait.subtitle.setValue("SITE");
            widgetModel.setTrait("widget", widgetTrait);
            this.owner.infoTable.insertModel(widgetModel);
            return widgetModel;
        },
    })
], SiteWidgets.prototype, "infoWidget", void 0);
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
], SiteWidgets.prototype, "overallScoreGauge", void 0);
__decorate([
    ModelRef({
        key: "overallScoreHistory",
        createModel() {
            const chartModel = new Model();
            chartModel.appendTrait(ChartTrait, "chart");
            chartModel.appendTrait(GraphTrait, "graph");
            chartModel.appendTrait(BottomAxisTrait, "bottomAxis");
            const overallScorePlotModel = new Model();
            overallScorePlotModel.appendTrait(LinePlotTrait, "plot");
            overallScorePlotModel.appendTrait(DataSetTrait, "dataSet");
            overallScorePlotModel.appendTrait(StatusTrait, "status");
            chartModel.appendChild(overallScorePlotModel, "overallScore");
            return chartModel;
        },
    })
], SiteWidgets.prototype, "overallScoreHistory", void 0);
__decorate([
    ModelRef({
        key: "score",
        binds: true,
        observes: true,
        createModel() {
            const widgetModel = new Model();
            const widgetTrait = new WidgetTrait();
            widgetTrait.title.setValue("OVERALL SCORE");
            widgetTrait.subtitle.setValue("SITE");
            widgetModel.setTrait("widget", widgetTrait);
            this.owner.overallScoreGauge.insertModel(widgetModel);
            this.owner.overallScoreHistory.insertModel(widgetModel);
            return widgetModel;
        },
    })
], SiteWidgets.prototype, "scoreWidget", void 0);
__decorate([
    ModelRef({
        key: "kpiBreakdown",
        binds: true,
        observes: true,
        createModel() {
            const widgetModel = new Model();
            const widgetTrait = new WidgetTrait();
            widgetTrait.title.setValue("KPIs DRIVING DEGRADATION");
            widgetTrait.subtitle.setValue("SITE");
            widgetModel.setTrait("widget", widgetTrait);
            return widgetModel;
        },
    })
], SiteWidgets.prototype, "kpiBreakdownWidget", void 0);
__decorate([
    ModelRef({
        key: "missingDataTable",
        createModel() {
            const tableModel = new Model();
            tableModel.appendTrait(TableTrait, "table")
                .colSpacing(12);
            tableModel.appendTrait(ColTrait, "value")
                .layout({ key: "value", grow: 1, textColor: Look.accentColor });
            return tableModel;
        },
    })
], SiteWidgets.prototype, "missingDataTable", void 0);
__decorate([
    ModelRef({
        key: "missingData",
        binds: true,
        observes: true,
        createModel() {
            const widgetModel = new Model();
            const widgetTrait = new WidgetTrait();
            widgetTrait.title.setValue("OUTAGE INFO");
            widgetTrait.subtitle.setValue("SITE");
            widgetModel.setTrait("widget", widgetTrait);
            this.owner.missingDataTable.insertModel(widgetModel);
            return widgetModel;
        },
    })
], SiteWidgets.prototype, "missingDataWidget", void 0);
__decorate([
    ValueDownlinkFastener({
        nodeUri() {
            return this.owner.entity.trait.uri;
        },
        laneUri: "status",
        didSet(newValue, oldValue) {
            this.owner.updateStatusTable(newValue);
            this.owner.updateInfoTable(newValue);
            this.owner.updateOverallScoreGauge(newValue);
            this.owner.updateScoreHistory(newValue, oldValue);
            this.owner.updateScoreHistoryCharts(newValue, oldValue);
        },
    })
], SiteWidgets.prototype, "statusDownlink", void 0);
__decorate([
    MapDownlinkFastener({
        nodeUri() {
            return this.owner.entity.trait.uri;
        },
        laneUri: "scoreHistory",
        didSync() {
            this.owner.updateScoreHistory(this.owner.statusDownlink.get(), Value.absent());
            this.owner.didSyncScoreHistory();
        },
    })
], SiteWidgets.prototype, "scoreHistoryDownlink", void 0);
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
], SiteWidgets.prototype, "missingDataDownlink", void 0);
__decorate([
    TraitRef({
        type: SelectableTrait,
        binds: true,
        observes: true,
        traitDidSelect() {
            this.owner.statusWidget.insertModel();
            this.owner.infoWidget.insertModel();
            this.owner.scoreWidget.insertModel();
            this.owner.kpiBreakdownWidget.insertModel();
            this.owner.missingDataWidget.insertModel();
            this.owner.statusDownlink.consume(this.owner);
            this.owner.scoreHistoryDownlink.consume(this.owner);
            this.owner.missingDataDownlink.consume(this.owner);
        },
        traitWillUnselect() {
            this.owner.statusDownlink.unconsume(this.owner);
            this.owner.scoreHistoryDownlink.unconsume(this.owner);
            this.owner.missingDataDownlink.unconsume(this.owner);
            this.owner.statusWidget.deleteModel();
            this.owner.statusTable.deleteModel();
            this.owner.infoWidget.deleteModel();
            this.owner.infoTable.deleteModel();
            this.owner.scoreWidget.deleteModel();
            this.owner.overallScoreGauge.deleteModel();
            this.owner.overallScoreHistory.deleteModel();
            this.owner.kpiBreakdownWidget.deleteModel();
            this.owner.missingDataWidget.deleteModel();
            this.owner.missingDataTable.deleteModel();
        },
        detectTrait(trait) {
            return trait instanceof SelectableTrait ? trait : null;
        },
    })
], SiteWidgets.prototype, "selectable", void 0);
__decorate([
    TraitRef({
        type: EntityTrait,
        binds: true,
        detectTrait(trait) {
            return trait instanceof EntityTrait ? trait : null;
        },
    })
], SiteWidgets.prototype, "entity", void 0);
//# sourceMappingURL=SiteWidgets.js.map