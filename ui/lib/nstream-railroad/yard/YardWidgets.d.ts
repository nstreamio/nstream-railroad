import { MapDownlinkFastener, Value } from "@swim/runtime";
import { Model, ModelRef, SelectableTrait, TraitRef } from "@swim/toolkit";
import { EntityTrait, StatusFactor, WidgetGroup } from "@swim/platform";
export declare class YardWidgets extends WidgetGroup {
    protected updateStatusTable(key: Value, value: Value): void;
    getOrCreateRowModel(key: Value): Model;
    createRowModel(key: Value): Model;
    private getTimeStr;
    private getStatusFactorFromAlert;
    getWarningStatusFromFlag(flag: boolean): StatusFactor | null;
    getAlertStatusFromFlag(flag: boolean): StatusFactor | null;
    readonly statusTable: ModelRef<this, Model>;
    readonly statusWidget: ModelRef<this, Model>;
    readonly agentsDownlink: MapDownlinkFastener<this, Value>;
    readonly selectable: TraitRef<this, SelectableTrait>;
    readonly entity: TraitRef<this, EntityTrait>;
}
