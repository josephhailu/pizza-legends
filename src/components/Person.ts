import GameObject, { GameObjectConfig, Behaviour } from "./GameObject";
import { CUSTOM_EVENTS } from "./OverworldEvent";
import OverworldMap from "./OverworldMap";

export type PersonConfig = GameObjectConfig & {
  isPlayerControlled?: boolean;
};
export type Directions = "up" | "down" | "left" | "right";
export type DirectionUpdate = {
  [key in Directions]: [property: "x" | "y", change: -1 | 1];
};

export type SpriteUpdateState = {
  map: OverworldMap;
  arrow?: Directions;
};

export default class Person extends GameObject {
  movingProgressRemaining: number;
  isStanding = false;
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
        if (
          !state.map.isCutScenePlaying &&
          this.isPlayerControlled &&
          state.arrow
        ) {
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

  startBehaviour(state: SpriteUpdateState, behaviour: Behaviour) {
    this.direction = behaviour.direction!;
    if (behaviour.type === "walk") {
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        behaviour.retry &&
          setTimeout(() => {
            this.startBehaviour(state, behaviour);
          }, 10);
        return;
      }

      //move hero collision wall with character
      state.map.moveWall(this.x, this.y, this.direction);
      this.movingProgressRemaining = 16;
      this.updateSprite();
    }
    if (behaviour.type === "stand") {
      this.isStanding = true;
      setTimeout(() => {
        UTILS.emitEvent(CUSTOM_EVENTS.PersonStandComplete, { whoId: this.id });
      }, behaviour.time!);
      this.isStanding = false;
    }
  }

  updatePosition() {
    if (this.movingProgressRemaining > 0) {
      const [property, change] = this.directionUpdate[this.direction];
      this[property] += change;
      this.movingProgressRemaining -= 1;
    }

    if (this.movingProgressRemaining == 0) {
      // emit done moving signal
      UTILS.emitEvent(CUSTOM_EVENTS.PersonWalkComplete, { whoId: this.id });
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
