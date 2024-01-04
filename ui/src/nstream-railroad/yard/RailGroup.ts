import { Uri, MapDownlinkFastener, Value } from "@swim/runtime";
import { Model, Trait, TraitRef } from "@swim/toolkit";
import { EntityTrait, NodeGroup } from "@swim/platform";
import { RailLocation } from "./RailLocation";

const MIN_RAIL_ZOOM = 10;
const MAX_RAIL_ZOOM = 18;

export class RailGroup extends NodeGroup {
  
  constructor(nodeUri: Uri) {
    super();
    this.downlink.nodeUri(nodeUri);
  }

  override initNodeModel(nodeModel: Model) {
    const entityTrait = nodeModel.getTrait(EntityTrait)!;

    //const locationTrait = new RailLocation(entityTrait.uri);
    //locationTrait.setZoomRange(MIN_RAIL_ZOOM, MAX_RAIL_ZOOM);
    //nodeModel.setTrait("location", locationTrait);
  }

  updateNodeModel(nodeModel: Model, value: Value) {
    const entityTrait = nodeModel.getTrait(EntityTrait)!;

    const lng1 = value.get("lng1").numberValue(NaN);
    const lat1 = value.get("lat1").numberValue(NaN);
    const lng2 = value.get("lng2").numberValue(NaN);
    const lat2 = value.get("lat2").numberValue(NaN);
    if (isFinite(lng1) && isFinite(lat1) && isFinite(lng2) && isFinite(lat2)) {
      const railTrait = new RailLocation(lng1, lat1, lng2, lat2);
      railTrait.setZoomRange(MIN_RAIL_ZOOM, MAX_RAIL_ZOOM);
      nodeModel.setTrait("railLocation", railTrait);
    }
  }

  @MapDownlinkFastener<RailGroup, Value, Value>({
    consumed: true,
    laneUri: "rails",
    didUpdate(key: Value, value: Value): void {
      if (this.owner.consuming) {
        const nodeModel = this.owner.getOrCreateNodeModel(key.stringValue(""));
        this.owner.updateNodeModel(nodeModel, value);
      }
    },
    didRemove(key: Value, value: Value): void {
      if (this.owner.consuming) {
        this.owner.removeNodeModel(key.stringValue(""));
      }
    },
  })
  readonly downlink!: MapDownlinkFastener<this, Value, Value>;

}
