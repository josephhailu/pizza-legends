type GameObjectConfig = {
  x: number;
  y: number;
  direction?: Directions;
  src?: string;
  animation?: {
    [key: string]: number[][];
  };
};

class GameObject {
  y: number;
  x: number;
  sprite: Sprite;
  direction: "up" | "down" | "left" | "right";
  constructor(config: GameObjectConfig) {
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || "down";
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || "./images/characters/people/hero.png",
      useShadow: true,
      animation: config.animation
    });
  }
  update() { }
}
