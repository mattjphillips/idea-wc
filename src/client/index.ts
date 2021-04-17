
import { css, customElement, html, LitElement, property } from "lit-element";

import { IDistresses, ISections, ITimeline, DistressLookup, TimelineLookup } from "./DataFormats";

import "./panels/Map.ts";
import "./panels/Info.ts";

@customElement('idea-app')
export class IDEAApp extends LitElement { 

    @property()
    sections?: ISections;

    @property()
    distresses?: DistressLookup;

    @property()
    timeline?: TimelineLookup;

    @property()
    selectedIDs?: string[];

    constructor() {
        super();

        this.fetchData();
    }

    fetchData() {
        fetch("data/distress.json").then(req => req.json()).then(json => this.loadDistresses(json));
        fetch("data/section.geo.json").then(req => req.json()).then(json => this.loadSections(json));
        fetch("data/timeline_pci.json").then(req => req.json()).then(json => this.loadTimeline(json));
    }

    loadDistresses(raw: IDistresses) {
        const distresses: DistressLookup = {};
        raw.branches.forEach(br => {
            br.sections.forEach(section => {
                distresses[`${br.id}:${section.id}`] = section;
            })
        })
        this.distresses = distresses;
    }

    loadSections(raw: ISections) {
        this.sections = raw;
    }

    loadTimeline(raw: ITimeline) {
        const timeline: TimelineLookup = {};
        raw.branches.forEach(br => {
            br.sections.forEach(section => {
                timeline[`${br.id}:${section.id}`] = section;
            })
        })
        this.timeline = timeline;
    }

    static get styles() {
        return css`
            :host {
                position: absolute;
                inset: 0;
                display: flex;
                flex-direction: row;
            }

            map-panel {
                flex: 1 1;
            }

            info-panel {
                width: 20em;
            }
        `;
    }
    
    onSectionSelect(evt: CustomEvent) {
        this.selectedIDs = evt.detail.id ? [evt.detail.id] : [];
    }

    onChangeFilter(evt: CustomEvent) {
        if (evt.detail.type != "none" && this.timeline) {
            if (evt.detail.type === "pci75") {
                this.selectedIDs = Object.keys(this.timeline).filter(t => this.timeline[t].pci[0] >= 75);
            } else if (evt.detail.type === "below50") {
                this.selectedIDs = Object.keys(this.timeline).filter(t => this.timeline[t].pci[0] < 50);
            }
        }
    }

    render() {
        return html`
            <map-panel 
                .timeline=${this.timeline} 
                .distresses=${this.distresses} 
                @section-select=${this.onSectionSelect} 
                .sections=${this.sections}
                .selectedIDs=${this.selectedIDs ?? []}
            ></map-panel>
            <info-panel 
                @change-filter=${this.onChangeFilter}
                .timeline=${this.timeline} 
                .distresses=${this.distresses} 
                .selectedIDs=${this.selectedIDs ?? []}
            ></info-panel>
        `;
    }
} 