import { GeoPath, GeoJsonMultiPolygon, GeoPoint, Item, Uri, Value, ValueDownlinkFastener } from "@swim/runtime";
import { VectorIcon } from "@swim/toolkit";
import { Geographic, GeographicPoint, GeographicArea, GeographicGroup, LocationTrait , Status, StatusFactor, StatusVector, StatusTrait} from "@swim/platform";

const YARD_ICON = VectorIcon.create(24, 24, "M15,11L15,5L12,2L9,5L9,7L3,7L3,21L21,21L21,11L15,11ZM7,19L5,19L5,17L7,17L7,19ZM7,15L5,15L5,13L7,13L7,15ZM7,11L5,11L5,9L7,9L7,11ZM13,19L11,19L11,17L13,17L13,19ZM13,15L11,15L11,13L13,13L13,15ZM13,11L11,11L11,9L13,9L13,11ZM13,7L11,7L11,5L13,5L13,7ZM19,19L17,19L17,17L19,17L19,19ZM19,15L17,15L17,13L19,13L19,15Z");
const YARD_ICON_SIZE = 48;

export class YardLocation extends LocationTrait {

  constructor(nodeUri: Uri) {
    super();
    this.geometryDownlink.nodeUri(nodeUri);
    this.statusDownlink.nodeUri(nodeUri);
  }

  @ValueDownlinkFastener<YardLocation, Value>({
    consumed: true,
    laneUri: "info",
    didSet(newValue: Value, oldValue: Value): void {

      const lng = newValue.get("longitude").numberValue(NaN);
      const lat = newValue.get("latitude").numberValue(NaN);
      if (isFinite(lng) && isFinite(lat)) {
        const geographic = GeographicPoint.fromInit({
          geometry: new GeoPoint(lng, lat),
          width: YARD_ICON_SIZE,
          height: YARD_ICON_SIZE,
          graphics: YARD_ICON,
          // Yellow
          fill: "rgb(255, 255, 0)",
        });
        this.owner.setGeographic(geographic);
      } else {
        this.owner.setGeographic(null);
      }

    },
  })
  readonly geometryDownlink!: ValueDownlinkFastener<this, Value>;

  private getStatusFactor(status: Value): StatusFactor | null {

    const numOfAlerts = status.get("Alerts").length;

    if (numOfAlerts > 0) return StatusFactor.create("Severity", StatusVector.of([Status.warning, 2], [Status.alert, Math.min(numOfAlerts / 2, 1)]));

    return null;
  }

  @ValueDownlinkFastener<YardLocation, Value>({
    consumed: true,
    laneUri: "status",
    didSet(newValue: Value, oldValue: Value): void {
      this.owner.getTrait(StatusTrait)!.setStatusFactor("Status", this.owner.getStatusFactor(newValue));
    },
  })
  readonly statusDownlink!:ValueDownlinkFastener<this, Value>;

}
