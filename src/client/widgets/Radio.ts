import { css, customElement, html, LitElement, property, TemplateResult } from "lit-element";

export class RadioEvent extends Event {
    constructor(type: string, public radio: RadioGroup) {
        super(type);
    }
}

@customElement('radio-group')
export class RadioGroup extends LitElement { 

    @property()
    selectedID: string | null = null;

    constructor() {
        super();
        this.addEventListener("mousedown", evt => {
            if (evt.target instanceof RadioButton) {
                this.selectedID = evt.target.value;
                this.dispatchEvent(new RadioEvent("change", this));
            }
        });
    }

    static get styles() {
        return css`
            :host {
                display: flex;
                flex-direction: row;
                gap: 0;
                font-size: 0.8em;
            }
        `;
    }

    updated() {
        this.querySelectorAll("radio-button").forEach((btn: RadioButton) => btn.classList.toggle("selected", btn.value === this.selectedID));
    }

    render() {
        return html`<slot></slot>`;
    }
} 

@customElement('radio-button')
export class RadioButton extends LitElement { 

    @property()
    value: string = "";

    constructor() {
        super();
    }

    static get styles() {
        return css`
            :host {
                padding: 2px 1em;
                margin-left: -1px;
                border: 1px solid white;
                cursor: pointer;
            }

            :host(.selected) {
                background: blue;
            }
        `;
    }

    render() {
        return html`<slot></slot>`;
    }
} 