export interface IDistress {
    distressCode: number;
    // yikes!!! wtf
    distressDisplayString: string;
    quantityEnglish: number;
    quantityMetric: number;
    severity: string;
}

export interface ISectionDistresses {
    id: string;
    distressLoad: number;
    distressClimate: number;
    distressOther: number;
    distresses: IDistress[];
}

export interface IBranchDistresses {
    id: string;
    sections: ISectionDistresses[];
    distresses: IDistress[]; 
}

export interface IDistresses {
    branches: IBranchDistresses[];
}

export interface IGeometry {
    type: "Polygon";
    coordinates: [number, number][][];
}

export interface IFeature {
    type: string;
    properties: { [name: string]: any };
    geometry: IGeometry;
}

export interface IGeoJson {
    type: string;
    features: IFeature[];
}

export interface ITimelineBranch {
    id: string;
    pci: number[];
    sections: ITimelineSection[];
}

export interface ITimelineSection {
    id: string;
    pci: number[];
}

export interface ITimeline {
    branches: ITimelineBranch[];
}

export type DistressLookup = { [id: string]: ISectionDistresses };
export type TimelineLookup = { [id: string]: ITimelineSection };

