import { LitElement, html, css } from 'lit';
import {customElement} from 'lit/decorators.js';

@customElement('visualization-component')
export class VisualizationComponent extends LitElement {
  static styles = css`
    :host {
      display: block;
      background: #e3e3e3;
      border: 1px solid #ccc;
      padding: 1rem;
    }
  `;

  render() {
    return html`
      <div>Visualization</div>
    `;
  }
}
