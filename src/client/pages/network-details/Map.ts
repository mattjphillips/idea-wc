
import { css, customElement, html, LitElement, property } from "lit-element";
import { IGeoJson, DistressLookup, TimelineLookup } from "../../DataFormats";

import Vector from "ol/source/Vector";
import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon";
import OpenLayersMap  from "ol/Map";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import proj4 from "proj4";
import SelectInteraction from "ol/interaction/Select";
import * as Condition from "ol/events/condition";

import "openlayers/css/ol.css";

class MapInstance {

    elem: HTMLDivElement;
    map: OpenLayersMap;
    vectorLayer?: VectorLayer;

    constructor() {
        const div = this.elem = document.createElement("div");
        div.style.width = '100%';
        div.style.height = '100%';
        div.style.display = 'block';

        this.map = new OpenLayersMap({
            target: div,
            layers: [
            new TileLayer({
                source: new OSM(),
            }),
            ],
            view: new View({
                center: [-9825000, 4880000],
                zoom: 13
            })
        });

        // This is an ugly hack, but transitions don't trigger resize updates.
        // Could be optimized by observing transition events, etc., but I'm lazy.
        let lastWidth = 0;
        setInterval(() => {
            if (div.offsetWidth !== lastWidth) {
                this.map.updateSize();
                lastWidth = div.offsetWidth;
            }
        }, 250);
    }

}


@customElement('map-panel')
export class MapPanel extends LitElement { 

    @property()
    sections: IGeoJson;

    @property()
    distresses?: DistressLookup;

    @property()
    timeline?: TimelineLookup;

    @property()
    selectedIDs?: string[];

    boundMap?: MapInstance;

    // Use a global map to avoid recreating/reloading the map as we destroy/create the component
    static mapInstance?: MapInstance;

    constructor() {
        super();
    }

    static get styles() {
        return css`
            :host {
                background: #cba;
            }
        `;
    }

    updated() {

        if (!MapPanel.mapInstance) {
            MapPanel.mapInstance = new MapInstance();
        }

        if (!this.boundMap) {
            this.boundMap = MapPanel.mapInstance;
            this.shadowRoot.getRootNode().appendChild(MapPanel.mapInstance.elem);
            this.boundMap.map.updateSize();
        }

        if (this.sections && !this.boundMap.vectorLayer) {
            const map = this.boundMap.map;

            const proj3435 = "+proj=tmerc +lat_0=36.66666666666666 +lon_0=-88.33333333333333 +k=0.9999749999999999 +x_0=300000.0000000001 +y_0=0 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs";
            const converter = proj4(proj3435, "GOOGLE");

            const features = this.sections.features.filter(f => f.geometry.type === "Polygon").map(f => {
                const pts = f.geometry.coordinates[0].map(c => converter.forward(c));
                const ids = f.properties["ids"] as { network: string, branch: string, section: string };
                const id = `${ids.branch}:${ids.section}`;
                const feature = new Feature({ id, geometry: new Polygon([pts])});
                feature.setId(id);
                return feature;
            });

            const styleGray = new Style({ fill: new Fill({ color: [128, 128, 128, 1] }) });

            const styleDarkGreen = new Style({ fill: new Fill({ color: [0, 128, 0, 1] }) });
            const styleLightGreen = new Style({ fill: new Fill({ color: [0, 192, 0, 1] }) });
            const styleYellow = new Style({ fill: new Fill({ color: [192, 192, 0, 1] }) });
            const styleOrange = new Style({ fill: new Fill({ color: [192, 128, 128, 1] }) });
            const styleDarkOrange = new Style({ fill: new Fill({ color: [128, 64, 0, 1] }) });
            const styleDarkRed = new Style({ fill: new Fill({ color: [128, 0, 0, 1] }) });
            const styleRed = new Style({ fill: new Fill({ color: [255, 0, 0, 1] }) });

            this.boundMap.vectorLayer = new VectorLayer({
                source: new Vector({ features }),
                style: (feature, resolution) => {
                    const id = feature.getId() as string;
                    if (!this.timeline || !this.timeline[id]) {
                        return styleGray;
                    }

                    if (this.selectedIDs && this.selectedIDs.length > 1) {
                        return this.selectedIDs.indexOf(id) >= 0 ? styleRed : styleGray;
                    }

                    const pci = this.timeline[id].pci[0];
                    if (pci >= 86) return styleDarkGreen;
                    if (pci >= 71) return styleLightGreen;
                    if (pci >= 56) return styleYellow;
                    if (pci >= 41) return styleOrange;
                    if (pci >= 26) return styleDarkOrange;
                    if (pci >= 11) return styleRed;
                    return styleDarkRed;
                }
            });
            map.addLayer(this.boundMap.vectorLayer);

            const hover = new SelectInteraction({
                condition: Condition.pointerMove
            })

            hover.on("select", evt => {
                if (evt.selected && evt.selected[0]) {
                    this.dispatchEvent(new CustomEvent("section-select", { composed: true, detail: { id: evt.selected[0].getId() }}))
                } else {
                    this.dispatchEvent(new CustomEvent("section-select", { composed: true, detail: { id: null }}))
                }
            });
            map.addInteraction(hover);
        }

        if (this.selectedIDs && this.selectedIDs.length > 1) {
            this.boundMap?.vectorLayer?.getSource().dispatchEvent('change');
        }
    }

    render() {
        return html`<link rel="stylesheet" href="css/ol.css"/>`;
    }
} 