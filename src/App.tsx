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
    walls: {},
    mapImageSrc: "",
  });

  const handleFileOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files![0];
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);

    reader.onload = (_event) => {
      setAppState((s) => {
        return {
          ...appState,
          mapImageSrc: reader.result! as string,
        };
      });
    };
  };

  return (
    <div className="App">
      <div className="container">
        <div className="controls">
          <FileUpload
            imageProperties={appState.imageProperties}
            onChange={handleFileOnChange}
          />
          <CellGridOptions />
          <CollisionRadioOptions />
          <ExportJSON />
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
  onChange,
}: {
  imageProperties: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element => {
  return (
    <div className="status">
      <fieldset>
        <caption>Image Properties:</caption>
        <input
          type="file"
          name="upload"
          id="upload"
          accept="image/*"
          onChange={onChange}
        />
        <p id="image-properties">{imageProperties}</p>
      </fieldset>
    </div>
  );
};

const CellGridOptions = (): JSX.Element => {
  return (
    <fieldset>
      <caption>Cell Grid Size (pixels):</caption>
      <label htmlFor="width">Width</label>
      <input
        type="number"
        name="width"
        id="width"
        max="100"
        min="1"
        value="16"
      />

      <label htmlFor="height">Height</label>
      <input
        type="number"
        name="height"
        id="height"
        max="100"
        min="1"
        value="16"
      />

      <label htmlFor="opacity">Opacity</label>
      <input
        type="range"
        name="opacity"
        id="opacity"
        max="1"
        min="0"
        value=".5"
        step="0.01"
      />
    </fieldset>
  );
};

const CollisionRadioOptions = (): JSX.Element => {
  return (
    <>
      <input type="radio" id="add" name="wall" value="Add" checked />
      <label htmlFor="add">Add Wall</label>

      <input type="radio" id="remove" name="wall" value="Remove" />
      <label htmlFor="remove">Remove Wall</label>
    </>
  );
};

const ExportJSON = (): JSX.Element => {
  return (
    <div className="export">
      <a href="#" id="exportJSON" type="submit">
        Export
      </a>
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
