type SpriteConfig = {
    animation?: { idleDown: number[][]; };
    currentAnimation?: string;
    currentAnimationFrame?: number;
    src: string;
    gameObject: GameObject;
    useShadow: boolean;
};

class Sprite {
    animation: any;
    currentAnimation: any;
    currentAnimationFrame: number;
    image: HTMLImageElement;
    isLoaded: boolean = false;
    gameObject: any;
    shadow: HTMLImageElement;
    useShadow: boolean;
    isShadowLoaded: boolean = false;

    constructor(config: SpriteConfig) {

        //image setup
        this.image = new Image();
        this.image.src = config.src
        this.image.onload = () => {
            this.isLoaded = true;
        }

        // shadow setup
        this.shadow = new Image();
        this.useShadow = config.useShadow || false
        if (this.useShadow) {
            this.shadow.src = "./images/characters/shadow.png"
        }
        this.shadow.onload = () => {
            this.isShadowLoaded = true;
        }

        // animation and initital state
        this.animation = config.animation || {
            idleDown: [
                [0, 0]
            ]
        }
        this.currentAnimation = config.currentAnimation || 'idleDown'
        this.currentAnimationFrame = 0;

        //reference game object (the thing that created this spirte)
        this.gameObject = config.gameObject;
    }

    draw(ctx: CanvasRenderingContext2D) {
        // x/y position times tile size and shift for center of tile
        const x = this.gameObject.x - 7;
        const y = this.gameObject.y - 18;

        this.isShadowLoaded &&
            ctx.drawImage(
                this.shadow,
                x, y, // starting crop point for top/left
            )

        this.isLoaded &&
            ctx.drawImage(
                this.image,
                0, 0, // starting crop point for top/left
                32, 32, // width/height of crop to make
                x, y,
                32, 32 // image width/height (based on character size in sprite sheet)
            )
    }
}