import { MapDownlinkFastener, Value } from "@swim/runtime";
import { Model } from "@swim/toolkit";
import { EntityTrait, NodeGroup } from "@swim/platform";
import { YardLocation } from "./YardLocation";
import { YardWidgets } from "./YardWidgets";

const MAX_YARD_ZOOM = 7;

export class YardGroup extends NodeGroup {

  override initNodeModel(nodeModel: Model) {
    const entityTrait = nodeModel.getTrait(EntityTrait)!;

    const locationTrait = new YardLocation(entityTrait.uri);
    locationTrait.setZoomRange(-Infinity, MAX_YARD_ZOOM);
    nodeModel.setTrait("location", locationTrait);

    const widgetGroup = new YardWidgets();
    entityTrait.setTrait("widgets", widgetGroup);
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
