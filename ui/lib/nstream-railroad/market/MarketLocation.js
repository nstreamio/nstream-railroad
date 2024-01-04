import { __decorate } from "tslib";
import { GeoPath, GeoPoint, ValueDownlinkFastener } from "@swim/runtime";
import { VectorIcon } from "@swim/toolkit";
import { GeographicPoint, GeographicArea, GeographicGroup, LocationTrait, Status, StatusFactor, StatusVector, StatusTrait } from "@swim/platform";
const MARKET_ICON = VectorIcon.create(32, 32, "M31,18.67L19.53,18.67L19.53,14.22L31,14.22L31,18.67ZM28.35,17.33C28.84,17.33,29.24,16.94,29.24,16.44C29.24,15.95,28.84,15.56,28.35,15.56C27.87,15.56,27.47,15.95,27.47,16.44C27.47,16.94,27.87,17.33,28.35,17.33ZM31,20.44L31,23.56C31,24.54,30.21,25.33,29.24,25.33L19.53,25.33L19.53,20.44L31,20.44ZM28.35,23.56C28.84,23.56,29.24,23.16,29.24,22.67C29.24,22.18,28.84,21.78,28.35,21.78C27.87,21.78,27.47,22.18,27.47,22.67C27.47,23.16,27.87,23.56,28.35,23.56ZM31,12.44L19.53,12.44L19.53,7.56L29.24,7.56C30.21,7.56,31,8.35,31,9.33L31,12.44ZM28.35,11.11C28.84,11.11,29.24,10.71,29.24,10.22C29.24,9.73,28.84,9.33,28.35,9.33C27.87,9.33,27.47,9.73,27.47,10.22C27.47,10.71,27.87,11.11,28.35,11.11ZM14.24,25.33L6.74,25.33C3.57,25.33,1,22.75,1,19.56C1,16.58,3.24,14.13,6.11,13.81C7.03,9.96,10.3,7.09,14.24,6.71L14.24,25.33ZM16,4.89C16,4.4,16.4,4,16.88,4C17.37,4,17.76,4.4,17.76,4.89L17.76,27.11C17.76,27.6,17.37,28,16.88,28C16.4,28,16,27.6,16,27.11L16,4.89Z");
const MARKET_ICON_SIZE = 32;
export class MarketLocation extends LocationTrait {
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
            else {
                const lng = newValue.get("centroid").getItem(0).numberValue(void 0);
                const lat = newValue.get("centroid").getItem(1).numberValue(void 0);
                if (lng !== void 0 && lng !== 0 && lat !== void 0 && lat !== 0) {
                    const geographic = GeographicPoint.fromInit({
                        geometry: new GeoPoint(lng, lat),
                        width: MARKET_ICON_SIZE,
                        height: MARKET_ICON_SIZE,
                        graphics: MARKET_ICON,
                    });
                    this.owner.setGeographic(geographic);
                }
            }
        },
    })
], MarketLocation.prototype, "geometryDownlink", void 0);
__decorate([
    ValueDownlinkFastener({
        consumed: true,
        laneUri: "status",
        didSet(newValue, oldValue) {
            this.owner.getTrait(StatusTrait).setStatusFactor("Status", this.owner.getStatusFactor(newValue));
        },
    })
], MarketLocation.prototype, "statusDownlink", void 0);
//# sourceMappingURL=MarketLocation.js.map