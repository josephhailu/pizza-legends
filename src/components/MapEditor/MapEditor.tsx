import React from "react";
import Canvases from "./Canvases";
import {
  StyledContainer,
  StyledControl,
  StyledControls,
  StyledExport,
  StyledInfo,
} from "./styles";

export type CanvasMode = "AddingTiles" | "RemovingTiles";

export type MapEditorState = {
  imageSettings: {
    cssScaleFactor: number;
    imageProperties: string;
    isImageLoaded: boolean;
    elementSize: {
      width: number;
      height: number;
    };
  };
  canvasMode: CanvasMode;
  gridSettings: {
    opacity: number;
    colorHeight: string;
    colorWidth: string;
  };
  walls: {
    [x: string]: boolean;
  };
  cellSettings: {
    opacity: number;
    color: string;
    cellSize: {
      width: number;
      height: number;
    };
  };
};

function MapEditor() {
  const [appState, setAppState] = React.useState<MapEditorState>({
    imageSettings: {
      cssScaleFactor: 3, // basically the zoom level
      imageProperties: "",
      isImageLoaded: false,
      elementSize: {width: 0, height: 0},
    },
    canvasMode: "AddingTiles",
    gridSettings: {
      opacity: 0.5,
      colorHeight: "#0000FF",
      colorWidth: "#FF7300",
    },
    walls: {},
    cellSettings: {
      opacity: 0.5,
      color: "#0AE1C8",
      cellSize: {width: 16, height: 16},
    },
  });
  const {cellSettings, gridSettings, imageSettings, canvasMode, walls} =
    appState;

  const [mapImage] = React.useState(new Image());
  const [mouseEventDetails, setMouseEventDetails] = React.useState("");

  mapImage.onload = () => {
    let newSize = {
      height: mapImage.height * imageSettings.cssScaleFactor + 50,
      width: mapImage.width * imageSettings.cssScaleFactor + 50,
    };
    setAppState((prevState) => {
      return {
        ...prevState,
        imageSettings: {
          ...prevState.imageSettings,
          imageProperties: `Width :  ${mapImage.width}px Height: ${mapImage.height}px`,
          isImageLoaded: true,
          elementSize: newSize,
        },
        canvasMode: "AddingTiles",
        walls: {},
      };
    });
  };

  const handleFileOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files![0]!;
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
        cellSettings: {
          ...prevState.cellSettings,
          cellSize: {
            ...prevState.cellSettings.cellSize,
            [dimension]: parseInt(e.target.value),
          },
        },
        walls: {},
        canvasMode: "AddingTiles",
      };
    });
  };

  const handleColorHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppState((prevState) => {
      return {
        ...prevState,
        gridSettings: {
          ...prevState.gridSettings,
          colorHeight: e.target.value,
        },
      };
    });
  };

  const handleColorWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppState((prevState) => {
      return {
        ...prevState,
        gridSettings: {
          ...prevState.gridSettings,
          colorWidth: e.target.value,
        },
      };
    });
  };

  const handleCellColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppState((prevState) => {
      return {
        ...prevState,
        cellSettings: {
          ...prevState.cellSettings,
          color: e.target.value,
        },
      };
    });
  };

  const handleCellOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppState((prevState) => {
      return {
        ...prevState,
        cellSettings: {
          ...prevState.cellSettings,
          opacity: parseFloat(e.target.value),
        },
      };
    });
  };

  const handleGridOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppState((prevState) => {
      return {
        ...prevState,
        gridSettings: {
          ...prevState.gridSettings,
          opacity: parseFloat(e.target.value),
        },
      };
    });
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppState((prevState) => {
      return {
        ...prevState,
        imageSettings: {
          ...prevState.imageSettings,
          cssScaleFactor: e.target.valueAsNumber,
        },
      };
    });
  };

  const handleRadioClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppState((prevState) => {
      return {
        ...prevState,
        canvasMode:
          e.target.value === "AddingTiles" ? "AddingTiles" : "RemovingTiles",
      };
    });
  };

  const handleExportClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (Object.keys(appState.walls).length > 0) {
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

  const handleCollisionCanvasMouseEvent = (canvasCoords: [number, number]) => {
    setMouseEventDetails(
      `Mouse Coords: { x:  ${Math.floor(canvasCoords[0])}, y:  ${Math.floor(
        canvasCoords[1]
      )}} Cell Coords: ${getCellCoords(canvasCoords)}`
    );
    updateCollisionObject(canvasCoords);
  };

  function updateCollisionObject(canvasCoords: [number, number]) {
    const [cellX, cellY] = getCellCoords(canvasCoords);
    const clickedWallKey = `${cellX * cellSettings.cellSize.width},${
      cellY * cellSettings.cellSize.height
    }`;
    const newWalls = {...walls};
    if (canvasMode === "AddingTiles") {
      //don't add a wall we already have
      if (walls[clickedWallKey] === true) {
        return;
      }
      console.log("drawing!");
      newWalls[clickedWallKey] = true;
    } else {
      //only remove a wall that exists
      if (!walls.hasOwnProperty(clickedWallKey)) {
        return;
      }
      console.log("erasing!");
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
      Math.floor(
        x / imageSettings.cssScaleFactor / cellSettings.cellSize.width
      ),
      Math.floor(
        y / imageSettings.cssScaleFactor / cellSettings.cellSize.height
      ),
    ];
  }
  return (
    <div className="App">
      <StyledContainer>
        <StyledControls>
          <FileUpload
            imageProperties={imageSettings.imageProperties}
            zoom={imageSettings.cssScaleFactor}
            onFileChange={handleFileOnChange}
            onZoomChange={handleZoomChange}
          />
          <CellGridOptions
            cellSize={cellSettings.cellSize}
            opacity={gridSettings.opacity}
            colorHeight={gridSettings.colorHeight}
            onColorHeightChange={handleColorHeightChange}
            colorWidth={gridSettings.colorWidth}
            onColorWidthChange={handleColorWidthChange}
            onCellSizeChange={handleCellSizeChange}
            onOpacityChange={handleGridOpacityChange}
          />
          <CollisionRadioOptions
            canvasMode={canvasMode}
            onRadioClick={handleRadioClick}
            cellColor={cellSettings.color}
            opacity={cellSettings.opacity}
            onOpacityChange={handleCellOpacityChange}
            onCellColorChange={handleCellColorChange}
          />
          <StyledExport>
            <button onClick={handleExportClick} id="exportJSON">
              Export
            </button>
            <button
              onClick={() => setAppState((prev) => ({...prev, walls: {}}))}
            >
              Clear Cells
            </button>
            <button onClick={() => console.log({walls: appState.walls})}>
              Log
            </button>
          </StyledExport>
        </StyledControls>
        <StyledInfo>
          <p id="message">{mouseEventDetails}</p>
        </StyledInfo>
        <Canvases
          scaleFactor={imageSettings.cssScaleFactor}
          mapImage={mapImage}
          cellSize={cellSettings.cellSize}
          cellColor={cellSettings.color}
          opacity={cellSettings.opacity}
          gridSettings={gridSettings}
          walls={walls}
          handleCollisionCanvasMouseEvent={handleCollisionCanvasMouseEvent}
          elementSize={imageSettings.elementSize}
        />
      </StyledContainer>
    </div>
  );
}

export const FileUpload = ({
  imageProperties,
  zoom,
  onFileChange,
  onZoomChange,
}: {
  imageProperties: string;
  zoom: number;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onZoomChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element => {
  return (
    <div>
      <h3>Image Properties:</h3>
      <StyledControl>
        <div>
          <label htmlFor="upload">Upload Image</label>
          <input
            type="file"
            name="upload"
            id="upload"
            accept="image/*"
            onChange={onFileChange}
          />
        </div>
        {imageProperties && (
          <>
            <div>
              <label htmlFor="zoom">Zoom</label>
              <input
                type="range"
                name="opacity"
                id="opacity"
                max="20"
                min="1"
                value={zoom}
                step="1"
                onChange={onZoomChange}
              />
            </div>
            <div>
              {" "}
              <p id="image-properties">{imageProperties}</p>
            </div>
          </>
        )}
      </StyledControl>
    </div>
  );
};

export interface CellGridType {
  cellSize: {
    width: number;
    height: number;
  };
  colorHeight: string;
  onColorHeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  colorWidth: string;
  onColorWidthChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  opacity: number;
  onCellSizeChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    dimension: "width" | "height"
  ) => void;
  onOpacityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CellGridOptions = ({
  cellSize,
  opacity,
  colorHeight,
  colorWidth,
  onColorHeightChange,
  onColorWidthChange,
  onCellSizeChange,
  onOpacityChange,
}: CellGridType): JSX.Element => {
  return (
    <div>
      <h3>Cell Grid Size (pixels):</h3>
      <StyledControl>
        <div>
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
        </div>
        <div>
          <label htmlFor="color-width">Color</label>
          <input
            type="color"
            name="color-width"
            id="color-width"
            value={colorWidth}
            onChange={onColorWidthChange}
          />
        </div>
        <div>
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
        </div>
        <div>
          <label htmlFor="color-height">Color</label>
          <input
            type="color"
            name="color-height"
            id="color-height"
            value={colorHeight}
            onChange={onColorHeightChange}
          />
        </div>
        <div>
          <label htmlFor="grid-opacity">Opacity</label>
          <input
            type="range"
            name="grid-opacity"
            id="grid-opacity"
            max="1"
            min="0"
            value={opacity}
            step="0.01"
            onChange={onOpacityChange}
          />
        </div>
      </StyledControl>
    </div>
  );
};

export const CollisionRadioOptions = ({
  canvasMode,
  cellColor,
  opacity,
  onCellColorChange,
  onRadioClick,
  onOpacityChange,
}: {
  canvasMode: CanvasMode;
  cellColor: string;
  opacity: number;
  onCellColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRadioClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpacityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element => {
  return (
    <StyledControl>
      <div>
        <label htmlFor="add">Add Wall</label>
        <input
          type="radio"
          id="add"
          name="wall"
          value="AddingTiles"
          checked={canvasMode === "AddingTiles"}
          onChange={onRadioClick}
        />
      </div>
      <div>
        <label htmlFor="remove">Remove Wall</label>
        <input
          type="radio"
          id="remove"
          name="wall"
          value="RemovingTiles"
          checked={canvasMode === "RemovingTiles"}
          onChange={onRadioClick}
        />
      </div>
      <div>
        <label htmlFor="color">Color</label>
        <input
          type="color"
          name="color"
          id="color"
          value={cellColor}
          onChange={onCellColorChange}
        />
      </div>
      <div>
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
      </div>
    </StyledControl>
  );
};

export default MapEditor;
