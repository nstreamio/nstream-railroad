import { __decorate } from "tslib";
import { MapDownlinkFastener } from "@swim/runtime";
import { EntityTrait, NodeGroup } from "@swim/platform";
import { PeaLocation } from "./PeaLocation";
import { SiteAggregatorWidgets } from "../aggregator/SiteAggregatorWidgets";
const MAX_PEA_ZOOM = 4;
export class PeaGroup extends NodeGroup {
    initNodeModel(nodeModel) {
        const entityTrait = nodeModel.getTrait(EntityTrait);
        const locationTrait = new PeaLocation(entityTrait.uri);
        locationTrait.setZoomRange(-Infinity, MAX_PEA_ZOOM);
        nodeModel.setTrait("location", locationTrait);
        const widgetGroup = new SiteAggregatorWidgets("PEA");
        entityTrait.setTrait("widgets", widgetGroup);
    }
    updateNodeModel(nodeModel, value) {
    }
}
__decorate([
    MapDownlinkFastener({
        consumed: true,
        nodeUri: "swim:meta:mesh",
        laneUri: "nodes#%2fpea%2f",
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
], PeaGroup.prototype, "downlink", void 0);
//# sourceMappingURL=PeaGroup.js.map