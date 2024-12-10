import TrafficLightAgent from './TrafficLightAgent';

class Car {
  x: number;
  y: number;
  speed: number = 1;
  direction: string;
  img: HTMLImageElement;

  constructor(x: number, y: number, direction: string, img: HTMLImageElement) {
    this.x = x;
    this.y = y;
    this.direction = direction;
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
  move(trafficAgents: Array<TrafficLightAgent>, allCars: Array<Car>): void {
    switch (this.direction) {
      case 'left': {
        this.speed = this.determineSpeed(trafficAgents, allCars);
        this.x -= this.speed;
        break;
      }
      case 'right': {
        this.speed = this.determineSpeed(trafficAgents, allCars);
        this.x += this.speed;
        break;
      }
      case 'up': {
        this.speed = this.determineSpeed(trafficAgents, allCars);
        this.y -= this.speed;
        break;
      }
      case 'down': {
        this.speed = this.determineSpeed(trafficAgents, allCars);
        this.y += this.speed;
        break;
      }
      default:
        return;
    }
  }

  updateDirection(newDirection: string): void {
    this.direction = newDirection;
  }

  determineSpeed(
    trafficAgents: Array<TrafficLightAgent>,
    allCars: Array<Car>
  ): number {
    if (
      this.direction === 'right' &&
      this.x === 480 &&
      trafficAgents[0].state === 'green'
    ) {
      return 0;
    }

    if (
      this.direction === 'left' &&
      this.x === 880 &&
      trafficAgents[3].state === 'green'
    ) {
      return 0;
    }

    if (
      this.direction === 'up' &&
      this.y === 460 &&
      trafficAgents[2].state === 'red'
    ) {
      return 0;
    }

    if (
      this.direction === 'down' &&
      this.y === 220 &&
      trafficAgents[1].state === 'red'
    ) {
      return 0;
    }

    for (const car of allCars) {
      if (this.isCarAtFront(car) && car.speed === 0) {
        return 0;
      }
    }

    return 1;
  }

  private isCarAtFront(car: Car) {
    if (car.direction !== this.direction) {
      return false;
    }

    switch (this.direction) {
      case 'up':
        return car.y === this.y - 70;
      case 'down':
        return car.y === this.y + 70;
      case 'left':
        return car.x === this.x - 70;
      case 'right':
        return car.x === this.x + 70;
    }
  }
}

export default Car;
