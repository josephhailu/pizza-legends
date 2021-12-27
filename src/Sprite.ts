type SpriteConfig = {
    animation?: {
        [key: string]: number[][];
    };
    currentAnimation?: string;
    currentAnimationFrame?: number;
    src: string;
    gameObject: GameObject;
    useShadow: boolean;
    animationFrameLimit?: number;
};

class Sprite {
    animation: {
        [key: string]: number[][];
    };
    currentAnimation: string;
    currentAnimationFrame: number;
    image: HTMLImageElement;
    isLoaded: boolean = false;
    gameObject: any;
    shadow: HTMLImageElement;
    useShadow: boolean;
    isShadowLoaded: boolean = false;
    animationFrameLimit: number;
    animationFrameProgress: number;

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
            'idle-down': [[0, 0]],
            'idle-right': [[0, 1]],
            'idle-up': [[0, 2]],
            'idle-left': [[0, 3]],

            'walk-down': [[1, 0], [0, 0], [3, 0], [0, 0]],
            'walk-right': [[1, 1], [0, 1], [3, 1], [0, 1]],
            'walk-up': [[1, 2], [0, 2], [3, 2], [0, 2]],
            'walk-left': [[1, 3], [0, 3], [3, 3], [0, 3]],
        }
        this.currentAnimation = 'idle-down'//config.currentAnimation || 'idle-down'
        this.currentAnimationFrame = 0;

        this.animationFrameLimit = config.animationFrameLimit || 16;
        this.animationFrameProgress = this.animationFrameLimit;

        //reference game object (the thing that created this spirte)
        this.gameObject = config.gameObject;
    }

    get frame() {
        return this.animation[this.currentAnimation][this.currentAnimationFrame];
    }


    setAnimation(key: string) {
        if (this.currentAnimation !== key) {
            this.currentAnimation = key
            this.currentAnimationFrame = 0
            this.animationFrameProgress = this.animationFrameLimit
        }
    }

    updateAnimationProgress() {
        if (this.animationFrameProgress > 0) {
            this.animationFrameProgress -= 1;
            return;
        }
        //reset counter
        this.animationFrameProgress = this.animationFrameLimit
        this.currentAnimationFrame += 1
        if (this.frame === undefined) {
            this.currentAnimationFrame = 0;
        }

    }

    draw(ctx: CanvasRenderingContext2D, cameraPerson:GameObject) {
        // x/y position times tile size and shift for center of tile
        const x = this.gameObject.x - 7 + UTILS.withGrid(10.5) - cameraPerson.x;
        const y = this.gameObject.y - 18 + UTILS.withGrid(6) - cameraPerson.y;

        this.isShadowLoaded &&
            ctx.drawImage(
                this.shadow,
                x, y, // starting crop point for top/left
            )

        const [frameX, frameY] = this.frame;

        this.isLoaded &&
            ctx.drawImage(this.image,
                frameX * 32, frameY * 32, // starting crop point for top/left
                32, 32, // width/height of crop to make
                x, y,
                32, 32 // image width/height (based on character size in sprite sheet)
            )

        this.updateAnimationProgress();
    }
}