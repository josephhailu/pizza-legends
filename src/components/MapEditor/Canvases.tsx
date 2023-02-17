import React from "react";
import {StyledCanvas, StyledCanvases} from "./styles";

type CanvasDispatchTypes = "drawAll" | "drawGrid" | "drawMap" | "drawWalls";

export interface CanvasesType {
  scaleFactor: number;
  mapImage: HTMLImageElement;
  cellSize: {
    width: number;
    height: number;
  };
  cellColor: string;
  opacity: number;
  gridSettings: {
    opacity: number;
    colorHeight: string;
    colorWidth: string;
  };
  walls: {
    [x: string]: boolean;
  };
  elementSize: {
    width: number;
    height: number;
  };
  handleCollisionCanvasMouseEvent: (canvasCoords: [number, number]) => void;
}

const Canvases = ({
  scaleFactor,
  mapImage,
  cellSize,
  cellColor,
  opacity,
  gridSettings,
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
    cellGridCtx.fillStyle = gridSettings.colorHeight;
    for (let index = 1; index <= width / cellSize.width; index++) {
      cellGridCtx.fillRect(index * cellSize.width, 0, 1, height);
    }
    // horizontal lines
    cellGridCtx.fillStyle = gridSettings.colorWidth;
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
    collisionCtx.fillStyle = cellColor;
    collisionCtx.globalAlpha = opacity;
    Object.keys(walls).forEach((key) => {
      const [x, y] = key.split(",").map((n) => parseInt(n)); //{"16,0": true}
      collisionCtx.fillRect(x!, y!, cellSize.width, cellSize.height);
    });
  }

  function drawCell(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    const rect = collisionCanvas.current!.getBoundingClientRect();
    const canvasCoords = [e.clientX - rect.left, e.clientY - rect.top] as [
      number,
      number
    ];
    handleCollisionCanvasMouseEvent(canvasCoords);
  }

  React.useEffect(() => {
    // set canvas dimensions when the img changes
    [mapCanvas, gridCanvas, collisionCanvas].forEach((c) => {
      c.current!.width = mapImage.width;
      c.current!.height = mapImage.height;
    });
  }, [mapImage.src, mapImage.height, mapImage.width]);

  // this effect needs to come last to re-draw canvases on each render
  React.useEffect(() => {
    // draw all the things
    canvasDispatcher({type: "drawAll"});
  });
  return (
    <StyledCanvases
      style={{height: elementSize.height, width: elementSize.width}}
    >
      <StyledCanvas
        scaleFactor={scaleFactor}
        className="tilemap-canvas"
        ref={mapCanvas}
      />
      <StyledCanvas
        scaleFactor={scaleFactor}
        className="cell-grid-canvas"
        ref={gridCanvas}
        style={{opacity: gridSettings.opacity}}
      />
      <StyledCanvas
        scaleFactor={scaleFactor}
        className="collision-canvas"
        ref={collisionCanvas}
        onMouseDown={(e) => {
          e.preventDefault(); // stop text highlighting when onMouseMove fires
          drawCell(e); // allow us to draw when clicking
          setIsMouseDown(true);
        }}
        onMouseMove={(e) => {
          if (isMouseDown) {
            drawCell(e);
          }
        }}
        onMouseUp={() => {
          setIsMouseDown(false);
        }}
        onMouseLeave={() => {
          setIsMouseDown(false);
        }}
      />
    </StyledCanvases>
  );
};

export default Canvases;
