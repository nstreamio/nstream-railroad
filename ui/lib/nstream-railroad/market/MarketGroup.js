import { __decorate } from "tslib";
import { MapDownlinkFastener } from "@swim/runtime";
import { EntityTrait, NodeGroup } from "@swim/platform";
import { MarketLocation } from "./MarketLocation";
import { SiteAggregatorWidgets } from "../aggregator/SiteAggregatorWidgets";
const MIN_MARKET_ZOOM = 7;
const MAX_MARKET_ZOOM = 11;
export class MarketGroup extends NodeGroup {
    initNodeModel(nodeModel) {
        const entityTrait = nodeModel.getTrait(EntityTrait);
        const locationTrait = new MarketLocation(entityTrait.uri);
        locationTrait.setZoomRange(MIN_MARKET_ZOOM, MAX_MARKET_ZOOM);
        nodeModel.setTrait("location", locationTrait);
        const widgetGroup = new SiteAggregatorWidgets("MARKET");
        entityTrait.setTrait("widgets", widgetGroup);
    }
    updateNodeModel(nodeModel, value) {
    }
}
__decorate([
    MapDownlinkFastener({
        consumed: true,
        nodeUri: "swim:meta:mesh",
        laneUri: "nodes#%2fmarket%2f",
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
], MarketGroup.prototype, "downlink", void 0);
//# sourceMappingURL=MarketGroup.js.map