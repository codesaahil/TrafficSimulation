import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('console-component')
export class ConsoleComponent extends LitElement {
  static styles = css`
    :host {
      display: block;
      overflow-y: auto;
      background: #f8f9fa;
      color: #333;
      font-family: monospace;
      padding: 0.5rem;
      border-top: 1px solid #ddd;
    }
  `;

  render() {
    return html` <div>Console Output</div> `;
  }
}
