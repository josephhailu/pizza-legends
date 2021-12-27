type GameObjectConfig = {
  x: number;
  y: number;
  direction?: "up" | "down" | "left" | "right";
  src?: string;
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
    });
  }
  update() {}
}
