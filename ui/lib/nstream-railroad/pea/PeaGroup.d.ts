import { MapDownlinkFastener, Value } from "@swim/runtime";
import { Model } from "@swim/toolkit";
import { NodeGroup } from "@swim/platform";
export declare class PeaGroup extends NodeGroup {
    initNodeModel(nodeModel: Model): void;
    updateNodeModel(nodeModel: Model, value: Value): void;
    readonly downlink: MapDownlinkFastener<this, Value, Value>;
}
