type CanvasTypes = "mapCanvas" | "cellGridCanvas" | "collisionGridCanvas";
type Canvases = Record<CanvasTypes, HTMLCanvasElement>;

interface TileMapEditorConfig {
  cssScaleFactor: number;
}

class TileMapEditor {
  cssScaleFactor: number;
  canvases: Canvases;

  fileElement: HTMLInputElement;
  imagePropertiesElement: HTMLParagraphElement;
  widthElement: HTMLInputElement;
  heightElement: HTMLInputElement;
  opacityElement: HTMLInputElement;

  messageElement: HTMLParagraphElement;

  image: HTMLImageElement;
  isLoaded: boolean = false;
  selectedFile?: File;

  cellSize: {width: number; height: number};
  walls: {[x: string]: boolean};

  isAddingTiles: boolean;
  constructor({cssScaleFactor = 3}: TileMapEditorConfig) {
    this.cssScaleFactor = cssScaleFactor;
    this.canvases = {
      mapCanvas: document.querySelector(".tilemap-canvas") as HTMLCanvasElement,
      cellGridCanvas: document.querySelector(
        ".cell-grid-canvas"
      ) as HTMLCanvasElement,
      collisionGridCanvas: document.querySelector(
        ".collision-canvas"
      ) as HTMLCanvasElement,
    };

    this.fileElement = document.querySelector("#upload") as HTMLInputElement;
    this.imagePropertiesElement = document.querySelector(
      "#image-properties"
    ) as HTMLParagraphElement;
    this.widthElement = document.querySelector("#width") as HTMLInputElement;
    this.heightElement = document.querySelector("#height") as HTMLInputElement;
    this.opacityElement = document.querySelector(
      "#opacity"
    ) as HTMLInputElement;

    this.messageElement = document.querySelector(
      "#message"
    ) as HTMLInputElement;

    this.image = new Image();

    this.image.onload = () => {
      this.isLoaded = true;
      Object.values(this.canvases).forEach((c) => {
        c.width = this.image.width;
        c.height = this.image.height;
      });

      this.imagePropertiesElement.innerText = `Width :  ${this.image.width}px Height: ${this.image.height}px`;
      this.walls = {};

      this.startApp();
    };

    this.isAddingTiles = (
      document.querySelector("#add")! as HTMLInputElement
    ).checked;
    this.cellSize = {
      height: parseInt(this.widthElement.value) || 16,
      width: parseInt(this.heightElement.value) || 16,
    };

    this.walls = {};
  }

  init() {
    //listener for file load
    this.fileElement.addEventListener(
      "change",
      (e) => this.handleFile(e),
      false
    );

    //listener for cell width and height
    this.widthElement.addEventListener(
      "change",
      (e) => this.handleCellSizeChange(e, "width"),
      false
    );
    this.heightElement.addEventListener(
      "change",
      (e) => this.handleCellSizeChange(e, "height"),
      false
    );

    //listener for opacity
    this.opacityElement.addEventListener(
      "change",
      (e) =>
        (this.canvases.cellGridCanvas.style.opacity = (
          e.target! as HTMLInputElement
        ).value),
      false
    );

    //listener for grid canvas click
    this.canvases.collisionGridCanvas.addEventListener("mousedown", (e) => {
      let rect = this.canvases.collisionGridCanvas.getBoundingClientRect();

      let canvasCoords = [e.clientX - rect.left, e.clientY - rect.top];
      this.updateInfo(canvasCoords);
      this.drawCollisionRect(canvasCoords);
    });

    //listener for radio
    document.querySelectorAll('input[name="wall"]')!.forEach((element) => {
      element.addEventListener(
        "click",
        (e) => {
          if ((e.target! as HTMLInputElement).matches("input[type='radio']")) {
            this.isAddingTiles =
              (e.target! as HTMLInputElement).value === "Add";
          }
        },
        false
      );
    });

    //https://stackoverflow.com/a/26414528/11449115
    //listener for JSON export
    document.querySelector("#exportJSON")!.addEventListener(
      "click",
      () => {
        if (!!this.walls && Object.values(this.walls).length !== 0) {
          let data =
            "text/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify(this.walls));
          document
            .querySelector("#exportJSON")!
            .setAttribute("href", "data:" + data);

          document
            .querySelector("#exportJSON")!
            .setAttribute("download", "data.json");
        }
      },
      false
    );
  }

  drawCollisionRect(canvasCoords: number[]) {
    let [cellX, cellY] = this.getCellCoords(canvasCoords);

    //top left canvas coords of cell
    let canvasX = cellX * this.cellSize.width;
    let canvasY = cellY * this.cellSize.height;

    if (this.isAddingTiles) {
      if (!this.walls[UTILS.asGridCoord(cellX, cellY)]) {
        this.walls[UTILS.asGridCoord(cellX, cellY)] = true;
        this.drawWall(canvasX, canvasY);
      } else {
        return;
      }
    } else {
      this.drawWall(canvasX, canvasY, false);
      delete this.walls[UTILS.asGridCoord(cellX, cellY)];
    }
  }

  private drawWall(x: number, y: number, adding: boolean = true) {
    let collisionCtx = this.canvases.collisionGridCanvas.getContext("2d")!;
    if (adding) {
      collisionCtx.fillStyle = "green";
      collisionCtx.globalAlpha = 0.3;
      collisionCtx.fillRect(x, y, this.cellSize.width, this.cellSize.height);
    } else {
      collisionCtx.fillStyle = "rgba(0, 0, 0, 0)";
      collisionCtx.clearRect(x, y, this.cellSize.width, this.cellSize.height);
    }
  }

  private updateInfo([x, y]: number[]) {
    this.messageElement.innerHTML = `Mouse Coords: { x:  ${Math.floor(
      x
    )}, y:  ${Math.floor(y)}}<br>Cell Coords: ${this.getCellCoords([x, y])}`;
  }

  getCellCoords([x, y]: number[]) {
    return [
      Math.floor(x / this.cssScaleFactor / this.cellSize.width),
      Math.floor(y / this.cssScaleFactor / this.cellSize.height),
    ];
  }

  handleCellSizeChange(e: Event, dimension: "height" | "width"): any {
    this.cellSize = {
      ...this.cellSize,
      [dimension]: parseInt((e.target! as HTMLInputElement).value),
    };
    this.walls = {};
    this.drawCellGrid();
  }

  /**
   * https://stackoverflow.com/a/56140769/11449115
   * @param e
   */
  handleFile(e: Event) {
    this.selectedFile = (e.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);

    reader.onload = (_event) => {
      this.image.src = reader.result! as string;
    };
  }

  startApp() {
    Object.values(this.canvases).forEach((c) => {
      let ctx = c.getContext("2d")!;
      ctx.clearRect(0, 0, c.width, c.height);
    });

    let mapCtx = this.canvases.mapCanvas.getContext("2d")!;
    mapCtx.drawImage(this.image, 0, 0);

    //draw grid based on image
    this.drawCellGrid();
  }

  private drawCellGrid() {
    // draw vertical grid lines
    this.drawGridLines(this.cellSize.width);
    // draw horizontal grid lines
    this.drawGridLines(this.cellSize.height);
  }

  drawGridLines(axisCellSize: number) {
    let cellGridCtx = this.canvases.cellGridCanvas.getContext("2d")!;
    let width = this.canvases.mapCanvas.width;
    let height = this.canvases.mapCanvas.height;

    cellGridCtx.clearRect(0, 0, width, height);
    cellGridCtx.fillStyle = "blue";
    for (let index = 1; index <= width / axisCellSize; index++) {
      cellGridCtx.fillRect(index * axisCellSize, 0, 0.5, height);
    }
  }

  draw() {
    //draw canvas layers
    //draw image layer
    //draw cell grid layer
    this.drawCellGrid();
    //draw collision grid layer
  }
}

window.onload = function () {
  const tme = new TileMapEditor({cssScaleFactor: 3});
  tme.init();
};
