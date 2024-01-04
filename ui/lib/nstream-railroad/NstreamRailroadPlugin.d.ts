import { DomainTrait, EntityPlugin, EntityTrait } from "@swim/platform";
export declare class NstreamRailroadPlugin extends EntityPlugin {
    get id(): string;
    get title(): string;
    injectEntity(entityTrait: EntityTrait, domainTrait: DomainTrait): void;
}
