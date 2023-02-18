import {
  CanvasMode,
  ImageSettings,
  GridSettings,
  Walls,
  CellSettings,
  MapEditorStateConfig,
} from "./types";

// not currently used
export default class MapEditorState {
  imageSettings: ImageSettings;
  canvasMode: CanvasMode;
  gridSettings: GridSettings;
  walls: Walls;
  cellSettings: CellSettings;

  constructor(config?: MapEditorStateConfig) {
    this.imageSettings = config?.imageSettings ?? {
      cssScaleFactor: 3,
      elementSize: {width: 0, height: 0},
    };
    this.canvasMode = config?.canvasMode ?? "AddingTiles";
    this.gridSettings = config?.gridSettings ?? {
      opacity: 0.5,
      colorHeight: "#0000FF",
      colorWidth: "#FF7300",
    };
    this.walls = config?.walls ?? {};
    this.cellSettings = config?.cellSettings ?? {
      opacity: 0.5,
      color: "#0AE1C8",
      cellSize: {width: 16, height: 16},
    };
  }
}
