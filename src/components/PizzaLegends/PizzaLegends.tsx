import {useEffect, useRef} from "react";
import {DIMENSIONS} from "../utils";
import "../../styles/index.css";
export default function PizzaLegends() {
  const gameCanvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    //onload
    gameCanvas.current!.width = DIMENSIONS.canvasDimensions.width;
    gameCanvas.current!.height = DIMENSIONS.canvasDimensions.height;
  }, []);
  return (
    <main>
      <div className="game-container">
        <canvas className="game-canvas" ref={gameCanvas} />
      </div>
    </main>
  );
}
