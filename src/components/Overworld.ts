import { CUSTOM_EVENTS } from "./CustomEvent";
import DirectionInput from "./DirectionInput";
import FixedStepEngine from "./FixedStepEngine";
import GameObject from "./GameObject";
import KeyPressListener from "./KeyPressListener";
import OverworldMap, { OverworldMapConfig } from "./OverworldMap";
import { OverworldMapsConfig } from "./OverworldMapsConfig";
import Person from "./Person";

export type OverworldConfig = {
  gameContainer: HTMLDivElement;
  canvas: HTMLCanvasElement;
  ctx2d: CanvasRenderingContext2D;
};

export default class Overworld {
  gameContainer: HTMLDivElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  map?: OverworldMap = undefined;
  directionInput?: DirectionInput;
  cameraPerson?: GameObject;

  engine: FixedStepEngine;
  constructor(config: OverworldConfig) {
    this.gameContainer = config.gameContainer;
    this.canvas = config.canvas;
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

  startMap(mapConfig: OverworldMapConfig) {
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    this.cameraPerson = this.map!.gameObjects.hero;
    this.map.mountObjects();
  }

  init() {
    this.startMap(OverworldMapsConfig.DemoRoom);
    this.cameraPerson = this.map!.gameObjects.hero;

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.bindActionInput();
    this.bindHeroPosiitonCheck();

    this.engine.start();
  }
}
