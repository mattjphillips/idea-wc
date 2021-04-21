

export enum MainTab {
    Home = "home",
    Charts = "charts",
    NetworkDetails = "network-details",
    Miscellaneous = "miscellaneous"
}

export enum MapSplit {
    MapOnly = "map-only",
    Split = "split",
    DataOnly = "data-only"
}

export interface IUIState {
    tab: MainTab;
}

export interface IMapTabState {
    split: MapSplit;
}

export enum SectionFilterType {
    PCIBelow = "pci-below",
    PCIAbove = "pci-above"
}

export interface ISectionFilter {
    readonly filterType: SectionFilterType;
    readonly threshold: number;
}


