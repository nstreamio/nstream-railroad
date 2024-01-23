import { GeoPoint, Uri, MapDownlinkFastener, Value } from "@swim/runtime";
import { Model, Trait, TraitRef } from "@swim/toolkit";
import { EntityTrait, NodeGroup } from "@swim/platform";
import { RailLocation } from "./RailLocation";

const MIN_RAIL_ZOOM = 10;
const MAX_RAIL_ZOOM = 30;

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
    const coordinates = value.get("coordinates").stringValue("").split(",");
    const geoPoints: GeoPoint[] = [];
    for (var i = 0; i < coordinates.length; i += 2) {
      const lng = parseFloat(coordinates[i + 1] as string);
      const lat = parseFloat(coordinates[i] as string);
      if (isFinite(lng) && isFinite(lat)) {
        geoPoints.push(new GeoPoint(lng, lat));
      }
    }

    const railTrait = new RailLocation(geoPoints);
    railTrait.setZoomRange(MIN_RAIL_ZOOM, MAX_RAIL_ZOOM);
    nodeModel.setTrait("railLocation", railTrait);
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
