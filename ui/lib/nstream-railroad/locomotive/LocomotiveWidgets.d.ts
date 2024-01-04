import { Value, ValueDownlinkFastener } from "@swim/runtime";
import { Model, ModelRef, SelectableTrait, TraitRef } from "@swim/toolkit";
import { EntityTrait, StatusFactor, WidgetGroup } from "@swim/platform";
export declare class LocomotiveWidgets extends WidgetGroup {
    protected updateStatusTable(value: Value): void;
    private getStatusFactorFromAlert;
    readonly statusTable: ModelRef<this, Model>;
    readonly statusWidget: ModelRef<this, Model>;
    protected updateMetricsTable(value: Value): void;
    getStatusFactorFromPercentage(usage: number): StatusFactor | null;
    readonly metricsTable: ModelRef<this, Model>;
    readonly metricsWidget: ModelRef<this, Model>;
    protected updateHealthTable(value: Value): void;
    readonly healthTable: ModelRef<this, Model>;
    readonly healthWidget: ModelRef<this, Model>;
    protected updateInfoTable(value: Value): void;
    readonly infoTable: ModelRef<this, Model>;
    readonly infoWidget: ModelRef<this, Model>;
    readonly statusDownlink: ValueDownlinkFastener<this, Value>;
    readonly infoDownlink: ValueDownlinkFastener<this, Value>;
    readonly selectable: TraitRef<this, SelectableTrait>;
    readonly entity: TraitRef<this, EntityTrait>;
}
