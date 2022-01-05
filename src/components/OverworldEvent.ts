import { Behaviour } from "./GameObject";
import OverworldMap from "./OverworldMap";
import { OverworldMapsConfig } from "./OverworldMapsConfig";
import Person from "./Person";
import TextMessage from "./TextMessage";

export enum CUSTOM_EVENTS {
  PersonWalkComplete = "PersonWalkComplete",
  PersonStandComplete = "PersonStandComplete",
}

export type OverworldEventConfig = {
  map: OverworldMap;
  event: Behaviour;
};

export default class OverworldEvent {
  map: OverworldMap;
  event: Behaviour;
  constructor(config: OverworldEventConfig) {
    this.map = config.map;
    this.event = config.event;
  }

  stand(resolve: (value: unknown) => void) {
    const who = this.map.gameObjects[this.event.who!];
    if (who instanceof Person) {
      who.startBehaviour(
        { map: this.map },
        {
          type: "stand",
          direction: this.event.direction,
          time: this.event.time,
        }
      );

      const completeHandler = (event: CustomEvent<{ whoId: string }>) => {
        if (event.detail.whoId === this.event.who!) {
          document.removeEventListener(
            CUSTOM_EVENTS.PersonStandComplete,
            completeHandler
          );
          resolve(true);
        }
      };
      document.addEventListener(
        CUSTOM_EVENTS.PersonStandComplete,
        completeHandler
      );
    }
  }

  walk(resolve: (value: unknown) => void) {
    // find gameobject we need to reference
    const who = this.map.gameObjects[this.event.who!];
    if (who instanceof Person) {
      who.startBehaviour(
        { map: this.map },
        {
          type: "walk",
          direction: this.event.direction,
          retry: true,
        }
      );

      const completeHandler = (event: CustomEvent<{ whoId: string }>) => {
        if (event.detail.whoId === this.event.who!) {
          document.removeEventListener(
            CUSTOM_EVENTS.PersonWalkComplete,
            completeHandler
          );
          resolve(true);
        }
      };
      document.addEventListener(
        CUSTOM_EVENTS.PersonWalkComplete,
        completeHandler
      );
    }
  }

  textMessage(resolve: (value: unknown) => void) {
    if (this.event.faceHero) {
      const object = this.map.gameObjects[this.event.faceHero];
      object.direction = UTILS.oppositeDirection(
        this.map.gameObjects["hero"].direction
      );
    }

    const message = new TextMessage({
      text: this.event.text!,
      onComplete: () => resolve(true),
    });
    message.init(document.querySelector(".game-container")!);
  }

  changeMap(resolve: (value: unknown) => void) {
    this.map.overworld!.startMap(OverworldMapsConfig[this.event.map!]);
    resolve(true);
  }

  init() {
    return new Promise((resolve) => {
      this[this.event.type](resolve);
    });
  }
}
