import { __decorate } from "tslib";
import { GeoPath, GeoPoint, ValueDownlinkFastener } from "@swim/runtime";
import { GeographicArea, GeographicGroup, LocationTrait, Status, StatusFactor, StatusVector, StatusTrait } from "@swim/platform";
export class PeaLocation extends LocationTrait {
    constructor(nodeUri) {
        super();
        this.geometryDownlink.nodeUri(nodeUri);
        this.statusDownlink.nodeUri(nodeUri);
    }
    getStatusFactor(status) {
        const numOfAlerts = status.get("Alerts").length;
        if (numOfAlerts > 0)
            return StatusFactor.create("Severity", StatusVector.of([Status.warning, 2], [Status.alert, Math.min(numOfAlerts / 2, 1)]));
        return null;
    }
}
__decorate([
    ValueDownlinkFastener({
        consumed: true,
        laneUri: "geometry",
        didSet(newValue, oldValue) {
            const type = newValue.get("type").stringValue("");
            if (type === "Polygon") {
                const geoPoints = [];
                newValue.get("coordinates").getItem(0).forEach((item, index) => {
                    const lng = item.getItem(0).numberValue(void 0);
                    const lat = item.getItem(1).numberValue(void 0);
                    if (lng !== void 0 && lat !== void 0) {
                        geoPoints.push(new GeoPoint(lng, lat));
                    }
                });
                const geographic = GeographicArea.fromInit({
                    geometry: GeoPath.fromPoints(geoPoints)
                });
                this.owner.setGeographic(geographic);
            }
            else if (type === "MultiPolygon") {
                const polygons = [];
                newValue.get("coordinates").forEach((polygon, index) => {
                    //For each polygon
                    const geoPoints = [];
                    polygon.forEach((coordinate, index) => {
                        //For each coordinate
                        const lng = coordinate.getItem(0).numberValue(void 0);
                        const lat = coordinate.getItem(1).numberValue(void 0);
                        if (lng !== void 0 && lat !== void 0) {
                            geoPoints.push(new GeoPoint(lng, lat));
                        }
                    });
                    polygons.push(GeographicArea.fromInit({
                        geometry: GeoPath.fromPoints(geoPoints)
                    }));
                });
                this.owner.setGeographic(new GeographicGroup(polygons));
            }
        },
    })
], PeaLocation.prototype, "geometryDownlink", void 0);
__decorate([
    ValueDownlinkFastener({
        consumed: true,
        laneUri: "status",
        didSet(newValue, oldValue) {
            this.owner.getTrait(StatusTrait).setStatusFactor("Status", this.owner.getStatusFactor(newValue));
        },
    })
], PeaLocation.prototype, "statusDownlink", void 0);
//# sourceMappingURL=PeaLocation.js.map