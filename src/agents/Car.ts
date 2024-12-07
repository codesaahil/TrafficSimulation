class Car {
  x: number;
  y: number;
  speed: number;
  direction: string; // Direction of movement
  img: HTMLImageElement;

  constructor(
    x: number,
    y: number,
    speed: number,
    direction: string,
    img: HTMLImageElement
  ) {
    this.x = x;
    this.y = y;
    this.speed = speed;
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
  move(): void {
    switch (this.direction) {
      case 'left':
        this.x -= this.speed;
        break;
      case 'right':
        this.x += this.speed;
        break;
      case 'up':
        this.y -= this.speed;
        break;
      case 'down':
        this.y += this.speed;
        break;
    }
  }

  // Method to change the direction of the car
  updateDirection(newDirection: string): void {
    this.direction = newDirection;
  }
}

export default Car;
