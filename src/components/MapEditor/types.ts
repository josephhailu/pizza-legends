export type CanvasMode = "AddingTiles" | "RemovingTiles";
export type StyledCanvasProps = {scaleFactor: number};
export type ImageSettings = {
  /** basically the zoom level of the image. Passed as variable to the styled component that wraps a canvas element */
  cssScaleFactor: number;
  elementSize: {
    width: number;
    height: number;
  };
};

export type GridSettings = {
  opacity: number;
  colorHeight: string;
  colorWidth: string;
};

export type CellSettings = {
  opacity: number;
  color: string;
  cellSize: {
    width: number;
    height: number;
  };
};

export type Walls = {
  [x: string]: boolean;
};

export type MapEditorStateConfig = {
  mapImage: HTMLImageElement;
  mouseEventDetails: string;
  imageSettings: ImageSettings;
  canvasMode: CanvasMode;
  gridSettings: GridSettings;
  walls: Walls;
  cellSettings: CellSettings;
};

export interface MapEditorComponentProps {
  appState: MapEditorStateConfig;
  setAppState: React.Dispatch<React.SetStateAction<MapEditorStateConfig>>;
}

export interface FileUploadProps extends MapEditorComponentProps {}

export interface CellGridProps extends MapEditorComponentProps {}

export interface CollisionCanvasOptionsProps extends MapEditorComponentProps {}

export interface JSONExportProps extends MapEditorComponentProps {}

export type CanvasDispatchTypes =
  | "drawAll"
  | "drawGrid"
  | "drawMap"
  | "drawWalls";

export interface CanvasesType extends MapEditorComponentProps {}
