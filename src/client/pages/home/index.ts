import { css, customElement, html, LitElement } from "lit-element";
import { MainTab } from "../../AppState";

@customElement('home-page')
export class HomePage extends LitElement { 

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
            <h1>HOME</h1>
            <div style="display:flex;flex-direction:row;gap:1em">
                <ul>
                <li><a href="#${MainTab.Charts}">Summary Charts</a> has your charts</li>
                <li><a href="#${MainTab.NetworkDetails}">Network Details</a> has your maps and what not</li>
                <li><a href="#${MainTab.Miscellaneous}">Miscellaneous</a> is just for fun</li>
                </ul>
                <img src="https://apps.appliedpavement.com/hosting/champaign_2020/home-page/images/city-bldg.jpg">
            </div>
        `;
    }
} 


