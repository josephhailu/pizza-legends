type PersonConfig = GameObjectConfig & {
  isPlayerControlled?: boolean;
};
type Directions = "up" | "down" | "left" | "right";
type DirectionUpdate = {
  [key in Directions]: [property: "x" | "y", change: -1 | 1];
};

type SpriteUpdateState = {
  arrow: Directions;
  map: OverworldMap;
};

class Person extends GameObject {
  movingProgressRemaining: number;
  directionUpdate: DirectionUpdate;
  isPlayerControlled: boolean;
  constructor(config: PersonConfig) {
    super(config);
    this.movingProgressRemaining = 0;
    this.isPlayerControlled = config.isPlayerControlled || false;
    this.directionUpdate = {
      up: ["y", -1],
      down: ["y", 1],
      left: ["x", -1],
      right: ["x", 1],
    };
  }

  update(state?: SpriteUpdateState) {
    if (state) {
      this.updatePosition();
      this.updateSprite(state);
      if (
        this.isPlayerControlled &&
        this.movingProgressRemaining === 0 &&
        state.arrow
      ) {
        this.direction = state.arrow;
        state.map.isSpaceTaken(this.x, this.y, this.direction);
        this.movingProgressRemaining = 16;
      }
    } else {
      super.update();
    }
  }

  updatePosition() {
    if (this.movingProgressRemaining > 0) {
      const [property, change] = this.directionUpdate[this.direction];
      this[property] += change;
      this.movingProgressRemaining -= 1;
    }
  }

  updateSprite(state: SpriteUpdateState) {
    if (
      this.isPlayerControlled &&
      this.movingProgressRemaining === 0 &&
      !state.arrow
    ) {
      this.sprite.setAnimation("idle-" + this.direction);
      return;
    }
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation("walk-" + this.direction);
    }
  }
}
