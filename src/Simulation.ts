import { LitElement, html, css } from 'lit';
import {customElement} from 'lit/decorators.js';

@customElement('simulation-component')
export class SimulationComponent extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex: 1;
    }

    .canvas {
      flex: 7;
      border: 1px solid #ccc;
      background: #f0f0f0;
    }

    .visualization {
      flex: 3;
      border: 1px solid #ccc;
      background: #ffffff;
    }
  `;

  render() {
    return html`
      
    `;
  }
}
