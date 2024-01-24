import { GeoPoint, GeoPath,Uri, Value, ValueDownlinkFastener } from "@swim/runtime";
import { GeographicLine, LocationTrait} from "@swim/platform";

const RAIL_LINE_WIDTH = 1;

export class RailLocation extends LocationTrait {

  constructor(geoPoints: GeoPoint[]) {
    super();
    this.initLine(geoPoints);
  }
  
  initLine(geoPoints: GeoPoint[]) {    
    //const newLocal = latLngs as AnyGeoPath;
    const geographic = GeographicLine.fromInit({
      geometry: GeoPath.fromPoints(geoPoints),
      stroke: "rgb(100, 100, 100)",
      strokeWidth: RAIL_LINE_WIDTH
    });
    this.setGeographic(geographic);
  
  }

}
