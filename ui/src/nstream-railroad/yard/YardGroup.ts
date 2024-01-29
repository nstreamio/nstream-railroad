import { GeoBox, MapDownlinkFastener, Value } from "@swim/runtime";
import { Model } from "@swim/toolkit";
import { DistrictTrait, EntityTrait, NodeGroup } from "@swim/platform";
import { RailGroup } from "./RailGroup";
import { YardLocation } from "./YardLocation";
import { YardWidgets } from "./YardWidgets";

// For now remove yard icon
const MAX_YARD_ZOOM = -Infinity;

const MIN_RAIL_ZOOM = 10;
const MAX_RAIL_ZOOM = 18;

export class YardGroup extends NodeGroup {

  override initNodeModel(nodeModel: Model) {
    const entityTrait = nodeModel.getTrait(EntityTrait)!;

    const locationTrait = new YardLocation(entityTrait.uri);
    locationTrait.setZoomRange(-Infinity, MAX_YARD_ZOOM);
    nodeModel.setTrait("location", locationTrait);

    const widgetGroup = new YardWidgets();
    entityTrait.setTrait("widgets", widgetGroup);

    const RailModel = this.createNodeModel("/Rail");

    const railEntityTrait = RailModel.getTrait(EntityTrait)!;
    const districtTrait = new DistrictTrait();
    districtTrait.setZoomRange(MIN_RAIL_ZOOM, MAX_RAIL_ZOOM);
    districtTrait.setBoundary(GeoBox.globe());
    RailModel.setTrait("district", districtTrait);

    const subdistricts = new RailGroup(entityTrait.uri);
    RailModel.setChild("subdistricts", subdistricts);
    (railEntityTrait.subentities.binds as any) = false;
    railEntityTrait.subentities.setModel(subdistricts);
    this.appendChild(RailModel, "/Rail");    

  }

  updateNodeModel(nodeModel: Model, value: Value) {

  }

  @MapDownlinkFastener<YardGroup, Value, Value>({
    consumed: true,
    nodeUri: "swim:meta:mesh",
    laneUri: "nodes#%2fyard%2f",
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
