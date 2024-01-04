import { MapDownlinkFastener, Value, ValueDownlinkFastener } from "@swim/runtime";
import { Model, ModelRef, SelectableTrait, TraitRef } from "@swim/toolkit";
import { EntityTrait, WidgetGroup } from "@swim/platform";
export declare class SiteWidgets extends WidgetGroup {
    protected updateStatusTable(value: Value): void;
    private getStatusFactorFromAlertCount;
    readonly statusTable: ModelRef<this, Model>;
    readonly statusWidget: ModelRef<this, Model>;
    protected updateInfoTable(value: Value): void;
    readonly infoTable: ModelRef<this, Model>;
    readonly infoWidget: ModelRef<this, Model>;
    protected updateOverallScoreGauge(value: Value): void;
    readonly overallScoreGauge: ModelRef<this, Model>;
    protected updateScoreHistory(newStatus: Value, oldStatus: Value): void;
    protected repopulateScoreHistoryChart(timestamp: number, currentOverallScore: number | void): void;
    private getStatusFactorFromScore;
    readonly overallScoreHistory: ModelRef<this, Model>;
    readonly scoreWidget: ModelRef<this, Model>;
    protected updateScoreHistoryCharts(newStatus: Value, oldStatus: Value): void;
    protected createScoreHistoryChart(scoreName: string, timestamp: number): Model;
    protected createScoreHistoryTitle(alertName: string): Model;
    protected removeAllScoreHistoryCharts(): void;
    protected didSyncScoreHistory(): void;
    readonly kpiBreakdownWidget: ModelRef<this, Model>;
    protected updateMissingDataTable(newValue: Value, oldValue: Value): void;
    readonly missingDataTable: ModelRef<this, Model>;
    readonly missingDataWidget: ModelRef<this, Model>;
    readonly statusDownlink: ValueDownlinkFastener<this, Value>;
    readonly scoreHistoryDownlink: MapDownlinkFastener<this, number, Value>;
    readonly missingDataDownlink: ValueDownlinkFastener<this, Value>;
    readonly selectable: TraitRef<this, SelectableTrait>;
    readonly entity: TraitRef<this, EntityTrait>;
}
