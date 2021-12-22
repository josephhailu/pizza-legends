

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
 