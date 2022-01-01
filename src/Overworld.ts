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
      requestAnimationFrame(() => {
        step();
      });

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (this.map) {
        // establish camera person
        const cameraPerson = this.map.gameObjects.hero;

        //update game objects
        Object.values(this.map.gameObjects).forEach((gameObject) => {
          if (gameObject instanceof Person) {
            gameObject.update({
              arrow: this.directionInput!.direction,
              map: this.map!,
            });
          } else {
            gameObject.update();
          }
        });

        this.map.drawLowerImage(this.ctx, cameraPerson);

        //draw game objects
        Object.values(this.map.gameObjects)
          .sort((a, b) => a.y - b.y)
          .forEach((gameObject) => {
            gameObject.sprite.draw(this.ctx, cameraPerson);
          });

        this.map.drawUpperImage(this.ctx, cameraPerson);
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
    this.map.mountObjects();
    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();
    this.map.startCutScene([
      {who: "hero", type: "walk", direction: "down"},
      {who: "houseGuy", type: "walk", direction: "up"},
      {who: "hero", type: "walk", direction: "down"},
      {who: "npc1", type: "walk", direction: "up", time: 300},
      {who: "me", type: "walk", direction: "down"},
      {who: "me", type: "walk", direction: "down"},
      {who: "me", type: "walk", direction: "down"},
      {who: "me", type: "walk", direction: "right"},

      {type: "textMessage", text: "Hi!"},
    ]);
  }
}
