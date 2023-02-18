import React from "react";
import Canvases from "./Canvases";
import {
  StyledContainer,
  StyledControls,
  StyledExport,
  StyledInfo,
} from "./styles";
import {MapEditorStateConfig} from "./types";
import CellGridOptions from "./CellGridOptions";
import CollisionCanvasOptions from "./CollisionCanvasOptions";
import FileUpload from "./FileUpload";

function MapEditor() {
  const [appState, setAppState] = React.useState<MapEditorStateConfig>({
    imageSettings: {
      cssScaleFactor: 3,
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
  const {imageSettings} = appState;

  const [mouseEventDetails, setMouseEventDetails] = React.useState("");
  const [mapImage] = React.useState(new Image());
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

  return (
    <div className="App">
      <StyledContainer>
        <StyledControls>
          <FileUpload
            mapImage={mapImage}
            appState={appState}
            setAppState={setAppState}
          />
          <CellGridOptions appState={appState} setAppState={setAppState} />
          <CollisionCanvasOptions
            appState={appState}
            setAppState={setAppState}
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
          appState={appState}
          mapImage={mapImage}
          setAppState={setAppState}
          setMouseEventDetails={setMouseEventDetails}
        ></Canvases>
      </StyledContainer>
    </div>
  );
}

export default MapEditor;
