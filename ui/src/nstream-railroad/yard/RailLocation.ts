import { GeoPoint, GeoPath,Uri, Value, ValueDownlinkFastener } from "@swim/runtime";
import { GeographicLine, LocationTrait} from "@swim/platform";

const RAIL_LINE_WIDTH = 5;

export class RailLocation extends LocationTrait {

  constructor(geoPoints: GeoPoint[]) {
    super();
    this.initLine(geoPoints);
  }
  
  initLine(geoPoints: GeoPoint[]) {    0
    //const newLocal = latLngs as AnyGeoPath;
    const geographic = GeographicLine.fromInit({
      geometry: GeoPath.fromPoints(geoPoints),
      stroke: "rgb(200, 200, 200)",
      strokeWidth: RAIL_LINE_WIDTH
    });
    this.setGeographic(geographic);
  
  }

}
