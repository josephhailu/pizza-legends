import Overworld from "./Overworld";
import { DIMENSIONS } from "./utils";

window.onload = function () {
  const c = document.querySelector(".game-canvas") as HTMLCanvasElement;
  c.width = DIMENSIONS.canvasDimensions.width;
  c.height = DIMENSIONS.canvasDimensions.height;

  let overworld = new Overworld({
    element: document.querySelector(".game-container")!,
  });

  overworld.init();
};
