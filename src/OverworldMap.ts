

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
    lowerSrc: string;
    upperImage: HTMLImageElement;
    upperSrc: string;
    constructor(config: OverworldMapConfig) {
        this.gameObjects = config.gameObjects;

        this.lowerImage = new Image()
        this.lowerSrc = config.lowerSrc;

        this.upperImage = new Image()
        this.upperSrc = config.upperSrc;
    }

    drawLowerImage(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.lowerImage, 0, 0)
    }
    drawUpperImage(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.upperImage, 0, 0)
    }
}

export { };
declare global {
    interface Window { OverworldMaps: any; }
}

window.OverworldMaps = {
    DemoRoom: {
        lowerSrc: "images/maps/DemoLower.png",
        upperSrc: "images/maps/DemoUpper.png",
        gameObjects: {
            hero: new GameObject({
                x: 5,
                y: 6
            }),
            npc1: new GameObject({
                x: 7,
                y: 9,
                src: "./images/characters/people/npc1.png"
            })
        }
    },
    Kitchen: {
        lowerSrc: "images/maps/KitchenLower.png",
        upperSrc: "images/maps/KitchenUpper.png",
        gameObjects: {
            npcA: new GameObject({
                x: 9,
                y: 2,
                src: "./images/characters/people/npc2.png"
            }),
            npcB: new GameObject({
                x: 10,
                y: 4,
                src: "./images/characters/people/npc3.png"
            })
        }
    }
};