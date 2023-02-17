import React from "react";
import {StyledCanvas, StyledCanvases} from "./styles";

type CanvasDispatchTypes = "drawAll" | "drawGrid" | "drawMap" | "drawWalls";

export interface CanvasesType {
  mapImage: HTMLImageElement;
  cellSize: {
    width: number;
    height: number;
  };
  opacity: number;
  walls: {
    [x: string]: boolean;
  };
  elementSize: {
    width: number;
    height: number;
  };
  handleCollisionCanvasMouseEvent: (canvasCoords: number[]) => void;
}

const Canvases = ({
  mapImage,
  cellSize,
  opacity,
  walls,
  elementSize,
  handleCollisionCanvasMouseEvent,
}: CanvasesType): JSX.Element => {
  const [isMouseDown, setIsMouseDown] = React.useState<boolean>(false);
  const mapCanvas = React.useRef<HTMLCanvasElement>(null);
  const gridCanvas = React.useRef<HTMLCanvasElement>(null);
  const collisionCanvas = React.useRef<HTMLCanvasElement>(null);

  function canvasDispatcher(action: {type: CanvasDispatchTypes}) {
    if (action.type === "drawAll") {
      drawMap();
      drawGrid();
      drawWalls();
    } else if (action.type === "drawMap") {
      drawMap();
    } else if (action.type === "drawGrid") {
      drawGrid();
    } else if (action.type === "drawWalls") {
      drawWalls();
    } else {
      throw new Error();
    }
  }

  function drawMap() {
    const mapCtx = mapCanvas.current!.getContext("2d")!;
    mapCtx.clearRect(0, 0, mapCanvas.current!.width, mapCanvas.current!.height);
    mapCtx.drawImage(mapImage, 0, 0);
  }

  function drawGrid() {
    const cellGridCtx = gridCanvas.current!.getContext("2d")!;
    const width = mapCanvas.current!.width;
    const height = mapCanvas.current!.height;
    cellGridCtx.clearRect(0, 0, width, height);
    // vertical lines
    cellGridCtx.fillStyle = "blue";
    for (let index = 1; index <= width / cellSize.width; index++) {
      cellGridCtx.fillRect(index * cellSize.width, 0, 1, height);
    }
    // horizontal lines
    cellGridCtx.fillStyle = "orange";
    for (let index = 1; index <= height / cellSize.height; index++) {
      cellGridCtx.fillRect(0, index * cellSize.height, width, 1);
    }
  }

  function drawWalls() {
    const collisionCtx = collisionCanvas.current!.getContext("2d")!;
    collisionCtx.clearRect(
      0,
      0,
      collisionCanvas.current!.width,
      collisionCanvas.current!.height
    );
    collisionCtx.fillStyle = "green";
    collisionCtx.globalAlpha = 0.3;
    Object.keys(walls).forEach((key) => {
      const [x, y] = key.split(",").map((n) => parseInt(n)); //{"16,0": true}
      collisionCtx.fillRect(x, y, cellSize.width, cellSize.height);
    });
  }

  React.useEffect(() => {
    // set canvas dimensions when the img changes
    [mapCanvas, gridCanvas, collisionCanvas].forEach((c) => {
      c.current!.width = mapImage.width;
      c.current!.height = mapImage.height;
    });
  }, [mapImage.src]);

  // this effect needs to come last to re-draw canvases on each render
  React.useEffect(() => {
    // draw all the things
    canvasDispatcher({type: "drawAll"});
  });
  return (
    <StyledCanvases
      style={{height: elementSize.height, width: elementSize.width}}
    >
      <StyledCanvas className="tilemap-canvas" ref={mapCanvas} />
      <StyledCanvas
        className="cell-grid-canvas"
        ref={gridCanvas}
        style={{opacity: opacity}}
      />
      <StyledCanvas
        className="collision-canvas"
        ref={collisionCanvas}
        onMouseDown={(e) => {
          // stop text highlighting
          e.preventDefault();
          setIsMouseDown(true);
        }}
        onMouseUp={() => {
          setIsMouseDown(false);
        }}
        onMouseMove={(e) => {
          if (isMouseDown) {
            const rect = collisionCanvas.current!.getBoundingClientRect();
            const canvasCoords = [e.clientX - rect.left, e.clientY - rect.top];
            handleCollisionCanvasMouseEvent(canvasCoords);
          }
        }}
        onMouseLeave={() => {
          setIsMouseDown(false);
        }}
      />
    </StyledCanvases>
  );
};

export default Canvases;
