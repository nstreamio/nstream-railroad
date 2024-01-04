import { GeoPath,Uri, Value, ValueDownlinkFastener } from "@swim/runtime";
import { GeographicLine, LocationTrait} from "@swim/platform";

const RAIL_LINE_WIDTH = 5;

export class RailLocation extends LocationTrait {

  constructor(lng1: number, lat1: number, lng2: number, lat2: number) {
    super();
    this.initLine(lng1, lat1, lng2, lat2);
  }
  
  initLine(lng1: number, lat1: number, lng2: number, lat2: number) {
    const geographic = GeographicLine.fromInit({
      geometry: GeoPath.fromAny([[lng1, lat1], [lng2, lat2]]),
      stroke: "rgb(200, 200, 200)",
      strokeWidth: RAIL_LINE_WIDTH
    });
    this.setGeographic(geographic);
  
  }

}
