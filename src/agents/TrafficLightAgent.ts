class TrafficLightAgent {
  x: number;
  y: number;
  state: string;

  redImg: HTMLImageElement;
  yellowImg: HTMLImageElement;
  greenImg: HTMLImageElement;

  constructor(
    x: number,
    y: number,
    state: string,
    redImg: HTMLImageElement,
    yellowImg: HTMLImageElement,
    greenImg: HTMLImageElement
  ) {
    this.x = x;
    this.y = y;
    this.state = state;
    this.redImg = redImg;
    this.yellowImg = yellowImg;
    this.greenImg = greenImg;
  }

  // Method to draw the traffic light on the canvas
  draw(
    context: CanvasRenderingContext2D,
    targetWidth: number,
    targetHeight: number
  ): void {
    switch (this.state) {
      case 'red':
        context.drawImage(
          this.redImg,
          this.x,
          this.y,
          targetWidth,
          targetHeight
        );
        break;
      case 'yellow':
        context.drawImage(
          this.yellowImg,
          this.x,
          this.y,
          targetWidth,
          targetHeight
        );
        break;
      case 'green':
        context.drawImage(
          this.greenImg,
          this.x,
          this.y,
          targetWidth,
          targetHeight
        );
        break;
      default:
        console.error(`Invalid light status: ${this.state}`);
    }
  }

  // Method to update the state of the traffic light
  updateState(newState: string): void {
    this.state = newState;
  }
}

export default TrafficLightAgent;
