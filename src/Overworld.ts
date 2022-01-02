type OverworldConfig = {
  element: HTMLElement;
};

class Overworld {
  element: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  map?: OverworldMap = undefined;
  directionInput?: DirectionInput;
  cameraPerson?: GameObject;

  engine: FixedStepEngine;
  constructor(config: OverworldConfig) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas")!;
    this.ctx = this.canvas.getContext("2d")!;

    this.engine = new FixedStepEngine(
      60,
      () => {
        this.updateOverworldObjects();
      },
      120,
      () => {
        this.renderOverworld();
      }
    );
  }

  private updateOverworldObjects() {
    Object.values(this.map!.gameObjects).forEach((gameObject) => {
      if (gameObject instanceof Person) {
        gameObject.update({
          arrow: this.directionInput!.direction,
          map: this.map!,
        });
      } else {
        gameObject.update();
      }
    });
  }

  private renderOverworld() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.map!.drawLowerImage(this.ctx, this.cameraPerson!);

    //draw game objects
    Object.values(this.map!.gameObjects)
      .sort((a, b) => a.y - b.y)
      .forEach((gameObject) => {
        gameObject.sprite.draw(this.ctx, this.cameraPerson!);
      });

    this.map!.drawUpperImage(this.ctx, this.cameraPerson!);
  }

  bindActionInput() {
    new KeyPressListener("KeyE", () => {
      this.map!.checkForActionCutscene();
    });
  }

  bindHeroPosiitonCheck() {
    document.addEventListener(CUSTOM_EVENTS.PersonWalkComplete, (event) => {
      if (event.detail.whoId === "hero") {
        this.map!.checkForFootstepCutscene();
      }
    });
  }

  init() {
    this.map = new OverworldMap(window.OverworldMaps.DemoRoom);
    this.map.mountObjects();

    this.cameraPerson = this.map!.gameObjects.hero;

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.bindActionInput();
    this.bindHeroPosiitonCheck();

    this.engine.start();

    // this.map.startCutScene([
    //   {who: "hero", type: "walk", direction: "down"},
    //   {who: "houseGuy", type: "walk", direction: "up"},
    //   {who: "hero", type: "walk", direction: "down"},
    //   {who: "npc1", type: "walk", direction: "up", time: 300},
    //   {who: "me", type: "walk", direction: "down"},
    //   {who: "me", type: "walk", direction: "down"},
    //   {who: "me", type: "walk", direction: "down"},
    //   {who: "me", type: "walk", direction: "right"},
    //   {type: "textMessage", text: "Hi!"},
    // ]);
  }
}
