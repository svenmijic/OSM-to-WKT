export interface OverpassApiResponse {
    version: number;
    generator: string;
    osm3s: Osm3s;
    elements: Element[];
}

interface Osm3s {
    timestamp_osm_base: Date;
    copyright: string;
}

interface Member {
    type: string;
    ref: number;
    role: string;
}

interface Tags {
    [key: string]: string;
}

interface Element {
    type: string;
    id: any;
    members: Member[];
    tags: Tags;
    lat?: number;
    lon?: number;
    nodes: any[];
}
