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
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    };

    // shadow setup
    this.shadow = new Image();
    this.useShadow = config.useShadow || false;
    if (this.useShadow) {
      this.shadow.src = "./images/characters/shadow.png";
    }
    this.shadow.onload = () => {
      this.isShadowLoaded = true;
    };

    // animation and initital state
    this.animation = config.animation || {
      "idle-down": [[0, 0]],
      "idle-right": [[0, 1]],
      "idle-up": [[0, 2]],
      "idle-left": [[0, 3]],

      "walk-down": [
        [1, 0],
        [0, 0],
        [3, 0],
        [0, 0],
      ],
      "walk-right": [
        [1, 1],
        [0, 1],
        [3, 1],
        [0, 1],
      ],
      "walk-up": [
        [1, 2],
        [0, 2],
        [3, 2],
        [0, 2],
      ],
      "walk-left": [
        [1, 3],
        [0, 3],
        [3, 3],
        [0, 3],
      ],
    };
    this.currentAnimation = config.currentAnimation || "idle-down";
    this.currentAnimationFrame = 0;

    this.animationFrameLimit = config.animationFrameLimit || 16;
    this.animationFrameProgress = this.animationFrameLimit;

    // reference to game object that created this spirte
    this.gameObject = config.gameObject;
  }

  get frame() {
    return this.animation[this.currentAnimation][this.currentAnimationFrame];
  }

  setAnimation(key: string) {
    if (this.currentAnimation !== key) {
      this.currentAnimation = key;
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameLimit;
    }
  }

  updateAnimationProgress() {
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }
    //reset counter
    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame += 1;
    if (this.frame === undefined) {
      this.currentAnimationFrame = 0;
    }
  }

  draw(ctx: CanvasRenderingContext2D, cameraPerson: GameObject) {
    /** x position to draw this sprite accounting for camera position and nudging to center of tile */
    const x =
      this.gameObject.x -
      UTILS.nudgeSprite.person.x +
      UTILS.withGrid(UTILS.cameraPersonOffset.x) -
      cameraPerson.x;
    /** y position to draw this sprite accounting for camera position and nudging to center of tile */
    const y =
      this.gameObject.y -
      UTILS.nudgeSprite.person.y +
      UTILS.withGrid(UTILS.cameraPersonOffset.y) -
      cameraPerson.y;

    this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);

    const [frameX, frameY] = this.frame;

    this.isLoaded &&
      ctx.drawImage(
        this.image,
        frameX * DIMENSIONS.spriteSize.person.width, // starting crop point for top/left
        frameY * DIMENSIONS.spriteSize.person.width,
        DIMENSIONS.spriteSize.person.width, // width/height of crop to make
        DIMENSIONS.spriteSize.person.height,
        x, // final position of the crop
        y,
        DIMENSIONS.spriteSize.person.width, // final crop width/height (stretch the crop)
        DIMENSIONS.spriteSize.person.height
      );

    this.updateAnimationProgress();
  }
}
