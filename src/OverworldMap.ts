type OverworldMapConfig = {
  gameObjects: Record<string, GameObject>;
  lowerImage: HTMLImageElement;
  lowerSrc: string;
  upperImage: HTMLImageElement;
  upperSrc: string;
  walls?: Record<string, {}>;
};
class OverworldMap {
  gameObjects: Record<string, GameObject>;
  lowerImage: HTMLImageElement;
  upperImage: HTMLImageElement;
  walls: Record<string, {}>;

  constructor(config: OverworldMapConfig) {
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;
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
    const {x, y} = UTILS.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }
}

declare module "my-overworldmaps-config" {
  global {
    interface Window {
      OverworldMaps: Record<string, any>;
    }
  }
}

window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: "./images/maps/DemoLower.png",
    upperSrc: "./images/maps/DemoUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: UTILS.withGrid(5),
        y: UTILS.withGrid(6),
      }),
      npc1: new Person({
        x: UTILS.withGrid(7),
        y: UTILS.withGrid(9),
        src: "./images/characters/people/npc1.png",
      }),
      npc2: new Person({
        x: UTILS.withGrid(4),
        y: UTILS.withGrid(6),
        src: "./images/characters/people/uhh.png",
      }),
      me: new Person({
        x: UTILS.withGrid(10),
        y: UTILS.withGrid(6),
        src: "./images/characters/people/me.png",
        animation: ANIMATIONS.singleFrame,
      }),
      me2: new Person({
        x: UTILS.withGrid(6),
        y: UTILS.withGrid(8),
        src: "./images/characters/people/me2.png",
        animation: ANIMATIONS.singleFrame,
      }),
    },
    walls: {
      [UTILS.asGridCoord(7, 6)]: true, // "16,16":true
      [UTILS.asGridCoord(8, 6)]: true,
      [UTILS.asGridCoord(7, 7)]: true,
      [UTILS.asGridCoord(8, 7)]: true,
    },
  },
  Kitchen: {
    lowerSrc: "./images/maps/KitchenLower.png",
    upperSrc: "./images/maps/KitchenUpper.png",
    gameObjects: {
      npcA: new Person({
        x: UTILS.withGrid(9),
        y: UTILS.withGrid(2),
        src: "./images/characters/people/npc2.png",
      }),
      npcB: new Person({
        x: UTILS.withGrid(10),
        y: UTILS.withGrid(4),
        src: "./images/characters/people/npc3.png",
      }),
    },
  },
};
