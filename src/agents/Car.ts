import TrafficLightAgent from './TrafficLightAgent';

class Car {
  x: number;
  y: number;
  speed: number = 1;
  direction: string; // Direction of movement
  road: string;
  img: HTMLImageElement;

  constructor(
    x: number,
    y: number,
    direction: string,
    road: string,
    img: HTMLImageElement
  ) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.road = road;
    this.img = img;
  }

  // Method to draw the car on the canvas with rotation based on direction
  draw(context: CanvasRenderingContext2D): void {
    context.save(); // Save the current state of the canvas

    // Move the canvas origin to the car's position
    context.translate(this.x, this.y);

    // Rotate based on the direction
    switch (this.direction) {
      case 'left':
        context.rotate((-90 * Math.PI) / 180); // Rotate 90 degrees to the left
        break;
      case 'right':
        context.rotate((90 * Math.PI) / 180); // Rotate 90 degrees to the right
        break;
      case 'down':
        context.rotate(Math.PI); // Rotate 180 degrees
        break;
      case 'up':
      default:
        // No rotation needed
        break;
    }

    // Draw the car image at the adjusted position
    // Adjust to center the image at the position (optional based on your needs)
    context.drawImage(this.img, -this.img.width / 2, -this.img.height / 2);

    context.restore(); // Restore the canvas state
  }

  // Method to update the position of the car based on its direction and speed
  move(trafficAgents: Array<TrafficLightAgent>): void {
    switch (this.direction) {
      case 'left': {
        const leftStopPostion = this.determineLeftStopPosition(trafficAgents);
        if (this.x === leftStopPostion) {
          return;
        }
        this.x -= this.speed;
        break;
      }
      case 'right': {
        const rightStopPostion = this.determineRightStopPosition(trafficAgents);
        if (this.x === rightStopPostion) {
          return;
        }
        this.x += this.speed;
        break;
      }
      case 'up': {
        const upStopPostion = this.determineUpStopPosition(trafficAgents);
        if (this.y === upStopPostion) {
          return;
        }
        this.y -= this.speed;
        break;
      }
      case 'down': {
        const downStopPostion = this.determineDownStopPosition(trafficAgents);
        if (this.y === downStopPostion) {
          return;
        }
        this.y += this.speed;
        break;
      }
      default:
        return;
    }
  }

  // Method to change the direction of the car
  updateDirection(newDirection: string): void {
    this.direction = newDirection;
  }

  determineUpStopPosition(trafficAgents: Array<TrafficLightAgent>): number {
    const forwardAgent = this.determineForwardAgent();
    if (trafficAgents[forwardAgent - 1].state === 'green') {
      return -1;
    }
    if ([5, 6, 7, 8].includes(forwardAgent)) {
      return 575;
    }
    if ([1, 2, 3, 4].includes(forwardAgent)) {
      return 235;
    }
    return -1;
  }

  determineDownStopPosition(trafficAgents: Array<TrafficLightAgent>): number {
    const forwardAgent = this.determineForwardAgent();
    if (trafficAgents[forwardAgent - 1].state === 'green') {
      return -1;
    }
    if ([5, 6, 7, 8].includes(forwardAgent)) {
      return 445;
    }
    if ([1, 2, 3, 4].includes(forwardAgent)) {
      return 105;
    }
    return -1;
  }

  determineLeftStopPosition(trafficAgents: Array<TrafficLightAgent>): number {
    const forwardAgent = this.determineForwardAgent();
    if (trafficAgents[forwardAgent - 1].state === 'red') {
      return -1;
    }
    if ([4, 8].includes(forwardAgent)) {
      return 1260;
    }
    if ([3, 7].includes(forwardAgent)) {
      return 920;
    }
    if ([2, 6].includes(forwardAgent)) {
      return 580;
    }
    if ([1, 5].includes(forwardAgent)) {
      return 240;
    }
    return -1;
  }

  determineRightStopPosition(trafficAgents: Array<TrafficLightAgent>): number {
    const forwardAgent = this.determineForwardAgent();
    if (trafficAgents[forwardAgent - 1].state === 'red') {
      return -1;
    }
    if ([4, 8].includes(forwardAgent)) {
      return 1130;
    }
    if ([3, 7].includes(forwardAgent)) {
      return 790;
    }
    if ([2, 6].includes(forwardAgent)) {
      return 445;
    }
    if ([1, 5].includes(forwardAgent)) {
      return 105;
    }
    return -1;
  }

  determineForwardAgent(): number {
    switch (this.direction) {
      case 'left':
        return this.checkLeft();
      case 'right':
        return this.checkRight();
      case 'up':
        return this.checkUp();
      case 'down':
        return this.checkDown();
      default:
        return 0;
    }
  }

  private checkLeft(): number {
    switch (this.road) {
      case '1':
        if (this.x < 240) {
          return 0;
        }
        if (this.x < 580) {
          return 1;
        }
        if (this.x < 920) {
          return 2;
        }
        if (this.x < 1260) {
          return 3;
        }
        return 4;
      case '2':
        if (this.x < 240) {
          return 0;
        }
        if (this.x < 580) {
          return 5;
        }
        if (this.x < 920) {
          return 6;
        }
        if (this.x < 1260) {
          return 7;
        }
        return 8;
      default:
        return 0;
    }
  }

  private checkRight(): number {
    switch (this.road) {
      case '1':
        if (this.x > 1130) {
          return 0;
        }
        if (this.x > 790) {
          return 4;
        }
        if (this.x > 445) {
          return 3;
        }
        if (this.x > 105) {
          return 2;
        }
        return 1;
      case '2':
        if (this.x > 1130) {
          return 0;
        }
        if (this.x > 790) {
          return 8;
        }
        if (this.x > 445) {
          return 7;
        }
        if (this.x > 105) {
          return 6;
        }
        return 5;
      default:
        return 0;
    }
  }

  private checkUp(): number {
    switch (this.road) {
      case '1':
        if (this.y < 235) {
          return 0;
        }
        if (this.y < 575) {
          return 1;
        }
        return 5;
      case '2':
        if (this.y < 235) {
          return 0;
        }
        if (this.y < 575) {
          return 2;
        }
        return 6;
      case '3':
        if (this.y < 235) {
          return 0;
        }
        if (this.y < 575) {
          return 3;
        }
        return 7;
      case '4':
        if (this.y < 235) {
          return 0;
        }
        if (this.y < 575) {
          return 4;
        }
        return 8;
      default:
        return 0;
    }
  }

  private checkDown(): number {
    switch (this.road) {
      case '1':
        if (this.y > 445) {
          return 0;
        }
        if (this.y > 105) {
          return 5;
        }
        return 1;
      case '2':
        if (this.y > 445) {
          return 0;
        }
        if (this.y > 105) {
          return 6;
        }
        return 2;
      case '3':
        if (this.y > 445) {
          return 0;
        }
        if (this.y > 105) {
          return 7;
        }
        return 3;
      case '4':
        if (this.y > 445) {
          return 0;
        }
        if (this.y > 105) {
          return 8;
        }
        return 4;
      default:
        return 0;
    }
  }
}

export default Car;
