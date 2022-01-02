type Walls = {
  [coordinateString: string]: boolean;
};

type CutsceneSpaces = {
  [coordinateString: string]: Record<string, Behaviour[]>[];
};

type OverworldMapConfig = {
  gameObjects: Record<string, GameObject>;
  lowerImage: HTMLImageElement;
  lowerSrc: string;
  upperImage: HTMLImageElement;
  upperSrc: string;
  walls?: Walls;
  cutsceneSpaces?: CutsceneSpaces;
};
class OverworldMap {
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
    const {x, y} = UTILS.nextPosition(currentX, currentY, direction);
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
    const {x, y} = UTILS.nextPosition(wasX, wasY, direction);
    this.addWall(x, y);
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
        x: UTILS.withGrid(10),
        y: UTILS.withGrid(9),
        src: "./images/characters/people/npc1.png",
        behaviourLoop: [
          {type: "stand", direction: "down", time: 800},
          {type: "stand", direction: "up", time: 800},
          {type: "stand", direction: "right", time: 1200},
          {type: "stand", direction: "up", time: 300},
        ],
        talking: [
          {
            events: [
              {type: "textMessage", text: "Hiaaaaa!", faceHero: "npc1"},
              {type: "textMessage", text: "OMG!"},
              {who: "npc1", type: "stand", direction: "down", time: 120},
              {who: "npc1", type: "stand", direction: "up", time: 120},
              {who: "npc1", type: "stand", direction: "right", time: 120},
              {who: "npc1", type: "stand", direction: "left", time: 120},
              {type: "textMessage", text: "Leaavee!"},
              {who: "hero", type: "walk", direction: "left"},
              {who: "hero", type: "stand", direction: "right"},
            ],
          },
        ],
      }),
      me: new Person({
        x: UTILS.withGrid(8),
        y: UTILS.withGrid(5),
        src: "./images/characters/people/me.png",

        animation: ANIMATIONS.singleFrame,
      }),
      houseGuy: new Person({
        x: UTILS.withGrid(9),
        y: UTILS.withGrid(7),
        src: "./images/characters/people/uhh.png",
        animation: ANIMATIONS.singleFrame,
      }),
      gingerbread: new Person({
        x: UTILS.withGrid(3),
        y: UTILS.withGrid(8),
        src: "./images/characters/people/me2.png",
        animation: ANIMATIONS.singleFrame,
        behaviourLoop: [
          {type: "walk", direction: "left"},
          {type: "walk", direction: "up"},
          {type: "walk", direction: "right"},
          {type: "walk", direction: "down"},
        ],
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "I have big feet.",
                faceHero: "gingerbread",
              },
              {who: "hero", type: "stand", direction: "right", time: 100},
              {who: "hero", type: "stand", direction: "left", time: 300},

              {who: "me", type: "stand", direction: "down", time: 2200},
              {type: "textMessage", text: "...What?", faceHero: "gingerbread"},
            ],
          },
        ],
      }),
    },
    walls: {
      // left wall
      [UTILS.asGridCoord(0, 1)]: true,
      [UTILS.asGridCoord(0, 2)]: true,
      [UTILS.asGridCoord(0, 3)]: true,
      [UTILS.asGridCoord(0, 4)]: true,
      [UTILS.asGridCoord(0, 5)]: true,
      [UTILS.asGridCoord(0, 6)]: true,
      [UTILS.asGridCoord(0, 7)]: true,
      [UTILS.asGridCoord(0, 8)]: true,
      [UTILS.asGridCoord(0, 9)]: true,

      // top wall
      [UTILS.asGridCoord(1, 3)]: true,
      [UTILS.asGridCoord(2, 3)]: true,
      [UTILS.asGridCoord(3, 3)]: true,
      [UTILS.asGridCoord(4, 3)]: true,
      [UTILS.asGridCoord(5, 3)]: true,
      [UTILS.asGridCoord(6, 4)]: true,
      [UTILS.asGridCoord(7, 3)]: true,
      [UTILS.asGridCoord(8, 4)]: true,
      [UTILS.asGridCoord(9, 3)]: true,
      [UTILS.asGridCoord(10, 3)]: true,

      // right wall
      [UTILS.asGridCoord(11, 4)]: true,
      [UTILS.asGridCoord(11, 5)]: true,
      [UTILS.asGridCoord(11, 6)]: true,
      [UTILS.asGridCoord(11, 7)]: true,
      [UTILS.asGridCoord(11, 8)]: true,
      [UTILS.asGridCoord(11, 9)]: true,

      // bottom wall
      [UTILS.asGridCoord(1, 10)]: true,
      [UTILS.asGridCoord(2, 10)]: true,
      [UTILS.asGridCoord(3, 10)]: true,
      [UTILS.asGridCoord(4, 10)]: true,
      [UTILS.asGridCoord(5, 11)]: true,
      [UTILS.asGridCoord(6, 10)]: true,
      [UTILS.asGridCoord(7, 10)]: true,
      [UTILS.asGridCoord(8, 10)]: true,
      [UTILS.asGridCoord(9, 10)]: true,
      [UTILS.asGridCoord(10, 10)]: true,
      //center table wall
      [UTILS.asGridCoord(7, 6)]: true, // "16,16":true
      [UTILS.asGridCoord(8, 6)]: true,
      [UTILS.asGridCoord(7, 7)]: true,
      [UTILS.asGridCoord(8, 7)]: true,
    },
    cutsceneSpaces: {
      [UTILS.asGridCoord(7, 4)]: [
        {
          events: [
            {type: "textMessage", text: "Hey!", faceHero: "me"},
            {who: "me", type: "walk", direction: "left"},
            {who: "me", type: "stand", direction: "up", time: 120},
            {type: "textMessage", text: "You can't be in there!"},
            {who: "me", type: "walk", direction: "right"},
            {who: "hero", type: "walk", direction: "down"},
            {who: "hero", type: "walk", direction: "left"},
          ],
        },
      ],
      [UTILS.asGridCoord(5, 10)]: [
        {
          events: [{type: "changeMap", map: "Kitchen"}],
        },
      ],
    },
  },
  Kitchen: {
    lowerSrc: "./images/maps/KitchenLower.png",
    upperSrc: "./images/maps/KitchenUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: UTILS.withGrid(3),
        y: UTILS.withGrid(5),
        src: "./images/characters/people/hero.png",
      }),
      npcA: new Person({
        x: UTILS.withGrid(6),
        y: UTILS.withGrid(5),
        src: "./images/characters/people/npc2.png",
      }),
      npcB: new Person({
        x: UTILS.withGrid(10),
        y: UTILS.withGrid(8),
        src: "./images/characters/people/npc3.png",
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "You made it",
                faceHero: "npcB",
              },
            ],
          },
        ],
      }),
    },
  },
};
