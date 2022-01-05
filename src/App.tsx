import React from "react";
import "./styles/global.css";
import "./styles/edit.css";

function App() {
  const [appState, setAppState] = React.useState({
    cssScaleFactor: 3,
    imageProperties: "",
    mouseEventDetails: "",
    isAddingTiles: true,
    isImageLoaded: false,
    cellSize: { width: 16, height: 16 },
    opacity: 0.5,
    walls: {},
    mapImageSrc: "",
  });

  const handleFileOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files![0];
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);

    reader.onload = (_event) => {
      setAppState((prevState) => {
        return {
          ...prevState,
          mapImageSrc: reader.result as string,
        };
      });
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
      const blob = new Blob([JSON.stringify(appState.walls)], {
        type: "text/json",
      });
      const a = document.createElement("a");
      a.download = "walls.json";
      a.href = window.URL.createObjectURL(blob);
      const clickEvent = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      a.dispatchEvent(clickEvent);
      a.remove();
    }
  };

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
        <Canvases />
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

const Canvases = (): JSX.Element => {
  return (
    <div className="canvases">
      <canvas className="tilemap-canvas"></canvas>
      <canvas className="cell-grid-canvas"></canvas>
      <canvas className="collision-canvas"></canvas>
    </div>
  );
};

export default App;
