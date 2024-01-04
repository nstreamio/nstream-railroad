import { AnyUriPath, GeoTile, MapDownlinkFastener, Uri, Value } from "@swim/runtime";
import { Model, TraitRef } from "@swim/toolkit";
import { DistrictTrait, NodeGroup } from "@swim/platform";
export declare class GridGroup extends NodeGroup {
    constructor(geoTile: GeoTile, nodeUri: Uri, metaHostUri?: Uri);
    readonly geoTile: GeoTile;
    protected initSubtiles(): void;
    protected initTileModel(nodeModel: Model, geoTile: GeoTile): void;
    protected initYards(): void;
    initRclNodeModel(nodeModel: Model): void;
    updateRclNodeModel(nodeModel: Model, value: Value): void;
    private getStatusFactor;
    protected getOrCreateRclNodeModel(nodePath: AnyUriPath): Model;
    initRcuNodeModel(nodeModel: Model): void;
    updateRcuNodeModel(nodeModel: Model, value: Value): void;
    protected getOrCreateRcuNodeModel(nodePath: AnyUriPath): Model;
    readonly rclsDownlink: MapDownlinkFastener<this, Value, Value>;
    readonly district: TraitRef<this, DistrictTrait>;
    onStartConsuming(): void;
    onStopConsuming(): void;
}
