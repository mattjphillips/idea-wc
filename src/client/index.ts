
import { css, customElement, html, LitElement, property, TemplateResult } from "lit-element";
import { IDistresses, IGeoJson, ITimeline, DistressLookup, TimelineLookup } from "./DataFormats";
import { RadioEvent } from "./widgets/Radio";
import { IMapTabState, ISectionFilter, IUIState, MainTab, MapSplit, SectionFilterType } from "./AppState";

import "./pages/home/index";
import "./pages/charts/index";
import "./pages/network-details/index";
import "./pages/miscellaneous/index";

import "./widgets/Radio";

@customElement('idea-app')
export class IDEAApp extends LitElement { 

    @property()
    client: string;

    @property()
    networkName: string;

    @property()
    baseURL: string;

    @property()
    sections?: IGeoJson;

    @property()
    branches?: IGeoJson;

    @property()
    networks?: IGeoJson;

    @property()
    distresses?: DistressLookup;

    @property()
    timeline?: TimelineLookup;

    @property()
    selectedIDs: string[] = [];

    @property()
    uiState: IUIState = { tab: MainTab.Charts }

    @property()
    mapState: IMapTabState = { split: MapSplit.Split };

    constructor() {
        super();
        window.onhashchange = () => this.processHash();
        this.processHash();
    }

    processHash() {
        const hash = window.location.hash.substring(1);
        this.uiState = { tab: hash as MainTab };
    }

    updated() {
        this.fetchData();
    }

    private fetched = false;

    fetchData() {
        if (this.fetched) return;
        this.fetched = true;

        fetch(`${this.baseURL}/distress.json`).then(req => req.json()).then(json => this.loadDistresses(json));
        fetch(`${this.baseURL}/section.geo.json`).then(req => req.json()).then(json => this.loadSectionGeoJson(json));
        fetch(`${this.baseURL}/branch.geo.json`).then(req => req.json()).then(json => this.loadBranchesGeoJson(json));
        fetch(`${this.baseURL}/network.geo.json`).then(req => req.json()).then(json => this.loadNetworksGeoJson(json));
        fetch(`${this.baseURL}/timeline_pci.json`).then(req => req.json()).then(json => this.loadTimeline(json));
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

    loadSectionGeoJson(raw: IGeoJson) {
        this.sections = raw;
    }

    loadBranchesGeoJson(raw: IGeoJson) {
        this.branches = raw;
    }

    loadNetworksGeoJson(raw: IGeoJson) {
        this.networks = raw;
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
                display: grid;
                grid-template-rows: 2em 1fr;
                grid-template-areas: "banner" "content";
                font-family: Arial, sans-serif;
            }

            banner h1 {
                font-size: 1em;
                color: white;
            }

            banner {
                grid-area: banner;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                background: black;
                padding: 0px 10px;
            }

            content-area {
                grid-area: content;
                position: relative;
            }            

            banner-menu {
                display: flex;
                flex-direction: row;
                align-items: center;
                color: white;
                gap: 0.5em;
            }

            banner-menu h1 {
                color: #ccc;
            }

        `;
    }
    
    private _filter: ISectionFilter;

    @property()
    get filter(): ISectionFilter {
        return this._filter;
    }
    set filter(value: ISectionFilter) {
        const oldValue = this._filter;
        this._filter = value;

        this.requestUpdate('filter', oldValue);

        if (this.timeline) {
            this.selectedIDs = Object.keys(this.timeline).filter(sectionID => {
                const pci = this.timeline[sectionID].pci[0];
                return value.filterType === SectionFilterType.PCIAbove ? pci > value.threshold : pci < value.threshold;
            })
        }
    }

    onChangeFilter(evt: CustomEvent) {
        this.filter = evt.detail as ISectionFilter;
    }

    setMenu(menu: string) {
        window.location.hash = menu;
    }

    onSectionSelect(evt: CustomEvent) {
        this.selectedIDs = evt.detail.id ? [evt.detail.id] : [];
    }

    onChangeMapSplit(evt: CustomEvent) {
        this.mapState = { ...this.mapState, split: evt.detail.split };
    }

    @property()
    mapSplit: string = "split";

    render() {
        let content: TemplateResult;

        if (this.uiState.tab === MainTab.Home) {
            content = html`<home-page></home-page>`;
        } else if (this.uiState.tab === MainTab.Charts) {
            content = html`<charts-page></charts-page>`;
        } else if (this.uiState.tab === MainTab.NetworkDetails) {
            content = html`<network-details-page
                networkName=${this.networkName}
                .timeline=${this.timeline}
                .distresses=${this.distresses}
                .sections=${this.sections}
                .selectedIDs=${this.selectedIDs}
                .state=${this.mapState}
                @section-select=${this.onSectionSelect} 
                @change-map-split=${this.onChangeMapSplit}
                @change-filter=${this.onChangeFilter}
                ></network-details-page>
            `;
        } else if (this.uiState.tab === MainTab.Miscellaneous) {
            content = html`<miscellaneous-page></miscellaneous-page>`;
        }

        return html`
            <banner>
                <h1>${this.client}</h1>
                <banner-menu>
                    <h1>Menu:</h1>
                    <radio-group selectedID="${this.uiState.tab}" @change=${(evt: RadioEvent) => window.location.hash = evt.radio.selectedID }}>
                        <radio-button value="${MainTab.Home}">Home</radio-button>
                        <radio-button value="${MainTab.Charts}">Charts</radio-button>
                        <radio-button value="${MainTab.NetworkDetails}">Network Details</radio-button>
                        <radio-button value="${MainTab.Miscellaneous}">Miscellaneous</radio-button>
                    </radio-group>
                </banner-menu>
            </banner>
            <content-area>${content}</content-area>
        `;
    }
} 
