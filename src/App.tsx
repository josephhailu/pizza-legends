import React from "react";
import "./styles/global.css";
import "./styles/edit.css";
import { UTILS } from "./components/utils";

function App() {
  const [appState, setAppState] = React.useState<{
    cssScaleFactor: number;
    imageProperties: string;
    mouseEventDetails: string;
    isAddingTiles: boolean;
    isImageLoaded: boolean;
    cellSize: { width: number; height: number };
    opacity: number;
    walls: { [x: string]: boolean };
  }>({
    cssScaleFactor: 3,
    imageProperties: "",
    mouseEventDetails: "",
    isAddingTiles: true,
    isImageLoaded: false,
    cellSize: { width: 16, height: 16 },
    opacity: 0.5,
    walls: {},
  });

  const [mapImage] = React.useState(new Image());
  mapImage.onload = () => {
    setAppState((prevState) => {
      return {
        ...prevState,
        isImageLoaded: true,
        imageProperties: `Width :  ${mapImage.width}px Height: ${mapImage.height}px`,
        walls: {},
      };
    });
  };

  const handleFileOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files![0];
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);

    reader.onload = (_event) => {
      mapImage.src = reader.result as string;
    };
  };

  const handleCellSizeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    dimension: "height" | "width"
  ) => {
    setAppState((prevState) => {
      return {
        ...prevState,
        cellSize: {
          ...appState.cellSize,
          [dimension]: parseInt(e.target.value),
        },
        walls: {},
      };
    });
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppState((prevState) => {
      return {
        ...prevState,
        opacity: parseFloat(e.target.value),
      };
    });
  };

  const handleRadioClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppState((prevState) => {
      return {
        ...prevState,
        isAddingTiles: e.target.value === "Add",
      };
    });
  };

  const handleExportClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!!appState.walls && Object.keys(appState.walls).length > 0) {
      const a = document.createElement("a");

      a.download = "walls.json";
      a.href = window.URL.createObjectURL(
        new Blob([JSON.stringify(appState.walls)], {
          type: "text/json",
        })
      );

      a.dispatchEvent(
        new MouseEvent("click", {
          view: window,
          bubbles: true,
          cancelable: true,
        })
      );
      a.remove();
    }
  };

  function updateMouseCoordMessage([x, y]: number[]) {
    setAppState((prevState) => {
      return {
        ...prevState,
        mouseEventDetails: `Mouse Coords: { x:  ${Math.floor(
          x
        )}, y:  ${Math.floor(y)}} Cell Coords: ${getCellCoords([x, y])}`,
      };
    });
  }

  function updateCollisionObject(canvasCoords: number[]) {
    const [cellX, cellY] = getCellCoords(canvasCoords);

    if (appState.isAddingTiles) {
      if (appState.walls[UTILS.asGridCoord(cellX, cellY)]) {
        return;
      }
      setAppState((prevState) => {
        return {
          ...prevState,
          walls: {
            ...prevState.walls,
            [UTILS.asGridCoord(cellX, cellY)]: true,
          },
        };
      });
    } else {
      setAppState((prevState) => {
        //remove key from walls object for the cell that was clicked
        const filtered = Object.keys(prevState.walls)
          .filter((key) => key !== UTILS.asGridCoord(cellX, cellY))
          .reduce((obj, key) => {
            return {
              ...obj,
              [key]: prevState.walls,
            };
          }, {});

        return {
          ...prevState,
          walls: filtered,
        };
      });
    }
  }

  function getCellCoords([x, y]: number[]) {
    return [
      Math.floor(x / appState.cssScaleFactor / appState.cellSize.width),
      Math.floor(y / appState.cssScaleFactor / appState.cellSize.height),
    ];
  }
  return (
    <div className="App">
      <div className="container">
        <div className="controls">
          <FileUpload
            imageProperties={appState.imageProperties}
            onFileChange={handleFileOnChange}
          />
          <CellGridOptions
            cellSize={appState.cellSize}
            opacity={appState.opacity}
            onCellSizeChange={handleCellSizeChange}
            onOpacityChange={handleOpacityChange}
          />
          <CollisionRadioOptions
            isAddingTiles={appState.isAddingTiles}
            onRadioClick={handleRadioClick}
          />
          <ExportJSON onExportClick={handleExportClick} />
        </div>
        <div className="info">
          <p id="message">{appState.mouseEventDetails}</p>
        </div>
        <Canvases
          mapImage={mapImage}
          cellSize={appState.cellSize}
          opacity={appState.opacity}
          walls={appState.walls}
          updateCollisionObject={updateCollisionObject}
          updateMouseCoordMessage={updateMouseCoordMessage}
        />
      </div>
    </div>
  );
}

const FileUpload = ({
  imageProperties,
  onFileChange,
}: {
  imageProperties: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element => {
  return (
    <div className="status">
      <fieldset>
        <h3>Image Properties:</h3>
        <input
          type="file"
          name="upload"
          id="upload"
          accept="image/*"
          onChange={onFileChange}
        />
        <p id="image-properties">{imageProperties}</p>
      </fieldset>
    </div>
  );
};

const CellGridOptions = ({
  cellSize,
  opacity,
  onCellSizeChange,
  onOpacityChange,
}: {
  cellSize: { width: number; height: number };
  opacity: number;
  onCellSizeChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    dimension: "width" | "height"
  ) => void;
  onOpacityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element => {
  return (
    <fieldset>
      <h3>Cell Grid Size (pixels):</h3>
      <label htmlFor="width">Width</label>
      <input
        type="number"
        name="width"
        id="width"
        max="100"
        min="1"
        value={cellSize.width}
        onChange={(e) => {
          onCellSizeChange(e, "width");
        }}
      />

      <label htmlFor="height">Height</label>
      <input
        type="number"
        name="height"
        id="height"
        max="100"
        min="1"
        value={cellSize.height}
        onChange={(e) => {
          onCellSizeChange(e, "height");
        }}
      />

      <label htmlFor="opacity">Opacity</label>
      <input
        type="range"
        name="opacity"
        id="opacity"
        max="1"
        min="0"
        value={opacity}
        step="0.01"
        onChange={onOpacityChange}
      />
    </fieldset>
  );
};

const CollisionRadioOptions = ({
  isAddingTiles,
  onRadioClick,
}: {
  isAddingTiles: boolean;
  onRadioClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element => {
  return (
    <>
      <input
        type="radio"
        id="add"
        name="wall"
        value="Add"
        checked={isAddingTiles}
        onChange={onRadioClick}
      />
      <label htmlFor="add">Add Wall</label>

      <input
        type="radio"
        id="remove"
        name="wall"
        value="Remove"
        checked={!isAddingTiles}
        onChange={onRadioClick}
      />
      <label htmlFor="remove">Remove Wall</label>
    </>
  );
};

const ExportJSON = ({
  onExportClick,
}: {
  onExportClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}): JSX.Element => {
  return (
    <div className="export">
      <button onClick={onExportClick} id="exportJSON">
        Export
      </button>
    </div>
  );
};

const Canvases = ({
  mapImage,
  cellSize,
  opacity,
  walls,
  updateMouseCoordMessage,
  updateCollisionObject,
}: {
  mapImage: HTMLImageElement;
  cellSize: { width: number; height: number };
  opacity: number;
  walls: { [x: string]: boolean };
  updateMouseCoordMessage: (canvasCoords: number[]) => void;
  updateCollisionObject: (canvasCoords: number[]) => void;
}): JSX.Element => {
  const [isImageLoaded, setIsImageLoaded] = React.useState(false);
  const mapCanvas = React.useRef<HTMLCanvasElement>(null);
  const gridCanvas = React.useRef<HTMLCanvasElement>(null);
  const collisionCanvas = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    //set canvas dimensions
    setIsImageLoaded(false);

    mapCanvas.current!.width = mapImage.width;
    mapCanvas.current!.height = mapImage.height;

    gridCanvas.current!.width = mapImage.width;
    gridCanvas.current!.height = mapImage.height;

    collisionCanvas.current!.width = mapImage.width;
    collisionCanvas.current!.height = mapImage.height;
  }, [mapImage.src, mapImage.width, mapImage.height]);

  const memoDraw = React.useCallback(() => {
    //draw map
    const mapCtx = mapCanvas.current!.getContext("2d")!;

    mapCtx.clearRect(0, 0, mapCanvas.current!.width, mapCanvas.current!.height);
    mapCtx.drawImage(mapImage, 0, 0);
    setIsImageLoaded(true);

    //draw grid
    const cellGridCtx = gridCanvas.current!.getContext("2d")!;
    const width = mapCanvas.current!.width;
    const height = mapCanvas.current!.height;
    cellGridCtx.clearRect(0, 0, width, height);

    // draw vertical grid lines
    cellGridCtx.fillStyle = "blue";
    for (let index = 1; index <= width / cellSize.width; index++) {
      cellGridCtx.fillRect(index * cellSize.width, 0, 0.5, height);
    }

    // draw horizontal grid lines
    cellGridCtx.fillStyle = "orange";
    for (let index = 1; index <= height / cellSize.height; index++) {
      cellGridCtx.fillRect(0, index * cellSize.height, width, 0.5);
    }
    //draw collision object
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
  }, [cellSize.height, cellSize.width, mapImage, walls]);

  React.useEffect(() => {
    memoDraw();
  }, [mapImage.src, opacity, walls, cellSize, memoDraw]);

  const handleCollisionCanvasMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (isImageLoaded) {
      const rect = collisionCanvas.current!.getBoundingClientRect();

      const canvasCoords = [e.clientX - rect.left, e.clientY - rect.top];
      updateMouseCoordMessage(canvasCoords);
      updateCollisionObject(canvasCoords);
    }
  };
  return (
    <div className="canvases">
      <canvas className="tilemap-canvas" ref={mapCanvas}></canvas>
      <canvas
        className="cell-grid-canvas"
        ref={gridCanvas}
        style={{ opacity: opacity }}
      ></canvas>
      <canvas
        className="collision-canvas"
        ref={collisionCanvas}
        onMouseDown={handleCollisionCanvasMouseDown}
      ></canvas>
    </div>
  );
};

export default App;
