import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import './Simulation';
import './Visualization';
import './Console';

@customElement('main-page')
export class MainPage extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100vw;
    }

    .view {
      flex: 7;
      display: flex;
    }

    .simulation {
      flex: 7;
      border: 1px solid #ccc;
    }

    .visualization {
      flex: 3;
      border: 1px solid #ccc;
      padding: 0.5rem;
    }

    .console {
      flex: 3;
      border: 1px solid #ccc;
      padding: 0.5rem;
      overflow-y: auto;
    }
  `;

  render() {
    const lightStatus = [
      'green',
      'red',
      'yellow',
      'green',
      'red',
      'yellow',
      'green',
      'red',
    ];
    return html`
      <div class="view">
        <simulation-component
          class="simulation"
          .lightStatus=${lightStatus}
        ></simulation-component>
        <visualization-component
          class="visualization"
        ></visualization-component>
      </div>
      <console-component class="console"></console-component>
    `;
  }
}
