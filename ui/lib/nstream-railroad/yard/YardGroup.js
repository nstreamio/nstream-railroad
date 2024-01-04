import { __decorate } from "tslib";
import { MapDownlinkFastener } from "@swim/runtime";
import { EntityTrait, NodeGroup } from "@swim/platform";
import { YardLocation } from "./YardLocation";
import { YardWidgets } from "./YardWidgets";
const MAX_YARD_ZOOM = 7;
export class YardGroup extends NodeGroup {
    initNodeModel(nodeModel) {
        const entityTrait = nodeModel.getTrait(EntityTrait);
        const locationTrait = new YardLocation(entityTrait.uri);
        locationTrait.setZoomRange(-Infinity, MAX_YARD_ZOOM);
        nodeModel.setTrait("location", locationTrait);
        const widgetGroup = new YardWidgets();
        entityTrait.setTrait("widgets", widgetGroup);
    }
    updateNodeModel(nodeModel, value) {
    }
}
__decorate([
    MapDownlinkFastener({
        consumed: true,
        nodeUri: "swim:meta:mesh",
        laneUri: "nodes#%2fyard%2f",
        didUpdate(key, value) {
            if (this.owner.consuming) {
                const nodeModel = this.owner.getOrCreateNodeModel(key.stringValue(""));
                this.owner.updateNodeModel(nodeModel, value);
            }
        },
        didRemove(key, value) {
            if (this.owner.consuming) {
                this.owner.removeNodeModel(key.stringValue(""));
            }
        },
    })
], YardGroup.prototype, "downlink", void 0);
//# sourceMappingURL=YardGroup.js.map