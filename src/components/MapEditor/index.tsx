import React from "react";
import Canvases from "./Canvases";
import {StyledContainer, StyledControls, StyledInfo} from "./styles";
import {MapEditorStateConfig} from "./types";
import CellGridOptions from "./CellGridOptions";
import CollisionCanvasOptions from "./CollisionCanvasOptions";
import FileUpload from "./FileUpload";
import JSONExport from "./JSONExport";

export const defaultAppState: MapEditorStateConfig = {
  mapImage: new Image(),
  mouseEventDetails: "",
  imageSettings: {
    cssScaleFactor: 3, 
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
};

function MapEditor() {
  const [appState, setAppState] =
    React.useState<MapEditorStateConfig>(defaultAppState);
  const {
    mapImage,
    mouseEventDetails,
    imageSettings: {cssScaleFactor},
  } = appState;

  mapImage.onload = () => {
    let newSize = {
      height: mapImage.height * cssScaleFactor + 50,
      width: mapImage.width * cssScaleFactor + 50,
    };
    setAppState((prevState) => {
      return {
        ...prevState,
        imageSettings: {
          ...prevState.imageSettings,
          elementSize: newSize,
        },
        canvasMode: "AddingTiles",
        walls: {},
      };
    });
  };

  return (
    <div className="App">
      <StyledContainer>
        <StyledControls>
          <FileUpload appState={appState} setAppState={setAppState} />
          <CellGridOptions appState={appState} setAppState={setAppState} />
          <CollisionCanvasOptions
            appState={appState}
            setAppState={setAppState}
          />
          <JSONExport appState={appState} setAppState={setAppState} />
        </StyledControls>
        <StyledInfo>
          <p id="message">{mouseEventDetails}</p>
        </StyledInfo>
        <Canvases appState={appState} setAppState={setAppState} />
      </StyledContainer>
    </div>
  );
}

export default MapEditor;
