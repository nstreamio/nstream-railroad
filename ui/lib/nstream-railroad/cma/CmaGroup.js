import { __decorate } from "tslib";
import { MapDownlinkFastener } from "@swim/runtime";
import { EntityTrait, NodeGroup } from "@swim/platform";
import { CmaLocation } from "./CmaLocation";
import { SiteAggregatorWidgets } from "../aggregator/SiteAggregatorWidgets";
const MIN_CMA_ZOOM = 4;
const MAX_CMA_ZOOM = 7;
export class CmaGroup extends NodeGroup {
    initNodeModel(nodeModel) {
        const entityTrait = nodeModel.getTrait(EntityTrait);
        const locationTrait = new CmaLocation(entityTrait.uri);
        locationTrait.setZoomRange(MIN_CMA_ZOOM, MAX_CMA_ZOOM);
        nodeModel.setTrait("location", locationTrait);
        const widgetGroup = new SiteAggregatorWidgets("CMA");
        entityTrait.setTrait("widgets", widgetGroup);
    }
    updateNodeModel(nodeModel, value) {
    }
}
__decorate([
    MapDownlinkFastener({
        consumed: true,
        nodeUri: "swim:meta:mesh",
        laneUri: "nodes#%2fcma%2f",
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
], CmaGroup.prototype, "downlink", void 0);
//# sourceMappingURL=CmaGroup.js.map