import { GeoTile, Uri, UriPath } from "@swim/runtime";
import { VectorIcon } from "@swim/toolkit";
import { DistrictTrait, DomainTrait, EntityPlugin, EntityTrait } from "@swim/platform";
import { GridGroup } from "./grid/GridGroup";

const DOMAIN_ICON = VectorIcon.create(24, 24, "M12.2,4C15.9,4,18.9,4.4,19,7.2L19,7.3L19,15.8C19,16.5,18.7,17.1,18.2,17.5L18.1,17.6L18.1,19.1C18.1,19.6,17.8,19.9,17.3,20L17.2,20L16.4,20C15.9,20,15.5,19.6,15.5,19.2L15.5,19.1L15.5,18L8.5,18L8.5,19.1C8.5,19.6,8.2,19.9,7.7,20L7.6,20L6.7,20C6.3,20,5.9,19.6,5.9,19.2L5.9,19.1L5.9,17.6C5.4,17.2,5,16.6,5,15.9L5,15.8L5,7.3C5,4.4,8,4,11.8,4L12.2,4ZM8,16.5C8.8,16.5,9.5,15.8,9.5,15C9.5,14.2,8.8,13.5,8,13.5C7.2,13.5,6.5,14.2,6.5,15C6.5,15.8,7.2,16.5,8,16.5ZM16,16.5C16.8,16.5,17.5,15.8,17.5,15C17.5,14.2,16.8,13.5,16,13.5C15.2,13.5,14.5,14.2,14.5,15C14.5,15.8,15.2,16.5,16,16.5ZM17,7L7,7L7,12L17,12L17,7Z");

export class NstreamRailroadPlugin extends EntityPlugin {

  override get id(): string {
    return "nstream-railroad";
  }

  override get title(): string {
    return "Nstream Railroad";
  }

  override injectEntity(entityTrait: EntityTrait, domainTrait: DomainTrait): void {
    const entityUri = entityTrait.uri.toString();
    if (entityUri.startsWith("warp://") || entityUri.startsWith("warps://")) {
      entityTrait.title.setValue("Nstream Railroad");
      entityTrait.icon.setValue(DOMAIN_ICON);

      const districtTrait = new DistrictTrait();
      districtTrait.setZoomRange(-Infinity, Infinity);
      entityTrait.setTrait("district", districtTrait);

      const rootTile = GeoTile.root();
      const rootTileId = rootTile.x + "," + rootTile.y + "," + rootTile.z;
      const rootNodeUri = Uri.path(UriPath.of("/", "map", "/", rootTileId))

      const subdistricts = new GridGroup(rootTile, rootNodeUri);
      districtTrait.setChild("subdistricts", subdistricts);
    }
  }

}
