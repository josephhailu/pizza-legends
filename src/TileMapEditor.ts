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

  // addElement: HTMLInputElement;
  messageElement: HTMLParagraphElement;

  image: HTMLImageElement;
  isLoaded: boolean = false;
  selectedFile?: File;

  cellSize: {width: number; height: number};

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

    //   this. addElement = document.querySelector("#add") as HTMLInputElement;
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

      this.imagePropertiesElement.innerText = `Width :  ${this.image.width}px\n Height: ${this.image.height}px`;

      this.startApp();
    };

    this.cellSize = {
      height: parseInt(this.widthElement.value) || 16,
      width: parseInt(this.heightElement.value) || 16,
    };
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
      this.messageElement.innerHTML = `Mouse Coords: { x:  ${Math.floor(
        e.clientX - rect.left
      )}, y:  ${Math.floor(
        e.clientY - rect.top
      )}}<br>Cell Coords: ${this.getCellCoords([
        e.clientX - rect.left,
        e.clientY - rect.top,
      ])}`;
    });
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

    //draw grid based on input values
    this.drawCellGrid();
  }

  private drawCellGrid() {
    let cellGridCtx = this.canvases.cellGridCanvas.getContext("2d")!;
    let width = this.canvases.mapCanvas.width;
    let height = this.canvases.mapCanvas.height;

    cellGridCtx.clearRect(0, 0, width, height);
    cellGridCtx.fillStyle = "blue";
    for (let index = 1; index <= width / this.cellSize.width; index++) {
      cellGridCtx.fillRect(index * this.cellSize.width, 0, 0.5, height);
    }
    cellGridCtx.fillStyle = "orange";
    for (let index = 1; index <= height / this.cellSize.height; index++) {
      cellGridCtx.fillRect(0, index * this.cellSize.height, width, 0.5);
    }
  }
}

window.onload = function () {
  const tme = new TileMapEditor({cssScaleFactor: 3});

  tme.init();
};
