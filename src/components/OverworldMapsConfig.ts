import Person from "./Person";
import { UTILS, ANIMATIONS } from "./utils";

export const OverworldMapsConfig = {
  DemoRoom: {
    lowerSrc: "./images/maps/DemoLower.png",
    upperSrc: "./images/maps/DemoUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: UTILS.withGrid(5),
        y: UTILS.withGrid(6),
      }),
      npc1: new Person({
        x: UTILS.withGrid(10),
        y: UTILS.withGrid(9),
        src: "./images/characters/people/npc1.png",
        behaviourLoop: [
          { type: "stand", direction: "down", time: 800 },
          { type: "stand", direction: "up", time: 800 },
          { type: "stand", direction: "right", time: 1200 },
          { type: "stand", direction: "up", time: 300 },
        ],
        talking: [
          {
            events: [
              { type: "textMessage", text: "Hiaaaaa!", faceHero: "npc1" },
              { type: "textMessage", text: "OMG!" },
              { who: "npc1", type: "stand", direction: "down", time: 120 },
              { who: "npc1", type: "stand", direction: "up", time: 120 },
              { who: "npc1", type: "stand", direction: "right", time: 120 },
              { who: "npc1", type: "stand", direction: "left", time: 120 },
              { type: "textMessage", text: "Leaavee!" },
              { who: "hero", type: "walk", direction: "left" },
              { who: "hero", type: "stand", direction: "right" },
            ],
          },
        ],
      }),
      me: new Person({
        x: UTILS.withGrid(8),
        y: UTILS.withGrid(5),
        src: "./images/characters/people/me.png",

        animation: ANIMATIONS.singleFrame,
      }),
      houseGuy: new Person({
        x: UTILS.withGrid(9),
        y: UTILS.withGrid(7),
        src: "./images/characters/people/uhh.png",
        animation: ANIMATIONS.singleFrame,
      }),
      gingerbread: new Person({
        x: UTILS.withGrid(3),
        y: UTILS.withGrid(8),
        src: "./images/characters/people/me2.png",
        animation: ANIMATIONS.singleFrame,
        behaviourLoop: [
          { type: "walk", direction: "left" },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "down" },
        ],
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "I have big feet.",
                faceHero: "gingerbread",
              },
              { who: "hero", type: "stand", direction: "right", time: 100 },
              { who: "hero", type: "stand", direction: "left", time: 300 },

              { who: "me", type: "stand", direction: "down", time: 2200 },
              {
                type: "textMessage",
                text: "...What?",
                faceHero: "gingerbread",
              },
            ],
          },
        ],
      }),
    },
    walls: {
      // left wall
      [UTILS.asGridCoord(0, 1)]: true,
      [UTILS.asGridCoord(0, 2)]: true,
      [UTILS.asGridCoord(0, 3)]: true,
      [UTILS.asGridCoord(0, 4)]: true,
      [UTILS.asGridCoord(0, 5)]: true,
      [UTILS.asGridCoord(0, 6)]: true,
      [UTILS.asGridCoord(0, 7)]: true,
      [UTILS.asGridCoord(0, 8)]: true,
      [UTILS.asGridCoord(0, 9)]: true,

      // top wall
      [UTILS.asGridCoord(1, 3)]: true,
      [UTILS.asGridCoord(2, 3)]: true,
      [UTILS.asGridCoord(3, 3)]: true,
      [UTILS.asGridCoord(4, 3)]: true,
      [UTILS.asGridCoord(5, 3)]: true,
      [UTILS.asGridCoord(6, 4)]: true,
      [UTILS.asGridCoord(7, 3)]: true,
      [UTILS.asGridCoord(8, 4)]: true,
      [UTILS.asGridCoord(9, 3)]: true,
      [UTILS.asGridCoord(10, 3)]: true,

      // right wall
      [UTILS.asGridCoord(11, 4)]: true,
      [UTILS.asGridCoord(11, 5)]: true,
      [UTILS.asGridCoord(11, 6)]: true,
      [UTILS.asGridCoord(11, 7)]: true,
      [UTILS.asGridCoord(11, 8)]: true,
      [UTILS.asGridCoord(11, 9)]: true,

      // bottom wall
      [UTILS.asGridCoord(1, 10)]: true,
      [UTILS.asGridCoord(2, 10)]: true,
      [UTILS.asGridCoord(3, 10)]: true,
      [UTILS.asGridCoord(4, 10)]: true,
      [UTILS.asGridCoord(5, 11)]: true,
      [UTILS.asGridCoord(6, 10)]: true,
      [UTILS.asGridCoord(7, 10)]: true,
      [UTILS.asGridCoord(8, 10)]: true,
      [UTILS.asGridCoord(9, 10)]: true,
      [UTILS.asGridCoord(10, 10)]: true,
      //center table wall
      [UTILS.asGridCoord(7, 6)]: true, // "16,16":true
      [UTILS.asGridCoord(8, 6)]: true,
      [UTILS.asGridCoord(7, 7)]: true,
      [UTILS.asGridCoord(8, 7)]: true,
    },
    cutsceneSpaces: {
      [UTILS.asGridCoord(7, 4)]: [
        {
          events: [
            { type: "textMessage", text: "Hey!", faceHero: "me" },
            { who: "me", type: "walk", direction: "left" },
            { who: "me", type: "stand", direction: "up", time: 120 },
            { type: "textMessage", text: "You can't be in there!" },
            { who: "me", type: "walk", direction: "right" },
            { who: "hero", type: "walk", direction: "down" },
            { who: "hero", type: "walk", direction: "left" },
          ],
        },
      ],
      [UTILS.asGridCoord(5, 10)]: [
        {
          events: [{ type: "changeMap", map: "Kitchen" }],
        },
      ],
    },
  },
  Kitchen: {
    lowerSrc: "./images/maps/KitchenLower.png",
    upperSrc: "./images/maps/KitchenUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: UTILS.withGrid(3),
        y: UTILS.withGrid(5),
        src: "./images/characters/people/hero.png",
      }),
      npcA: new Person({
        x: UTILS.withGrid(6),
        y: UTILS.withGrid(5),
        src: "./images/characters/people/npc2.png",
      }),
      npcB: new Person({
        x: UTILS.withGrid(10),
        y: UTILS.withGrid(8),
        src: "./images/characters/people/npc3.png",
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "You made it",
                faceHero: "npcB",
              },
            ],
          },
        ],
      }),
    },
    walls: {
      "16,80": true,
      "16,96": true,
      "16,112": true,
      "16,144": true,
      "32,144": true,
      "64,160": true,
      "96,160": true,
      "112,112": true,
      "96,112": true,
      "144,112": true,
      "160,112": true,
      "144,144": true,
      "160,144": true,
    },
  },
};
