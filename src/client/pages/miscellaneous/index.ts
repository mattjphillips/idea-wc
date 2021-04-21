import { css, customElement, html, LitElement } from "lit-element";

@customElement('miscellaneous-page')
export class MiscellaneousPage extends LitElement { 

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
            <h1>MISCELLANEOUS</h1>
            <h2>The world's greatest collection of cat videos.</h2>
        `;
    }
} 


