import React from "react";

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
  handleCollisionCanvasMouseDown: (canvasCoords: number[]) => void;
}

const Canvases = ({
  mapImage,
  cellSize,
  opacity,
  walls,
  elementSize,
  handleCollisionCanvasMouseDown,
}: CanvasesType): JSX.Element => {
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

  React.useEffect(() => {
    //set canvas dimensions
    [mapCanvas, gridCanvas, collisionCanvas].forEach((c) => {
      c.current!.width = mapImage.width;
      c.current!.height = mapImage.height;
    });
  }, [mapImage.src, mapImage.width, mapImage.height]);

  React.useEffect(() => {
    canvasDispatcher({type: "drawAll"});
  });

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

  return (
    <div
      className="canvases"
      style={{height: elementSize.height, width: elementSize.width}}
    >
      <canvas className="tilemap-canvas" ref={mapCanvas}></canvas>
      <canvas
        className="cell-grid-canvas"
        ref={gridCanvas}
        style={{opacity: opacity}}
      ></canvas>
      <canvas
        className="collision-canvas"
        ref={collisionCanvas}
        onMouseDown={(e) => {
          const rect = collisionCanvas.current!.getBoundingClientRect();
          const canvasCoords = [e.clientX - rect.left, e.clientY - rect.top];
          handleCollisionCanvasMouseDown(canvasCoords);
        }}
      ></canvas>
    </div>
  );
};

export default Canvases;
