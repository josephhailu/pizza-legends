import OverworldEvent from "./OverworldEvent";
import OverworldMap from "./OverworldMap";
import { Directions } from "./Person";
import Sprite from "./Sprite";

export type EventTypes = "walk" | "stand" | "textMessage" | "changeMap";
export type Behaviour = {
  type: EventTypes;
  direction?: Directions;
  time?: number;
  who?: string | null;
  retry?: boolean;
  text?: string;
  faceHero?: string;
  map?: string;
};

export type GameObjectConfig = {
  x: number;
  y: number;
  direction?: Directions;
  src?: string;
  animation?: {
    [key: string]: number[][];
  };
  behaviourLoop?: Behaviour[];
  talking?: Record<string, Behaviour[]>[];
};

export default class GameObject {
  y: number;
  x: number;
  isMounted: boolean;
  sprite: Sprite;
  direction: Directions;
  id: string | null;
  behaviourLoop: Behaviour[];
  behaviourLoopIndex: number;
  talking: Record<string, Behaviour[]>[];
  constructor(config: GameObjectConfig) {
    this.id = null;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.isMounted = false;
    this.direction = config.direction || "down";
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || "./images/characters/people/hero.png",
      useShadow: true,
      animation: config.animation,
    });

    this.behaviourLoop = config.behaviourLoop || [];
    this.behaviourLoopIndex = 0;

    this.talking = config.talking || [];
  }

  mount(map: OverworldMap) {
    this.isMounted = true;
    map.addWall(this.x, this.y);

    // if we have a behaviour start it after a short delay
    setTimeout(() => {
      this.doBehaviourEvent(map);
    }, 10);
  }

  update() {}

  /**
   * Behaviour loop that iterates through the behaviour array
   * for a gameobject
   * @param map map that holds game object references
   * @returns Promise<void>
   */
  async doBehaviourEvent(map: OverworldMap, exitCondition = false) {
    if (
      map.isCutScenePlaying ||
      this.behaviourLoop.length === 0 ||
      exitCondition
    ) {
      return;
    }

    let eventConfig = this.behaviourLoop[this.behaviourLoopIndex];
    eventConfig.who = this.id;

    const behaviourEventHandler = new OverworldEvent({
      map,
      event: eventConfig,
    });
    await behaviourEventHandler.init();

    this.behaviourLoopIndex += 1;
    if (this.behaviourLoopIndex === this.behaviourLoop.length) {
      this.behaviourLoopIndex = 0;
    }
    this.doBehaviourEvent(map);
  }
}
