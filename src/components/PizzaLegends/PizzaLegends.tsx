import { useEffect, useRef, useState } from "react";
import { DIMENSIONS } from "../utils";
import "../../styles/index.css";
import Overworld from "../Overworld";
export default function PizzaLegends() {
  const [gameContainer, setGameContainer] = useState<HTMLDivElement | null>(
    null
  );
  const [canvas, setGameCanvas] = useState<HTMLCanvasElement | null>(null);
  const [ctx2d, setGameCanvasCtx2d] = useState<CanvasRenderingContext2D | null>(
    null
  );

  const gameContainerRef = useRef<HTMLDivElement | null>(null);
  const gameCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (gameContainerRef.current !== null) {
      setGameContainer(gameContainerRef.current);
    }
    if (gameCanvasRef.current !== null) {
      setGameCanvas(gameCanvasRef.current);
      setGameCanvasCtx2d(gameCanvasRef.current.getContext("2d"));
    }

    if (canvas !== null && gameContainer !== null && ctx2d !== null) {
      canvas.width = DIMENSIONS.canvasDimensions.width;
      canvas.height = DIMENSIONS.canvasDimensions.height;
      const ow = new Overworld({ gameContainer, canvas, ctx2d });
      ow.init();
    }
  }, [canvas, gameContainer, ctx2d]);

  return (
    <main>
      <div className="game-container" ref={gameContainerRef}>
        <canvas className="game-canvas" ref={gameCanvasRef} />
      </div>
    </main>
  );
}
