import {useEffect, useCallback, useState} from "react";
import {DIMENSIONS} from "../utils";
import "../../styles/index.css";
import Overworld from "../Overworld";

export default function PizzaLegends() {
  const [gameCanvas, setGameCanvas] = useState<HTMLCanvasElement | null>(null);
  const [gameContainer, setGameContainer] = useState<HTMLDivElement | null>(
    null
  );

  const gameContainerRef = useCallback((div: HTMLDivElement) => {
    if (div !== null) {
      setGameContainer(div);
    }
  }, []);

  const gameCanvasRef = useCallback((canvas: HTMLCanvasElement) => {
    if (canvas !== null) {
      setGameCanvas(canvas);
      canvas.width = DIMENSIONS.canvasDimensions.width;
      canvas.height = DIMENSIONS.canvasDimensions.height;
    }
  }, []);

  useEffect(() => {
    // onload
    if (gameCanvas !== null && gameContainer !== null) {
      const ov = new Overworld({
        element: gameContainer,
      });

      ov.init();
    }
  }, [gameCanvas, gameContainer]);

  return (
    <main>
      <div className="game-container" ref={gameContainerRef}>
        <canvas className="game-canvas" ref={gameCanvasRef} />
      </div>
    </main>
  );
}
