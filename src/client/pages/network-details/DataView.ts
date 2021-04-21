
import { css, customElement, html, LitElement, property, TemplateResult } from "lit-element";
import { ISectionFilter, SectionFilterType } from "../../AppState";
import { DistressLookup, TimelineLookup } from "../../DataFormats";

let debounceTimer: NodeJS.Timeout | null = null;
function debounce(fn: () => void, delayMS: number) {
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
        debounceTimer = null;
        fn();
    }, delayMS);
}

@customElement('data-view-panel')
export class DataViewPanel extends LitElement { 

    @property()
    selectedIDs: string[];

    @property()
    distresses?: DistressLookup;

    @property()
    timeline?: TimelineLookup;

    constructor() {
        super();
    }

    static get styles() {
        return css`
            :host {
                background: black;
                color: white;
                padding: 1em;
                box-sizing: border-box;
                overflow: auto;
            }
        `;
    }

    updateFilter() {
        const filterType = this.shadowRoot.getElementById("filter-type") as HTMLSelectElement;
        const threshold = this.shadowRoot.getElementById("pci-threshold") as HTMLInputElement;

        const filter: ISectionFilter = {
            filterType: filterType.value as SectionFilterType,
            threshold: parseFloat(threshold.value)
        }
        this.dispatchEvent(new CustomEvent("change-filter", { composed: true, detail: filter }));
    }

    onChangeFilter(evt: InputEvent) {
        if (evt.target instanceof HTMLSelectElement) {
            this.updateFilter();
        }
    }

    onChangeThreshold(evt: InputEvent) {
        if (evt.target instanceof HTMLInputElement) {
            this.shadowRoot.getElementById("pci-threshold-value").innerHTML = evt.target.value;
            debounce(() => this.updateFilter(), 50);
        }
    }

    updated() {
        const threshold = this.shadowRoot.getElementById("pci-threshold") as HTMLInputElement;
        this.shadowRoot.getElementById("pci-threshold-value").innerHTML = threshold.value;
    }

    render() {
        return html`
            <h3>DATA VIEW</h3>
            <p>Filter Sections:</p>
            <select id="filter-type" @change=${this.onChangeFilter}>
                <option value="${SectionFilterType.PCIBelow}">PCI Below</option>
                <option value="${SectionFilterType.PCIAbove}">PCI Above</option>
            </select>
            <input id="pci-threshold" type="range" @input=${this.onChangeThreshold}></input><span id="pci-threshold-value"></span>

            <hr/>
            ${this.selectedIDs.length === 0 ? html`` 
            : this.selectedIDs.length === 1 ? html`<p>Selected: ${this.selectedIDs[0]}</p>` 
            : html`<p>${this.selectedIDs.length} sections selected<p>`}
        `;
    }
} 