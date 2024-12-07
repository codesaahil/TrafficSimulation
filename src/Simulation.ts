import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import TrafficLightAgent from './agents/TrafficLightAgent';
import Car from './agents/Car';

@customElement('simulation-component')
export class SimulationComponent extends LitElement {
  static readonly styles = css`
    :host {
      display: flex;
    }

    .this.canvas {
      width: 100%;
      height: 100%;
      border: 1px solid #ccc;
      background: #f0f0f0;
    }
  `;

  private animationFrameId: number | null = null;
  private isRunning: boolean = false;
  private timeStep: number = 0;

  private canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly roadImg: HTMLImageElement = new Image();
  private readonly redImg: HTMLImageElement = new Image();
  private readonly greenImg: HTMLImageElement = new Image();
  private readonly yellowImg: HTMLImageElement = new Image();
  private readonly carImg: HTMLImageElement = new Image();

  private trafficLightAgents: Array<TrafficLightAgent> = [];
  private cars: Array<Car> = [];

  render() {
    return html` <canvas id="roadCanvas" class="canvas"></canvas>`;
  }

  firstUpdated() {
    this.initializeCanvas();
  }

  private initializeCanvas(): void {
    this.canvas =
      this.shadowRoot?.querySelector<HTMLCanvasElement>('#roadCanvas');
    if (!this.canvas) {
      console.error('this.canvas element not found.');
      return;
    }
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      console.error('Failed to get this.canvas context.');
      return;
    }

    this.synchronizeCanvas();

    this.canvas.addEventListener('click', (event) => {
      const rect = this.canvas.getBoundingClientRect(); // Get canvas position relative to the viewport
      const x = event.clientX - rect.left; // X relative to the canvas
      const y = event.clientY - rect.top; // Y relative to the canvas

      console.log(`Clicked at X: ${x}, Y: ${y}`);

      // Check if the click is within the image's bounds (100, 100, 200, 150)
      if (x >= 100 && x <= 300 && y >= 100 && y <= 250) {
        console.log('You clicked inside the image area!');
      }
    });

    // Load the road image
    const imagePath = 'src/assets/Road/intersection.jpeg';
    this.roadImg.src = imagePath;

    // Load the green optimized image
    const greenImagePath = 'src/assets/TrafficLight/green.png';
    this.greenImg.src = greenImagePath;

    // Load the green optimized image
    const redImagePath = 'src/assets/TrafficLight/red.png';
    this.redImg.src = redImagePath;

    // Load the green optimized image
    const yellowImagePath = 'src/assets/TrafficLight/yellow.png';
    this.yellowImg.src = yellowImagePath;

    // Load the car optimized image
    const carImagePath = 'src/assets/Car/compact_red.png';
    this.carImg.src = carImagePath;

    // Wait for both images to load
    let imagesLoaded = 0;
    const onImageLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === 5) {
        this.startGameLoop();
      }
    };

    this.roadImg.onload = onImageLoad;
    this.greenImg.onload = onImageLoad;
    this.redImg.onload = onImageLoad;
    this.yellowImg.onload = onImageLoad;
    this.carImg.onload = onImageLoad;

    // Handle errors loading images
    this.roadImg.onerror = () => {
      console.error('Failed to load the road image at path:', imagePath);
    };
    this.greenImg.onerror = () => {
      console.error('Failed to load the green image at path:', greenImagePath);
    };
    this.redImg.onerror = () => {
      console.error('Failed to load the red image at path:', redImagePath);
    };
    this.yellowImg.onerror = () => {
      console.error(
        'Failed to load the yellow image at path:',
        yellowImagePath
      );
    };
  }

  private synchronizeCanvas(): void {
    // Get the CSS size of the this.canvas
    const styleWidth = this.canvas.clientWidth; // CSS width
    const styleHeight = this.canvas.clientHeight; // CSS height

    // Set the resolution of the this.canvas to match the CSS size
    this.canvas.width = styleWidth;
    this.canvas.height = styleHeight;

    console.log(this.canvas.width, this.canvas.height);
  }

  private drawBackground(): void {
    const imgWidth = this.roadImg.width; // 2000
    const imgHeight = this.roadImg.height; // 2008
    const targetWidth = 341; // Desired width
    const targetHeight = 341; // Desired height

    // Ensure the this.canvas dimensions are appropriate for the image tiling
    const canvasHeight = this.canvas.height;

    // Scale and draw the road image at the top, 4 times
    for (let i = 0; i < 4; i++) {
      this.ctx.drawImage(
        this.roadImg, // Source image
        0,
        0,
        imgWidth,
        imgHeight, // Source coordinates and dimensions
        i * targetWidth,
        0,
        targetWidth,
        targetHeight // Target coordinates and dimensions
      );
    }

    // Scale and draw the road image at the bottom, 4 times
    for (let i = 0; i < 4; i++) {
      this.ctx.drawImage(
        this.roadImg, // Source image
        0,
        0,
        imgWidth,
        imgHeight, // Source coordinates and dimensions
        i * targetWidth,
        canvasHeight - targetHeight,
        targetWidth,
        targetHeight // Target coordinates and dimensions
      );
    }
  }

  private drawTrafficLights(): void {
    const points = [
      { x: 70, y: 20 },
      { x: 410, y: 20 },
      { x: 750, y: 20 },
      { x: 1090, y: 20 },
      { x: 70, y: 360 },
      { x: 410, y: 360 },
      { x: 750, y: 360 },
      { x: 1090, y: 360 },
    ];

    const targetWidth = 50;
    const targetHeight = 100;

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

    this.trafficLightAgents = points.map((point, i) => {
      return new TrafficLightAgent(
        point.x,
        point.y,
        i + 1,
        lightStatus[i],
        this.redImg,
        this.yellowImg,
        this.greenImg
      );
    });

    this.trafficLightAgents.forEach((agent: TrafficLightAgent) =>
      agent.draw(this.ctx, targetWidth, targetHeight)
    );
  }

  private spawnCarRandomly(): void {
    const rightPoints = [
      { x: 0, y: 153, road: '1' },
      { x: 0, y: 493, road: '2' },
    ];

    const leftPoints = [
      { x: this.canvas.width, y: 188, road: '1' },
      { x: this.canvas.width, y: 527, road: '2' },
    ];

    const upPoints = [
      { x: 153, y: this.canvas.height, road: '1' },
      { x: 493, y: this.canvas.height, road: '2' },
      { x: 835, y: this.canvas.height, road: '3' },
      { x: 1177, y: this.canvas.height, road: '4' },
    ];

    const downPoints = [
      { x: 190, y: 0, road: '1' },
      { x: 530, y: 0, road: '2' },
      { x: 872, y: 0, road: '3' },
      { x: 1212, y: 0, road: '4' },
    ];

    // Randomly decide spawn side
    const spawnSides = ['right', 'left', 'up', 'down'];
    const spawnSide = spawnSides[Math.floor(Math.random() * spawnSides.length)];

    let spawnPoints;
    let direction;

    switch (spawnSide) {
      case 'right':
        spawnPoints = rightPoints;
        direction = 'right';
        break;
      case 'left':
        spawnPoints = leftPoints;
        direction = 'left';
        break;
      case 'up':
        spawnPoints = upPoints;
        direction = 'up';
        break;
      case 'down':
        spawnPoints = downPoints;
        direction = 'down';
        break;
      default:
        throw new Error('Invalid spawn side'); // To satisfy TypeScript strict mode
    }

    const spawnPoint =
      spawnPoints[Math.floor(Math.random() * spawnPoints.length)]; // Randomly pick a spawn point

    const car = new Car(
      spawnPoint.x,
      spawnPoint.y,
      direction,
      spawnPoint.road,
      this.carImg
    );

    this.cars.push(car);
  }

  private moveCars(): void {
    this.cars = this.cars.filter((car) => {
      if (
        car.x + this.carImg.width < 0 ||
        car.x - this.carImg.width > this.canvas.width
      ) {
        return false;
      }
      if (
        car.y + this.carImg.height < 0 ||
        car.y - this.carImg.width > this.canvas.height
      ) {
        return false;
      }
      return true;
    });
    this.cars.forEach((car) => {
      car.move(this.trafficLightAgents);
      car.draw(this.ctx);
    });
  }

  private startGameLoop(): void {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    const update = () => {
      if (this.isRunning) {
        this.timeStep++;
        if (this.timeStep % 80 === 0) {
          this.spawnCarRandomly();
        }
        this.draw();
        this.animationFrameId = requestAnimationFrame(update);
      }
    };
    update();
  }

  private stopGameLoop(): void {
    this.isRunning = false;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopGameLoop(); // Stop when component is removed
  }

  private draw(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawBackground();
    this.drawTrafficLights();
    this.moveCars();
  }
}
