import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('simulation-component')
export class SimulationComponent extends LitElement {
  static styles = css`
    :host {
      display: flex;
    }

    .canvas {
      width: 100%;
      height: 100%;
      border: 1px solid #ccc;
      background: #f0f0f0;
    }
  `;

  @property({ type: Array<string> }) lightStatus: Array<string> = [];

  render() {
    return html` <canvas id="roadCanvas" class="canvas"></canvas> `;
  }

  firstUpdated() {
    this.initializeCanvas();
  }

  private initializeCanvas(): void {
    const canvas =
      this.shadowRoot?.querySelector<HTMLCanvasElement>('#roadCanvas');
    if (!canvas) {
      console.error('Canvas element not found.');
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context.');
      return;
    }

    // Load the road image
    const imagePath = 'src/assets/Road/intersection.jpg';
    const roadImg = new Image();
    roadImg.src = imagePath;

    // Load the green optimized image
    const greenImagePath = 'src/assets/TrafficLight/green.png';
    const greenImg = new Image();
    greenImg.src = greenImagePath;

    // Load the green optimized image
    const redImagePath = 'src/assets/TrafficLight/red.png';
    const redImg = new Image();
    redImg.src = redImagePath;

    // Load the green optimized image
    const yellowImagePath = 'src/assets/TrafficLight/yellow.png';
    const yellowImg = new Image();
    yellowImg.src = yellowImagePath;

    // Wait for both images to load
    let imagesLoaded = 0;
    const onImageLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === 4) {
        // Draw the background and the green image once both are loaded
        this.drawBackground(ctx, canvas, roadImg);
        this.drawTrafficLights(
          ctx,
          greenImg,
          redImg,
          yellowImg,
          this.lightStatus
        );
      }
    };

    roadImg.onload = onImageLoad;
    greenImg.onload = onImageLoad;
    redImg.onload = onImageLoad;
    yellowImg.onload = onImageLoad;

    // Handle errors loading images
    roadImg.onerror = () => {
      console.error('Failed to load the road image at path:', imagePath);
    };
    greenImg.onerror = () => {
      console.error('Failed to load the green image at path:', greenImagePath);
    };
    redImg.onerror = () => {
      console.error('Failed to load the red image at path:', redImagePath);
    };
    yellowImg.onerror = () => {
      console.error(
        'Failed to load the yellow image at path:',
        yellowImagePath
      );
    };
  }

  private drawBackground(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    roadImg: HTMLImageElement
  ): void {
    const imgWidth = roadImg.width;
    const imgHeight = roadImg.height;

    // Ensure the canvas dimensions are appropriate for the image tiling
    const canvasHeight = canvas.height;

    // Draw the road image at the top, 4 times
    for (let i = 0; i < 4; i++) {
      ctx.drawImage(roadImg, i * imgWidth, 0, imgWidth, imgHeight);
    }

    // Draw the road image at the bottom, 4 times
    for (let i = 0; i < 4; i++) {
      ctx.drawImage(
        roadImg,
        i * imgWidth,
        canvasHeight - imgHeight,
        imgWidth,
        imgHeight
      );
    }
  }

  private drawTrafficLights(
    ctx: CanvasRenderingContext2D,
    greenImg: HTMLImageElement,
    redImg: HTMLImageElement,
    yellowImg: HTMLImageElement,
    lightStatus: Array<string>
  ): void {
    const points = [
      { x: 10, y: 5 },
      { x: 85, y: 5 },
      { x: 160, y: 5 },
      { x: 235, y: 5 },
      { x: 10, y: 80 },
      { x: 85, y: 80 },
      { x: 160, y: 80 },
      { x: 235, y: 80 },
    ];

    // Loop through points and draw the corresponding light image
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const status = lightStatus[i];

      switch (status) {
        case 'red':
          ctx.drawImage(redImg, point.x, point.y);
          break;
        case 'green':
          ctx.drawImage(greenImg, point.x, point.y);
          break;
        case 'yellow':
          ctx.drawImage(yellowImg, point.x, point.y);
          break;
        default:
          console.error(`Invalid light status: ${status}`);
      }
    }
  }
}
