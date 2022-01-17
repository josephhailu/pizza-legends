import {CUSTOM_EVENTS} from "./CustomEvent";
import DirectionInput from "./DirectionInput";
import FixedStepEngine from "./FixedStepEngine";
import GameObject from "./GameObject";
import KeyPressListener from "./KeyPressListener";
import OverworldMap from "./OverworldMap";
import {OverworldMapsConfig, OverworldMapConfig} from "./OverworldMapsConfig";
import Person from "./Person";

export type OverworldConfig = {
  gameContainer: HTMLDivElement;
  canvas: HTMLCanvasElement;
};

export default class Overworld {
  gameContainer: HTMLDivElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  map?: OverworldMap = undefined;
  directionInput?: DirectionInput;
  cameraPerson?: GameObject;

  engine: FixedStepEngine | undefined;
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
    if (this.map) {
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
    }
  }

  private renderOverworld() {
    if (this.map) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.map.drawLowerImage(this.ctx, this.cameraPerson!);

      //draw game objects
      Object.values(this.map!.gameObjects)
        .sort((a, b) => a.y - b.y)
        .forEach((gameObject) => {
          gameObject.sprite.draw(this.ctx, this.cameraPerson!);
        });

      this.map.drawUpperImage(this.ctx, this.cameraPerson!);
    }
  }

  bindActionInput() {
    if (this.map) {
      new KeyPressListener("KeyE", () => {
        this.map!.checkForActionCutscene();
      });
    }
  }

  bindHeroPosiitonCheck() {
    if (this.map) {
      document.addEventListener(CUSTOM_EVENTS.PersonWalkComplete, (event) => {
        if (event.detail.whoId === "hero") {
          this.map!.checkForFootstepCutscene();
        }
      });
    }
  }

  startMap(mapConfig: OverworldMapConfig) {
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    this.cameraPerson = this.map!.gameObjects.hero;
    this.map.mountObjects();
  }

  init() {
    if (this.engine) {
      this.startMap(OverworldMapsConfig.DemoRoom);
      this.cameraPerson = this.map!.gameObjects.hero;

      this.directionInput = new DirectionInput();
      this.directionInput.init();

      this.bindActionInput();
      this.bindHeroPosiitonCheck();

      this.engine.start();
    }
  }

  stop() {
    if (this.engine) {
      this.engine.stop();
      this.engine = undefined;
      this.map = undefined;
      this.cameraPerson = undefined;
    }
  }
}
