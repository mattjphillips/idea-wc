
import { css, customElement, html, LitElement, property, TemplateResult } from "lit-element";
import { DistressLookup, TimelineLookup } from "../../DataFormats";

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
                box-sizing: border-box;
                overflow: auto;
            }

            .content-area {
                padding: 20px;
            }

            .data-table {
                background: white;
                border: 1px solid black;
                width: 100%;
            }
        `;
    }

    render() {

        let selectedContent: TemplateResult;

        if (this.selectedIDs && this.selectedIDs.length > 0) {
            if (this.selectedIDs.length > 1) {
                selectedContent = html`
                    <h2>${this.selectedIDs.length} matching sections:</h2>
                    <table>
                        <tr><th>Section</th><th>PCI</th></tr>
                        ${this.selectedIDs.map(id => {
                            return html`<tr><td>${id}</td><td>${this.timeline[id].pci[0]}</td></tr>`;
                        })}
                    </table>
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
        
        return html`<div class="content-area">${selectedContent}</div>`;
    }
} 