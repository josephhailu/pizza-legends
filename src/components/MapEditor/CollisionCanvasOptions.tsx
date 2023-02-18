import {FC, PropsWithChildren} from "react";
import {StyledControl} from "./styles";
import {CanvasMode, CollisionCanvasOptionsProps} from "./types";

export const CollisionCanvasOptions: FC<
  PropsWithChildren<CollisionCanvasOptionsProps>
> = ({appState, setAppState}) => {
  const {
    canvasMode,
    cellSettings: {color, opacity},
  } = appState;

  const handleRadioClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppState((prevState) => {
      return {
        ...prevState,
        canvasMode: e.target.value as CanvasMode,
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
          onChange={handleRadioClick}
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
          onChange={handleRadioClick}
        />
      </div>
      <div>
        <label htmlFor="color">Color</label>
        <input
          type="color"
          name="color"
          id="color"
          value={color}
          onChange={handleCellColorChange}
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
          onChange={handleCellOpacityChange}
        />
      </div>
    </StyledControl>
  );
};

export default CollisionCanvasOptions;
