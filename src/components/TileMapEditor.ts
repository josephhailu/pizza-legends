export type CanvasTypes =
  | "mapCanvas"
  | "cellGridCanvas"
  | "collisionGridCanvas";
type Canvases = Record<CanvasTypes, HTMLCanvasElement>;

interface TileMapEditorConfig {
  cssScaleFactor: number;
}

class TileMapEditor {
  cssScaleFactor: number;

  canvases: Canvases;
  isAddingTiles: boolean;

  selectedFile?: File;
  fileElement: HTMLInputElement;
  imageOpacityElement: HTMLInputElement;

  widthElement: HTMLInputElement;
  heightElement: HTMLInputElement;
  gridOpacityElement: HTMLInputElement;
  messageElement: HTMLParagraphElement;
  canvasDiv: HTMLDivElement;

  image: HTMLImageElement;
  imagePropertiesElement: HTMLParagraphElement;
  isImageLoaded: boolean = false;

  cellSize: {width: number; height: number};
  walls: {[x: string]: boolean};

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
    this.imageOpacityElement = document.querySelector(
      "#imageOpacity"
    ) as HTMLInputElement;

    this.imagePropertiesElement = document.querySelector(
      "#image-properties"
    ) as HTMLParagraphElement;
    this.widthElement = document.querySelector("#width") as HTMLInputElement;
    this.heightElement = document.querySelector("#height") as HTMLInputElement;
    this.gridOpacityElement = document.querySelector(
      "#opacity"
    ) as HTMLInputElement;

    this.messageElement = document.querySelector(
      "#message"
    ) as HTMLInputElement;

    this.canvasDiv = document.querySelector(".canvases")! as HTMLDivElement;
    this.image = new Image();

    this.image.onload = () => {
      this.isImageLoaded = true;
      Object.values(this.canvases).forEach((c) => {
        c.width = this.image.width;
        c.height = this.image.height;
      });

      this.imagePropertiesElement.innerText = `Width :  ${this.image.width}px Height: ${this.image.height}px`;
      //set height/wdith of canvas parent div with some padding when image changes
      this.canvasDiv.style.height = `${
        this.image.height * this.cssScaleFactor + 40
      }px`;
      this.canvasDiv.style.width = `${
        this.image.width * this.cssScaleFactor + 40
      }px`;
      this.walls = {};

      this.draw();
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

  initEventListeners() {
    //listener for file load
    this.fileElement.addEventListener(
      "change",
      (e) => this.handleFile(e),
      false
    );
    //listener for image opacity
    this.imageOpacityElement.addEventListener(
      "change",
      (e) =>
        (this.canvases.mapCanvas.style.opacity = (
          e.target! as HTMLInputElement
        ).value),
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

    //listener for grid opacity
    this.gridOpacityElement.addEventListener(
      "change",
      (e) =>
        (this.canvases.cellGridCanvas.style.opacity = (
          e.target! as HTMLInputElement
        ).value),
      false
    );

    //listener for grid canvas click
    this.canvases.collisionGridCanvas.addEventListener("mousedown", (e) => {
      if (this.isImageLoaded) {
        const rect = this.canvases.collisionGridCanvas.getBoundingClientRect();

        const canvasCoords = [e.clientX - rect.left, e.clientY - rect.top];
        this.updateMouseCoordMessage(canvasCoords);
        this.updateCollisionObject(canvasCoords);
      }
    });

    //listener for radio
    document.querySelectorAll('input[name="wall"]')!.forEach((element) => {
      element.addEventListener(
        "click",
        (e) => {
          this.isAddingTiles = (e.target! as HTMLInputElement).value === "Add";
        },
        false
      );
    });

    //https://stackoverflow.com/a/26414528/11449115
    //listener for JSON export
    document.querySelector("#exportJSON")!.addEventListener(
      "click",
      () => {
        if (!!this.walls && Object.values(this.walls).length > 0) {
          const link = document.querySelector("#exportJSON")!;
          let data =
            "text/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify(this.walls));
          link.setAttribute("href", "data:" + data);

          link.setAttribute("download", "data.json");
        }
      },
      false
    );
  }

  /**
   * https://stackoverflow.com/a/56140769/11449115
   * @param e
   */
  private handleFile(e: Event) {
    this.selectedFile = (e.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);

    reader.onload = (_event) => {
      this.image.src = reader.result! as string;
    };
  }

  private handleCellSizeChange(e: Event, dimension: "height" | "width"): any {
    // replace width/height property with inut value
    this.cellSize = {
      ...this.cellSize,
      [dimension]: parseInt((e.target! as HTMLInputElement).value),
    };
    this.walls = {}; // reset collision layer when grid dimensions change
    this.draw(() => {
      this.drawCellGrid();
      this.drawCollisionLayer();
    });
  }

  private updateMouseCoordMessage([x, y]: number[]) {
    this.messageElement.innerHTML = `Mouse Coords: { x:  ${Math.floor(
      x
    )}, y:  ${Math.floor(y)}}<br>Cell Coords: ${this.getCellCoords([x, y])}`;
  }

  private updateCollisionObject(canvasCoords: number[]) {
    const [cellX, cellY] = this.getCellCoords(canvasCoords);
    const cellKey = `${cellX * this.cellSize.width},${
      cellY * this.cellSize.height
    }`;
    if (this.isAddingTiles) {
      if (this.walls[cellKey]) {
        return;
      }
      this.walls[cellKey] = true;
    } else {
      //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete#description
      delete this.walls[cellKey];
    }

    this.draw(() => this.drawCollisionLayer());
  }

  private getCellCoords([x, y]: number[]) {
    return [
      Math.floor(x / this.cssScaleFactor / this.cellSize.width),
      Math.floor(y / this.cssScaleFactor / this.cellSize.height),
    ];
  }

  private draw(
    callback: () => void = () => {
      this.drawMap();
      this.drawCellGrid();
      this.drawCollisionLayer();
    }
  ) {
    callback();
  }

  private drawMap() {
    const mapCtx = this.canvases.mapCanvas.getContext("2d")!;

    mapCtx.clearRect(
      0,
      0,
      this.canvases.mapCanvas.width,
      this.canvases.mapCanvas.height
    );
    mapCtx.drawImage(this.image, 0, 0);
  }

  private drawCellGrid() {
    const cellGridCtx = this.canvases.cellGridCanvas.getContext("2d")!;
    const width = this.canvases.mapCanvas.width;
    const height = this.canvases.mapCanvas.height;
    cellGridCtx.clearRect(0, 0, width, height);

    // draw vertical grid lines
    cellGridCtx.fillStyle = "blue";
    for (let index = 1; index <= width / this.cellSize.width; index++) {
      cellGridCtx.fillRect(index * this.cellSize.width, 0, 0.5, height);
    }

    // draw horizontal grid lines
    cellGridCtx.fillStyle = "orange";
    for (let index = 1; index <= height / this.cellSize.height; index++) {
      cellGridCtx.fillRect(0, index * this.cellSize.height, width, 0.5);
    }
  }

  private drawCollisionLayer() {
    const collisionCtx = this.canvases.collisionGridCanvas.getContext("2d")!;
    collisionCtx.clearRect(
      0,
      0,
      this.canvases.collisionGridCanvas.width,
      this.canvases.collisionGridCanvas.height
    );

    collisionCtx.fillStyle = "green";
    collisionCtx.globalAlpha = 0.3;
    Object.keys(this.walls).forEach((key) => {
      const [x, y] = key.split(",").map((n) => parseInt(n)); //{"16,0": true}
      collisionCtx.fillRect(x, y, this.cellSize.width, this.cellSize.height);
    });
  }
}

window.onload = function () {
  const tme = new TileMapEditor({cssScaleFactor: 3});
  tme.initEventListeners();
};
