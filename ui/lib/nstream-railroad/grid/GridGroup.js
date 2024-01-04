import { __decorate } from "tslib";
import { GeoBox, GeoPoint, MapDownlinkFastener, Uri, UriPath } from "@swim/runtime";
import { TraitRef, VectorIcon } from "@swim/toolkit";
import { DistrictTrait, EntityTrait, GeographicPoint, LocationTrait, NodeGroup, Status, StatusTrait, StatusFactor, StatusVector } from "@swim/platform";
import { RclWidgets } from "../rcl/RclWidgets";
import { YardGroup } from "../yard/YardGroup";
const LOCOMOTIVE_ICON = VectorIcon.create(24, 24, "M12.2,4C15.9,4,18.9,4.4,19,7.2L19,7.3L19,15.8C19,16.5,18.7,17.1,18.2,17.5L18.1,17.6L18.1,19.1C18.1,19.6,17.8,19.9,17.3,20L17.2,20L16.4,20C15.9,20,15.5,19.6,15.5,19.2L15.5,19.1L15.5,18L8.5,18L8.5,19.1C8.5,19.6,8.2,19.9,7.7,20L7.6,20L6.7,20C6.3,20,5.9,19.6,5.9,19.2L5.9,19.1L5.9,17.6C5.4,17.2,5,16.6,5,15.9L5,15.8L5,7.3C5,4.4,8,4,11.8,4L12.2,4ZM8,16.5C8.8,16.5,9.5,15.8,9.5,15C9.5,14.2,8.8,13.5,8,13.5C7.2,13.5,6.5,14.2,6.5,15C6.5,15.8,7.2,16.5,8,16.5ZM16,16.5C16.8,16.5,17.5,15.8,17.5,15C17.5,14.2,16.8,13.5,16,13.5C15.2,13.5,14.5,14.2,14.5,15C14.5,15.8,15.2,16.5,16,16.5ZM17,7L7,7L7,12L17,12L17,7Z");
const LOCOMOTIVE_ICON_SIZE = 25;
const RCU_ICON = VectorIcon.create(24, 24, "M12,7C13.05,7,13.92,7.82,13.99,8.85L14,9C14,9.74,13.6,10.39,13,10.73L13,18L18.15,18C19.28,18,20.32,18.64,20.83,19.66L21.28,20.55C21.61,21.22,21.13,22,20.38,22L3.62,22C2.87,22,2.39,21.22,2.72,20.55L3.17,19.66C3.68,18.64,4.72,18,5.85,18L11,18L11,10.73C10.4,10.39,10,9.74,10,9C10,7.9,10.9,7,12,7ZM19.07,2.28C22.98,5.99,22.98,12.01,19.07,15.72C18.68,16.09,18.05,16.09,17.66,15.72C17.27,15.35,17.27,14.75,17.66,14.38C20.78,11.41,20.78,6.59,17.66,3.62C17.27,3.25,17.27,2.65,17.66,2.28C18.05,1.91,18.68,1.91,19.07,2.28ZM6.34,2.28C6.73,2.65,6.73,3.25,6.34,3.62C3.22,6.59,3.22,11.41,6.34,14.38C6.73,14.75,6.73,15.35,6.34,15.72C5.95,16.09,5.32,16.09,4.93,15.72C1.02,12.01,1.02,5.99,4.93,2.28C5.32,1.91,5.95,1.91,6.34,2.28ZM16.24,4.97C18.59,7.19,18.59,10.81,16.24,13.03C15.85,13.4,15.22,13.4,14.83,13.03C14.44,12.66,14.44,12.06,14.83,11.69C16.39,10.2,16.39,7.8,14.83,6.31C14.44,5.94,14.44,5.34,14.83,4.97C15.22,4.6,15.85,4.6,16.24,4.97ZM9.17,4.97C9.56,5.34,9.56,5.94,9.17,6.31C7.61,7.8,7.61,10.2,9.17,11.69C9.56,12.06,9.56,12.66,9.17,13.03C8.78,13.4,8.15,13.4,7.76,13.03C5.41,10.81,5.41,7.19,7.76,4.97C8.15,4.6,8.78,4.6,9.17,4.97Z");
const RCU_ICON_SIZE = 25;
const MIN_LOCOMOTIVE_ZOOM = 10;
const MAX_LOCOMOTIVE_ZOOM = 18;
// To change zoom level also change _Group class
const MAX_YARD_ZOOM = 7;
export class GridGroup extends NodeGroup {
    constructor(geoTile, nodeUri, metaHostUri) {
        super(metaHostUri);
        this.geoTile = geoTile;
        this.rclsDownlink.nodeUri(nodeUri);
    }
    initSubtiles() {
        const geoTile = this.geoTile;
        const southWestTile = geoTile.southWestTile;
        const southWestTileId = southWestTile.x + "," + southWestTile.y + "," + southWestTile.z;
        const southWestNodeUri = Uri.path(UriPath.of("/", "map", "/", southWestTileId));
        const southWestModel = this.createNodeModel(southWestNodeUri.path, southWestNodeUri);
        this.initTileModel(southWestModel, southWestTile);
        this.appendChild(southWestModel, southWestNodeUri.toString());
        const northWestTile = geoTile.northWestTile;
        const northWestTileId = northWestTile.x + "," + northWestTile.y + "," + northWestTile.z;
        const northWestNodeUri = Uri.path(UriPath.of("/", "map", "/", northWestTileId));
        const northWestModel = this.createNodeModel(northWestNodeUri.path, northWestNodeUri);
        this.initTileModel(northWestModel, northWestTile);
        this.appendChild(northWestModel, northWestNodeUri.toString());
        const southEastTile = geoTile.southEastTile;
        const southEastTileId = southEastTile.x + "," + southEastTile.y + "," + southEastTile.z;
        const southEastNodeUri = Uri.path(UriPath.of("/", "map", "/", southEastTileId));
        const southEastModel = this.createNodeModel(southEastNodeUri.path, southEastNodeUri);
        this.initTileModel(southEastModel, southEastTile);
        this.appendChild(southEastModel, southEastNodeUri.toString());
        const northEastTile = geoTile.northEastTile;
        const northEastTileId = northEastTile.x + "," + northEastTile.y + "," + northEastTile.z;
        const northEastNodeUri = Uri.path(UriPath.of("/", "map", "/", northEastTileId));
        const northEastModel = this.createNodeModel(northEastNodeUri.path, northEastNodeUri);
        this.initTileModel(northEastModel, northEastTile);
        this.appendChild(northEastModel, northEastNodeUri.toString());
    }
    initTileModel(nodeModel, geoTile) {
        const entityTrait = nodeModel.getTrait(EntityTrait);
        if (geoTile.z <= 16) {
            const districtTrait = new DistrictTrait();
            districtTrait.setZoomRange(this.geoTile.z, geoTile.z < MAX_LOCOMOTIVE_ZOOM ? this.geoTile.z + 2 : Infinity);
            districtTrait.setBoundary(this.geoTile.bounds);
            nodeModel.setTrait("district", districtTrait);
            const subdistricts = new GridGroup(geoTile, entityTrait.uri, this.metaHostUri);
            nodeModel.setChild("subdistricts", subdistricts);
            entityTrait.subentities.binds = false;
            entityTrait.subentities.setModel(subdistricts);
            subdistricts.district.setTrait(districtTrait);
        }
    }
    // Yards
    initYards() {
        const YardModel = this.createNodeModel("/Yard");
        const entityTrait = YardModel.getTrait(EntityTrait);
        const districtTrait = new DistrictTrait();
        districtTrait.setZoomRange(-Infinity, MAX_YARD_ZOOM);
        districtTrait.setBoundary(GeoBox.globe());
        YardModel.setTrait("district", districtTrait);
        const subdistricts = new YardGroup();
        subdistricts.setTrait("status", new StatusTrait());
        YardModel.setChild("subdistricts", subdistricts);
        entityTrait.subentities.binds = false;
        entityTrait.subentities.setModel(subdistricts);
        this.appendChild(YardModel, "/Yard");
    }
    // Rcls
    initRclNodeModel(nodeModel) {
        const entityTrait = nodeModel.getTrait(EntityTrait);
        entityTrait.icon.setValue(LOCOMOTIVE_ICON);
        const locationTrait = new LocationTrait();
        locationTrait.setZoomRange(MIN_LOCOMOTIVE_ZOOM - 1, Infinity);
        nodeModel.setTrait("location", locationTrait);
        const statusTrait = nodeModel.getTrait(StatusTrait);
        statusTrait.setStatusFactor("severity", StatusFactor.create("Severity", StatusVector.of([Status.normal, 2])));
        const widgetGroup = new RclWidgets();
        entityTrait.setTrait("widgets", widgetGroup);
    }
    updateRclNodeModel(nodeModel, value) {
        const locationTrait = nodeModel.getTrait(LocationTrait);
        const lng = value.get("longitude").numberValue(NaN);
        const lat = value.get("latitude").numberValue(NaN);
        if (isFinite(lng) && isFinite(lat)) {
            const geographic = GeographicPoint.fromInit({
                geometry: new GeoPoint(lng, lat),
                width: LOCOMOTIVE_ICON_SIZE,
                height: LOCOMOTIVE_ICON_SIZE,
                graphics: LOCOMOTIVE_ICON,
            });
            locationTrait.setGeographic(geographic);
        }
        else {
            locationTrait.setGeographic(null);
        }
        nodeModel.getTrait(StatusTrait).setStatusFactor("Status", this.getStatusFactor(value));
    }
    getStatusFactor(status) {
        const isOffline = status.get("isOffline").booleanValue();
        const isCritical = status.get("isCriticalAlert").booleanValue();
        const isIdle = status.get("isIdle").booleanValue();
        const isWarning = status.get("alertStatus").stringValue("") == "Warning";
        if (isOffline || isCritical)
            return StatusFactor.create("Severity", StatusVector.of([Status.alert, 2]));
        if (isIdle || isWarning)
            return StatusFactor.create("Severity", StatusVector.of([Status.warning, 2]));
        return null;
    }
    getOrCreateRclNodeModel(nodePath) {
        if (typeof nodePath !== "string") {
            nodePath = UriPath.fromAny(nodePath).toString();
        }
        let nodeModel = this.getChild(nodePath);
        if (nodeModel === null) {
            nodeModel = this.createNodeModel(nodePath);
            this.initRclNodeModel(nodeModel);
            this.appendChild(nodeModel, nodePath);
        }
        return nodeModel;
    }
    // RCUs
    initRcuNodeModel(nodeModel) {
        const entityTrait = nodeModel.getTrait(EntityTrait);
        entityTrait.icon.setValue(RCU_ICON);
        const locationTrait = new LocationTrait();
        locationTrait.setZoomRange(MIN_LOCOMOTIVE_ZOOM - 1, Infinity);
        nodeModel.setTrait("location", locationTrait);
        const statusTrait = nodeModel.getTrait(StatusTrait);
        statusTrait.setStatusFactor("severity", StatusFactor.create("Severity", StatusVector.of([Status.normal, 2])));
        const widgetGroup = new RclWidgets();
        entityTrait.setTrait("widgets", widgetGroup);
    }
    updateRcuNodeModel(nodeModel, value) {
        const locationTrait = nodeModel.getTrait(LocationTrait);
        const lng = value.get("longitude").numberValue(NaN);
        const lat = value.get("latitude").numberValue(NaN);
        if (isFinite(lng) && isFinite(lat)) {
            const geographic = GeographicPoint.fromInit({
                geometry: new GeoPoint(lng, lat),
                width: RCU_ICON_SIZE,
                height: RCU_ICON_SIZE,
                graphics: RCU_ICON,
            });
            locationTrait.setGeographic(geographic);
        }
        else {
            locationTrait.setGeographic(null);
        }
        nodeModel.getTrait(StatusTrait).setStatusFactor("Status", this.getStatusFactor(value));
    }
    getOrCreateRcuNodeModel(nodePath) {
        if (typeof nodePath !== "string") {
            nodePath = UriPath.fromAny(nodePath).toString();
        }
        let nodeModel = this.getChild(nodePath);
        if (nodeModel === null) {
            nodeModel = this.createNodeModel(nodePath);
            this.initRcuNodeModel(nodeModel);
            this.appendChild(nodeModel, nodePath);
        }
        return nodeModel;
    }
    onStartConsuming() {
        super.onStartConsuming();
        if (this.geoTile.z === 0) {
            this.initYards();
        }
        this.initSubtiles();
    }
    onStopConsuming() {
        super.onStopConsuming();
        this.removeChildren();
    }
}
__decorate([
    MapDownlinkFastener({
        laneUri: "agents",
        didUpdate(key, value) {
            if (this.owner.consuming && this.owner.district.trait.consuming) {
                if (key.stringValue("").startsWith("/rcl")) {
                    const nodeModel = this.owner.getOrCreateRclNodeModel(key.stringValue(""));
                    this.owner.updateRclNodeModel(nodeModel, value);
                }
                else if (key.stringValue("").startsWith("/rcu")) {
                    const nodeModel = this.owner.getOrCreateRcuNodeModel(key.stringValue(""));
                    this.owner.updateRcuNodeModel(nodeModel, value);
                }
            }
        },
        didRemove(key, value) {
            if (this.owner.consuming && this.owner.district.trait.consuming) {
                this.owner.removeNodeModel(key.stringValue(""));
            }
        },
    })
], GridGroup.prototype, "rclsDownlink", void 0);
__decorate([
    TraitRef({
        type: DistrictTrait,
        observes: true,
        traitDidStartConsuming() {
            if (this.owner.geoTile.z % 2 === 0 && this.owner.geoTile.z > MIN_LOCOMOTIVE_ZOOM - 1) {
                this.owner.rclsDownlink.consume(this.owner);
            }
        },
        traitWillStopConsuming() {
            this.owner.rclsDownlink.unconsume(this.owner);
            let child = this.owner.firstChild;
            while (child !== null) {
                const next = child.nextSibling;
                if (!(child.getChild("subdistricts") instanceof GridGroup)) {
                    child.remove();
                }
                child = next;
            }
        },
    })
], GridGroup.prototype, "district", void 0);
//# sourceMappingURL=GridGroup.js.map