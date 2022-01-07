import React from "react";
import "../../styles/global.css";
import "../../styles/edit.css";

import { UTILS } from "../utils";
import Canvases from "./Canvases";

export type MapEditorState = {
  cssScaleFactor: number;
  imageProperties: string;
  isAddingTiles: boolean;
  isImageLoaded: boolean;
  cellSize: {
    width: number;
    height: number;
  };
  opacity: number;
  walls: {
    [x: string]: boolean;
  };
};

function MapEditor() {
  const [appState, setAppState] = React.useState<MapEditorState>({
    cssScaleFactor: 3,
    imageProperties: "",
    isAddingTiles: true,
    isImageLoaded: false,
    cellSize: { width: 16, height: 16 },
    opacity: 0.5,
    walls: {},
  });

  const [mapImage] = React.useState(new Image());
  const [mouseEventDetails, setMouseEventDetails] = React.useState("");

  mapImage.onload = () => {
    setAppState((prevState) => {
      return {
        ...prevState,
        isAddingTiles: true,
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

  const handleCollisionCanvasMouseDown = (canvasCoords: number[]) => {
    setMouseEventDetails(
      `Mouse Coords: { x:  ${Math.floor(canvasCoords[0])}, y:  ${Math.floor(
        canvasCoords[1]
      )}} Cell Coords: ${getCellCoords(canvasCoords)}`
    );
    updateCollisionObject(canvasCoords);
  };

  function updateCollisionObject(canvasCoords: number[]) {
    const [cellX, cellY] = getCellCoords(canvasCoords);
    const clickedWallKey = UTILS.asGridCoord(cellX, cellY);

    if (appState.isAddingTiles) {
      //don't add a wall we already have
      if (appState.walls[clickedWallKey] === true) {
        return;
      }

      addCollisionWall(clickedWallKey);
    } else {
      //only remove a wall that exists
      if (Object.keys(appState.walls).find((key) => key === clickedWallKey)) {
        removeCollisionWall(clickedWallKey);
      }
    }
    console.log(appState.walls);
  }

  function addCollisionWall(newWallKey: string) {
    setAppState((prevState) => {
      //add key to walls object for the cell that was clicked
      const accumulator: Record<string, boolean> = {};
      const newWalls = Object.keys(prevState.walls).reduce((obj, key) => {
        return {
          ...obj,
          [key]: true,
        };
      }, accumulator);

      newWalls[newWallKey] = true;

      return {
        ...prevState,
        walls: newWalls,
      };
    });
  }

  function removeCollisionWall(newWallKey: string) {
    setAppState((prevState) => {
      //remove key from walls object for the cell that was clicked
      const filtered = Object.keys(prevState.walls)
        .filter((key) => key !== newWallKey)
        .reduce((obj, key) => {
          return {
            ...obj,
            [key]: true,
          };
        }, {});

      return {
        ...prevState,
        walls: filtered,
      };
    });
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
          <div className="export">
            <button onClick={handleExportClick} id="exportJSON">
              Export
            </button>
          </div>
        </div>
        <div className="info">
          <p id="message">{mouseEventDetails}</p>
        </div>
        <Canvases
          mapImage={mapImage}
          cellSize={appState.cellSize}
          opacity={appState.opacity}
          walls={appState.walls}
          handleCollisionCanvasMouseDown={handleCollisionCanvasMouseDown}
        />
      </div>
    </div>
  );
}

export const FileUpload = ({
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

export interface CellGridType {
  cellSize: {
    width: number;
    height: number;
  };
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
  onCellSizeChange,
  onOpacityChange,
}: CellGridType): JSX.Element => {
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

export const CollisionRadioOptions = ({
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

export default MapEditor;
