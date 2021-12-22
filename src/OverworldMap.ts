type OverworldMapConfig = {
    gameObjects: GameObject[];
    lowerImage: HTMLImageElement;
    lowerSrc: string;
    upperImage: HTMLImageElement;
    upperSrc: string;
}
class OverworldMap {
    gameObjects: GameObject[];
    lowerImage: HTMLImageElement;
    upperImage: HTMLImageElement;
    constructor(config: OverworldMapConfig) {
        this.gameObjects = config.gameObjects;

        this.lowerImage = new Image()
        this.lowerImage.src = config.lowerSrc;


        this.upperImage = new Image()
        this.upperImage.src = config.upperSrc;

    }

    drawLowerImage(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.lowerImage, 0, 0)
    }
    drawUpperImage(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.upperImage, 0, 0)
    }
}

declare module 'my-overworldmaps-config' {
    global {
        interface Window { OverworldMaps: Record<string, any>; }
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
                y: UTILS.withGrid(6)
            }),
            npc1: new Person({
                x: UTILS.withGrid(7),
                y: UTILS.withGrid(9),
                src: "./images/characters/people/npc1.png"
            })
        }
    },
    Kitchen: {
        lowerSrc: "./images/maps/KitchenLower.png",
        upperSrc: "./images/maps/KitchenUpper.png",
        gameObjects: {
            npcA: new Person({
                x: UTILS.withGrid(9),
                y: UTILS.withGrid(2),
                src: "./images/characters/people/npc2.png"
            }),
            npcB: new Person({
                x: UTILS.withGrid(10),
                y: UTILS.withGrid(4),
                src: "./images/characters/people/npc3.png"
            })
        }
    }
};
