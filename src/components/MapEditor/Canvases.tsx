import React, {FC, PropsWithChildren} from "react";
import {StyledCanvas, StyledCanvases} from "./styles";
import {CanvasDispatchTypes, CanvasesType} from "./types";

const Canvases: FC<PropsWithChildren<CanvasesType>> = ({
  appState,
  mapImage,
  setAppState,
  setMouseEventDetails,
}) => {
  const {
    canvasMode,
    imageSettings: {elementSize, cssScaleFactor},
    gridSettings: {opacity: gridOpacity, colorHeight, colorWidth},
    cellSettings: {color, opacity, cellSize},
    walls,
  } = appState;

  const mapCanvas = React.useRef<HTMLCanvasElement>(null);
  const gridCanvas = React.useRef<HTMLCanvasElement>(null);
  const collisionCanvas = React.useRef<HTMLCanvasElement>(null);

  const [isMouseDown, setIsMouseDown] = React.useState<boolean>(false);
  function updateCollisionObject(canvasCoords: [number, number]) {
    const [cellX, cellY] = getCellCoords(canvasCoords);
    const clickedWallKey = `${cellX * cellSize.width},${
      cellY * cellSize.height
    }`;
    const newWalls = {...walls};
    if (canvasMode === "AddingTiles") {
      //don't add a wall we already have
      if (walls[clickedWallKey] === true) {
        return;
      }
      newWalls[clickedWallKey] = true;
    } else {
      //only remove a wall that exists
      if (!walls.hasOwnProperty(clickedWallKey)) {
        return;
      }
      delete newWalls[clickedWallKey];
    }
    setAppState((prevState) => {
      return {
        ...prevState,
        walls: newWalls,
      };
    });
  }

  function getCellCoords([x, y]: [number, number]): [number, number] {
    return [
      Math.floor(x / cssScaleFactor / cellSize.width),
      Math.floor(y / cssScaleFactor / cellSize.height),
    ];
  }
  const handleCollisionCanvasMouseEvent = (canvasCoords: [number, number]) => {
    setMouseEventDetails(
      `Mouse Coords: { x:  ${Math.floor(canvasCoords[0])}, y:  ${Math.floor(
        canvasCoords[1]
      )}} Cell Coords: ${getCellCoords(canvasCoords)}`
    );
    updateCollisionObject(canvasCoords);
  };

  function drawCell(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (!collisionCanvas.current) return;
    const rect = collisionCanvas.current.getBoundingClientRect();
    const canvasCoords = [e.clientX - rect.left, e.clientY - rect.top] as [
      number,
      number
    ];
    handleCollisionCanvasMouseEvent(canvasCoords);
  }

  function drawMap() {
    if (!mapCanvas.current) return;
    const mapCtx = mapCanvas.current.getContext("2d");
    if (!mapCtx) return;

    mapCtx.clearRect(0, 0, mapCanvas.current.width, mapCanvas.current.height);
    mapCtx.drawImage(mapImage, 0, 0);
  }

  function drawGrid() {
    if (!gridCanvas.current || !mapCanvas.current) return;
    const cellGridCtx = gridCanvas.current.getContext("2d");
    if (!cellGridCtx) return;
    const width = mapCanvas.current.width;
    const height = mapCanvas.current.height;
    cellGridCtx.clearRect(0, 0, width, height);
    // vertical lines
    cellGridCtx.fillStyle = colorHeight;
    for (let index = 1; index <= width / cellSize.width; index++) {
      cellGridCtx.fillRect(index * cellSize.width, 0, 1, height);
    }
    // horizontal lines
    cellGridCtx.fillStyle = colorWidth;
    for (let index = 1; index <= height / cellSize.height; index++) {
      cellGridCtx.fillRect(0, index * cellSize.height, width, 1);
    }
  }

  function drawWalls() {
    if (!collisionCanvas.current) return;
    const collisionCtx = collisionCanvas.current.getContext("2d");
    if (!collisionCtx) return;
    collisionCtx.clearRect(
      0,
      0,
      collisionCanvas.current.width,
      collisionCanvas.current.height
    );
    collisionCtx.fillStyle = color;
    collisionCtx.globalAlpha = opacity;
    Object.keys(walls).forEach((key) => {
      const [x, y] = key.split(",").map((n) => parseInt(n)); //{"16,0": true}
      collisionCtx.fillRect(x, y, cellSize.width, cellSize.height);
    });
  }
  function canvasDispatcher(action: {type: CanvasDispatchTypes}) {
    if (action.type === "drawAll") {
      console.log("drawing!");
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
    // set canvas dimensions when the img changes
    [mapCanvas, gridCanvas, collisionCanvas].forEach((c) => {
      if (!c.current) return;
      c.current.width = mapImage.width;
      c.current.height = mapImage.height;
    });
  }, [mapImage.src, mapImage.height, mapImage.width]);

  React.useEffect(() => {
    // draw all the things
    canvasDispatcher({type: "drawAll"});
  });
  return (
    <StyledCanvases
      style={{height: elementSize.height, width: elementSize.width}}
    >
      <StyledCanvas
        scaleFactor={cssScaleFactor}
        className="tilemap-canvas"
        ref={mapCanvas}
      />
      <StyledCanvas
        scaleFactor={cssScaleFactor}
        className="cell-grid-canvas"
        ref={gridCanvas}
        style={{opacity: gridOpacity}}
      />
      <StyledCanvas
        scaleFactor={cssScaleFactor}
        className="collision-canvas"
        ref={collisionCanvas}
        onMouseDown={(e) => {
          e.preventDefault(); // stop text highlighting when onMouseMove fires
          drawCell(e); // allow us to also draw when just clicking
          setIsMouseDown(true);
        }}
        onMouseMove={(e) => {
          if (isMouseDown) {
            drawCell(e); // allow us to draw when dragging
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
