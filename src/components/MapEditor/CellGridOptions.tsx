import {FC, PropsWithChildren} from "react";
import {StyledControl} from "./styles";
import {CellGridProps} from "./types";

export const CellGridOptions: FC<PropsWithChildren<CellGridProps>> = ({
  appState,
  setAppState,
}) => {
  const {
    cellSettings: {cellSize},
    gridSettings: {colorHeight, colorWidth, opacity},
  } = appState;

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
              handleCellSizeChange(e, "width");
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
            onChange={handleColorWidthChange}
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
              handleCellSizeChange(e, "height");
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
            onChange={handleColorHeightChange}
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
            onChange={handleGridOpacityChange}
          />
        </div>
      </StyledControl>
    </div>
  );
};

export default CellGridOptions;
