type OverworldConfig = {
  element: HTMLElement;
};

class Overworld {
  element: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  map?: OverworldMap = undefined;
  directionInput?: DirectionInput;
  constructor(config: OverworldConfig) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas")!;
    this.ctx = this.canvas.getContext("2d")!;
  }

  startGameLoop() {
    const step = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (this.map) {
        // establish camera person
        const cameraPerson = this.map.gameObjects.hero;

        //update game objects
        Object.values(this.map.gameObjects).forEach((gameObject) => {
          if (gameObject instanceof Person) {
            gameObject.update({
              arrow: this.directionInput!.direction,
            });
          } else {
            gameObject.update();
          }
        });

        this.map.drawLowerImage(this.ctx, cameraPerson);

        //draw game objects
        Object.values(this.map.gameObjects).forEach((gameObject) => {
          gameObject.sprite.draw(this.ctx, cameraPerson);
        });

        this.map.drawUpperImage(this.ctx, cameraPerson);

        requestAnimationFrame(() => {
          step();
        });
      }
    };

    step();
  }

  /**
   * Draw to the canvas
   *
   * create a new image, assign a  source to that image
   * when that image is downloaded, we copy the info to the canvas
   *
   * the image is scaled via css
   */
  init() {
    this.map = new OverworldMap(window.OverworldMaps.DemoRoom);
    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();
  }
}
