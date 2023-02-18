import {FC, PropsWithChildren} from "react";
import {StyledExport} from "./styles";
import {JSONExportProps} from "./types";

export const JSONExport: FC<PropsWithChildren<JSONExportProps>> = ({
  appState,
  setAppState,
}) => {
  const {walls} = appState;

  const handleExportClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (Object.keys(walls).length > 0) {
      const a = document.createElement("a");

      a.download = "walls.json";
      a.href = window.URL.createObjectURL(
        new Blob([JSON.stringify(walls)], {
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
    <StyledExport>
      <button onClick={handleExportClick} id="exportJSON">
        Export
      </button>
      <button onClick={() => setAppState((prev) => ({...prev, walls: {}}))}>
        Clear Cells
      </button>
      <button onClick={() => console.log({walls})}>Console Log</button>
    </StyledExport>
  );
};

export default JSONExport;
