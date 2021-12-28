type OverworldMapConfig = {
    gameObjects: Record<string, GameObject>;
    lowerImage: HTMLImageElement;
    lowerSrc: string;
    upperImage: HTMLImageElement;
    upperSrc: string;
};
class OverworldMap {
    gameObjects: Record<string, GameObject>;
    lowerImage: HTMLImageElement;
    upperImage: HTMLImageElement;
    constructor(config: OverworldMapConfig) {
        this.gameObjects = config.gameObjects;

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
                isPlayerControlled: false,
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
            me:
                new Person({
                    isPlayerControlled: true,
                    x: UTILS.withGrid(10),
                    y: UTILS.withGrid(6),
                    src: "./images/characters/people/me.png",
                    animation: {
                        "idle-down": [[0, 0]],
                        "idle-right": [[0, 0]],
                        "idle-up": [[0, 0]],
                        "idle-left": [[0, 0]],

                        "walk-down": [
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                        ],
                        "walk-right": [
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                        ],
                        "walk-up": [
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                        ],
                        "walk-left": [
                            [0, 0],
                            [0, 0],
                            [0, 0],
                            [0, 0],
                        ],
                    }
                })

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
