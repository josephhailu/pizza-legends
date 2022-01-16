import GameObject, { Behaviour } from "./GameObject";
import Overworld from "./Overworld";
import OverworldEvent from "./OverworldEvent";
import Person, { Directions } from "./Person";
import { UTILS } from "./utils";

export type Walls = {
  [coordinateString: string]: boolean;
};

export type CutsceneSpaces = Record<string, Record<"events", Behaviour[]>[]>;

export type OverworldMapConfig = {
  gameObjects: Record<string, GameObject>;
  lowerSrc: string;
  upperSrc: string;
  walls?: Walls;
  cutsceneSpaces?: CutsceneSpaces;
};
export default class OverworldMap {
  overworld?: Overworld;
  gameObjects: Record<string, GameObject>;
  lowerImage: HTMLImageElement;
  upperImage: HTMLImageElement;
  walls: Walls;
  isCutScenePlaying: boolean;
  cutsceneSpaces: CutsceneSpaces;
  constructor(config: OverworldMapConfig) {
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;
    this.isCutScenePlaying = false;
  }

  drawLowerImage(ctx: CanvasRenderingContext2D, cameraPerson: GameObject) {
    ctx.drawImage(
      this.lowerImage,
      UTILS.withGrid(UTILS.cameraPersonOffset.x) - cameraPerson.x,
      UTILS.withGrid(UTILS.cameraPersonOffset.y) - cameraPerson.y
    );
  }
  drawUpperImage(ctx: CanvasRenderingContext2D, cameraPerson: GameObject) {
    ctx.drawImage(
      this.upperImage,
      UTILS.withGrid(UTILS.cameraPersonOffset.x) - cameraPerson.x,
      UTILS.withGrid(UTILS.cameraPersonOffset.y) - cameraPerson.y
    );
  }
  isSpaceTaken(currentX: number, currentY: number, direction: Directions) {
    const { x, y } = UTILS.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach((gameObjectKey) => {
      //TODO: determine if we should mount
      let gameObject = this.gameObjects[gameObjectKey];
      gameObject.id = gameObjectKey;

      gameObject.mount(this);
    });
  }

  async startCutScene(events: Behaviour[]) {
    this.isCutScenePlaying = true;
    for (let i = 0; i < events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      });
      await eventHandler.init();
    }

    this.isCutScenePlaying = false;

    //reset gameobjects, and do behaviour
    Object.values(this.gameObjects).forEach((gameObject) => {
      if (gameObject instanceof Person) {
        gameObject.doBehaviourEvent(this, gameObject.isStanding);
      } else {
        gameObject.doBehaviourEvent(this);
      }
    });
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = UTILS.nextPosition(hero.x, hero.y, hero.direction);

    const match = Object.values(this.gameObjects).find((gameObject) => {
      return (
        `${gameObject.x},${gameObject.y}` === `${nextCoords.x},${nextCoords.y}`
      );
    });
    if (!this.isCutScenePlaying && match && match.talking.length) {
      this.startCutScene(match.talking[0].events);
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];

    const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];
    if (!this.isCutScenePlaying && match && match.length) {
      this.startCutScene(match[0].events);
    }
  }

  addWall(x: number, y: number) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x: number, y: number) {
    delete this.walls[`${x},${y}`];
  }
  moveWall(wasX: number, wasY: number, direction: Directions) {
    this.removeWall(wasX, wasY);
    const { x, y } = UTILS.nextPosition(wasX, wasY, direction);
    this.addWall(x, y);
  }
}
