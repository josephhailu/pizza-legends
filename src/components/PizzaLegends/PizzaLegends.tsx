import {useEffect, useMemo, useState, useCallback} from "react";
import {DIMENSIONS} from "../utils";
import "../../styles/TextMessage.css";

import Overworld from "../Overworld";
import {StyledGameContainer} from "./styles";

export default function PizzaLegends() {
  const [gameContainer, setGameContainer] = useState<HTMLDivElement | null>(
    null
  );
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  const gameContainerRef = useCallback((div: HTMLDivElement | null) => {
    if (div !== null) {
      setGameContainer(div);
    }
  }, []);

  const gameCanvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
    if (canvas !== null) {
      setCanvas(canvas);
    }
  }, []);
  // const [overworld, setOverworld] = useState<Overworld | null>(null);

  // Init
  useEffect(() => {
    if (gameContainer && canvas) {
      canvas.width = DIMENSIONS.canvasDimensions.width;
      canvas.height = DIMENSIONS.canvasDimensions.height;
      //setOverworld(new Overworld({gameContainer, canvas}));
    }
    return () => {
      if (gameContainer && canvas) {
        setGameContainer(null);
        setCanvas(null);
      }
    };
  }, [gameContainer, canvas]);

  // Init
  // useEffect(() => {
  //   if (overworld) {
  //     overworld.init();
  //   }
  //   return () => {
  //     if (overworld) {
  //       overworld.stop();
  //     }
  //   };
  // }, [overworld]);

  const stableOverworldRef = useMemo(() => {
    if (gameContainer && canvas) {
      console.log("initing");
      return new Overworld({
        gameContainer,
        canvas,
      });
    }
    console.log("nulling");
    return null;
  }, [gameContainer, canvas]);

  // cleanup
  useEffect(() => {
    if (stableOverworldRef) {
      stableOverworldRef.init();
    }

    return () => {
      if (stableOverworldRef) {
        stableOverworldRef.stop();
      }
    };
  }, [stableOverworldRef]);

  return (
    <StyledGameContainer className="game-container" ref={gameContainerRef}>
      <canvas className="game-canvas" ref={gameCanvasRef} />
    </StyledGameContainer>
  );
}
