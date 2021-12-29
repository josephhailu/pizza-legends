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
      if (this.movingProgressRemaining > 0) {
        this.updatePosition();
      } else {
        if (this.isPlayerControlled && state.arrow) {
          this.startBehaviour(state, {
            type: "walk",
            direction: state.arrow,
          });
        }
        this.updateSprite();
      }
    } else {
      super.update();
    }
  }

  startBehaviour(
    state: SpriteUpdateState,
    behaviour: {type: string; direction: Directions}
  ) {
    this.direction = behaviour.direction;
    if (behaviour.type === "walk") {
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        return;
      }

      //move hero collision wall with character
      state.map.moveWall(this.x, this.y, this.direction);
      this.movingProgressRemaining = 16;
    }
  }

  updatePosition() {
    if (this.movingProgressRemaining > 0) {
      const [property, change] = this.directionUpdate[this.direction];
      this[property] += change;
      this.movingProgressRemaining -= 1;
    }
  }

  updateSprite() {
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation("walk-" + this.direction);
      return;
    }
    this.sprite.setAnimation("idle-" + this.direction);
  }
}
