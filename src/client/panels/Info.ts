
import { css, customElement, html, LitElement, property, TemplateResult } from "lit-element";
import { DistressLookup, TimelineLookup } from "../DataFormats";

@customElement('info-panel')
export class InfoPanel extends LitElement { 

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
                background: #abc;
                padding: 1em;
                box-sizing: border-box;
                overflow: auto;
            }
        `;
    }

    onChangeFilter(evt: InputEvent) {
        if (evt.target instanceof HTMLSelectElement) {
            this.dispatchEvent(new CustomEvent("change-filter", { detail: { type: evt.target.value }}));
        }
    }

    render() {

        let selectedContent: TemplateResult;

        if (this.selectedIDs && this.selectedIDs.length > 0) {
            if (this.selectedIDs.length > 1) {
                selectedContent = html`
                    <h2>${this.selectedIDs.length} matching sections:</h2>
                    <p>${this.selectedIDs.join(", ")}</p>
                `;
            } else {

                const timeline = this.timeline && this.timeline[this.selectedIDs[0]];

                const distresses = this.distresses && this.distresses[this.selectedIDs[0]];
        
                let distressInfo: TemplateResult;
        
                if (distresses) {
                    distressInfo = html`
                        <table>
                        ${distresses.distresses.map(d => html`<tr><td>${d.distressDisplayString}</td><td>${d.quantityEnglish}</td></tr>`)}
                        </table>
                    `;
                } else {
                    distressInfo = html`<p>No distress info<p>`;
                }
        
                selectedContent = html`
                    <h1>${this.selectedIDs}</h1>
                    <p>PCI: ${timeline ? timeline.pci[0] : "dunno"}</p>
                    ${distressInfo}
                `;
            }
        } else {
            selectedContent = html`<h3>No section selected.</h3>`;
        }
        
        return html`
            <select @change=${this.onChangeFilter}>
                <option value="none">None</option>
                <option value="pci75">PCI above 75</option>
                <option value="below50">PCI below 50</option>
            </select>
            ${selectedContent}
        `;
    }
} 