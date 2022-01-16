import {useEffect, useRef} from "react";
import {DIMENSIONS} from "../utils";
import "../../styles/index.css";
import "../../styles/TextMessage.css";

import Overworld from "../Overworld";

export default function PizzaLegends() {
  const gameContainerRef = useRef<HTMLDivElement | null>(null);
  const gameCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Init
  useEffect(() => {
    if (gameContainerRef.current && gameCanvasRef.current) {
      gameCanvasRef.current.width = DIMENSIONS.canvasDimensions.width;
      gameCanvasRef.current.height = DIMENSIONS.canvasDimensions.height;
      const ov = new Overworld({
        gameContainer: gameContainerRef.current,
        canvas: gameCanvasRef.current,
      });
      ov.init();
    }
  }, []);
  return (
    <main>
      <div className="game-container" ref={gameContainerRef}>
        <canvas className="game-canvas" ref={gameCanvasRef} />
      </div>
    </main>
  );
}
