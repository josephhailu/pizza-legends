import GameObject from "./GameObject";

export type SpriteConfig = {
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

export default class Sprite {
  animation: {
    [key: string]: number[][];
  };
  currentAnimation: string;
  currentAnimationFrame: number;
  image: HTMLImageElement;
  isLoaded: boolean = false;
  gameObject: GameObject;
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
    this.animation = config.animation || ANIMATIONS.defaultAnimation;
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
    // reset counter
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
