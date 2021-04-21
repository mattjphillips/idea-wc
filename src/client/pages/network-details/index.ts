import { css, customElement, html, LitElement, property, TemplateResult } from "lit-element";
import { classMap } from 'lit-html/directives/class-map';
import { DistressLookup, IGeoJson, TimelineLookup } from "../../DataFormats";
import { IMapTabState, MapSplit } from "../../AppState";

import { RadioEvent } from "../../widgets/Radio";

import "./DataView";
import "./Info";
import "./Map";

@customElement('network-details-page')
export class NetworkDetailsPage extends LitElement { 

    @property()
    sections: IGeoJson;

    @property()
    distresses?: DistressLookup;

    @property()
    timeline?: TimelineLookup;

    @property()
    selectedIDs: string[] = [];

    @property()
    state: IMapTabState = { split: MapSplit.Split };

    static get styles() {
        return css`
            :host {
                position: absolute;
                inset: 0;
                display: grid;
                grid-template-columns: 20em 1fr;
                grid-template-rows: 2em 1fr;
                grid-template-areas: "dataview title" "dataview maphorz";
            }

            data-view-panel {
                grid-area: dataview;
            }

            display-view {
                display: flex;
                flex-direction: row;
                align-items: center;
                color: white;
                gap: 0.5em;
            }

            display-view h1 {
                color: #ccc;
            }

            map-horz {
                grid-area: maphorz;
                display: flex;
                flex-direction: row;
                overflow: hidden;
            }

            map-horz.show-split map-panel {
                width: 50%;
            }

            map-horz.show-map map-panel {
                width: 100%;
            }

            map-horz.show-data map-panel {
                width: 0;
            }

            map-title {
                grid-area: title;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                background: black;
                padding: 0px 10px;
            }

            map-title h1 {
                font-size: 1em;
                color: white;
            }

            map-panel {
                width: 50%;
                transition: width 0.25s;
            }

            info-panel {
                flex: 1 1;
            }
        `;
    }

    onSelectMapSplit(evt: RadioEvent) {
        this.dispatchEvent(new CustomEvent("change-map-split", { detail: { split: evt.radio.selectedID }}));
    }

    render() {
        return html`
            <data-view-panel 
                .timeline=${this.timeline} 
                .distresses=${this.distresses} 
                .selectedIDs=${this.selectedIDs ?? []}
            ></data-view-panel>
            <map-title>
                <h1>CHAMPAIGN</h1>
                <display-view>
                    <h1>DISPLAY VIEW:</h1>
                    <radio-group selectedID="${this.state.split}" @change=${this.onSelectMapSplit}>
                        <radio-button value="${MapSplit.MapOnly}">Map</radio-button>
                        <radio-button value="${MapSplit.Split}">Split</radio-button>
                        <radio-button value="${MapSplit.DataOnly}">Data</radio-button>
                    </radio-group>
                </display-view>
            </map-title>
            <map-horz class=${classMap({ 
                    "show-map": this.state.split === MapSplit.MapOnly, 
                    "show-split": this.state.split === MapSplit.Split, 
                    "show-data": this.state.split === MapSplit.DataOnly
                } )}>
                <map-panel 
                    .timeline=${this.timeline} 
                    .distresses=${this.distresses} 
                    .sections=${this.sections}
                    .selectedIDs=${this.selectedIDs}
                ></map-panel>
                <info-panel 
                    .timeline=${this.timeline} 
                    .distresses=${this.distresses} 
                    .selectedIDs=${this.selectedIDs}
                ></info-panel>
            </map-horz>
        `;
    }
} 


