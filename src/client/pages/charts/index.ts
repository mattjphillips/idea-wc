import { css, customElement, html, LitElement } from "lit-element";

@customElement('charts-page')
export class ChartsPage extends LitElement { 

    static get styles() {
        return css`
            :host {
                position: absolute;
                inset: 0;
                padding: 2em;
            }
        `;
    }

    render() {
        return html`
            <h1>CHARTS</h1>
            <h2>All your chart belongs to us.</h2>
        `;
    }
} 


