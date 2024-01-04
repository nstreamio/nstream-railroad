import { Uri, Value, ValueDownlinkFastener } from "@swim/runtime";
import { LocationTrait } from "@swim/platform";
export declare class MarketLocation extends LocationTrait {
    constructor(nodeUri: Uri);
    readonly geometryDownlink: ValueDownlinkFastener<this, Value>;
    private getStatusFactor;
    readonly statusDownlink: ValueDownlinkFastener<this, Value>;
}
