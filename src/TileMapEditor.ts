type TileMapEditorConfig = {
  mapCanvas: HTMLCanvasElement;
  collisionGridCanvas: HTMLCanvasElement;
  fileElement: HTMLInputElement;
  imagePropertiesElement: HTMLParagraphElement;
  widthElement: HTMLInputElement;
  heightElement: HTMLInputElement;
  //   addElement: HTMLInputElement;
  messageElement: HTMLParagraphElement;
};

class TileMapEditor {
  mapCanvas: HTMLCanvasElement;
  mapCtx: CanvasRenderingContext2D;

  collisionGridCanvas: HTMLCanvasElement;
  collisionCtx: CanvasRenderingContext2D;

  fileElement: HTMLInputElement;
  imagePropertiesElement: HTMLParagraphElement;
  widthElement: HTMLInputElement;
  heightElement: HTMLInputElement;
  //   addElement: HTMLInputElement;
  messageElement: HTMLParagraphElement;

  image: HTMLImageElement;
  isLoaded: boolean = false;
  selectedFile?: File;

  cellSize: {width: number; height: number};

  /**
   *
   */
  constructor(config: TileMapEditorConfig) {
    this.mapCanvas = config.mapCanvas;
    this.mapCtx = this.mapCanvas.getContext("2d")!;

    this.collisionGridCanvas = config.collisionGridCanvas;
    this.collisionCtx = this.collisionGridCanvas.getContext("2d")!;

    this.fileElement = config.fileElement;
    this.imagePropertiesElement = config.imagePropertiesElement;
    this.widthElement = config.widthElement;
    this.heightElement = config.heightElement;
    // this.addElement = config.addElement;
    this.messageElement = config.messageElement;

    this.image = new Image();

    this.image.onload = () => {
      this.isLoaded = true;
      this.mapCanvas.width = this.image.width;
      this.mapCanvas.height = this.image.height;

      this.collisionGridCanvas.width = this.image.width;
      this.collisionGridCanvas.height = this.image.height;

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

    //listener for grid canvas mouseover
    this.collisionGridCanvas.addEventListener("mousedown", (e) => {
      let rect = this.collisionGridCanvas.getBoundingClientRect();
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

  getCellCoords(arg0: number[]) {
    return [
      Math.floor(arg0[0] / 3 / this.cellSize.width),
      Math.floor(arg0[1] / 3 / this.cellSize.height),
    ];
  }

  handleCellSizeChange(e: Event, dimension: "height" | "width"): any {
    this.cellSize = {
      ...this.cellSize,
      [dimension]: parseInt((e.target! as HTMLInputElement).value),
    };
    this.startApp();
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
    this.mapCtx.clearRect(0, 0, this.mapCanvas.width, this.mapCanvas.height);
    this.collisionCtx.clearRect(
      0,
      0,
      this.mapCanvas.width,
      this.mapCanvas.height
    );

    this.mapCtx.drawImage(this.image, 0, 0);

    //draw grid based on input values
    this.collisionCtx.fillStyle = "blue";
    for (
      let index = 0;
      index <= this.mapCanvas.width / this.cellSize.width;
      index++
    ) {
      this.collisionCtx.fillRect(
        index * this.cellSize.width,
        0,
        0.5,
        this.mapCanvas.height
      );
    }
    this.collisionCtx.fillStyle = "orange";
    for (
      let index = 0;
      index <= this.mapCanvas.height / this.cellSize.height;
      index++
    ) {
      this.collisionCtx.fillRect(
        0,
        index * this.cellSize.height,
        this.mapCanvas.width,
        0.5
      );
    }
  }
}

window.onload = function () {
  const mapCanvas = document.querySelector(
    ".tilemap-canvas"
  ) as HTMLCanvasElement;
  const collisionGridCanvas = document.querySelector(
    ".collision-canvas"
  ) as HTMLCanvasElement;
  //   c.width = DIMENSIONS.canvasDimensions.width;
  //   c.height = DIMENSIONS.canvasDimensions.height;
  const fileElement = document.querySelector("#upload") as HTMLInputElement;
  const imagePropertiesElement = document.querySelector(
    "#image-properties"
  ) as HTMLParagraphElement;
  const widthElement = document.querySelector("#width") as HTMLInputElement;
  const heightElement = document.querySelector("#height") as HTMLInputElement;
  //   const addElement = document.querySelector("#add") as HTMLInputElement;
  const messageElement = document.querySelector("#message") as HTMLInputElement;

  const tme = new TileMapEditor({
    mapCanvas,
    collisionGridCanvas,
    fileElement,
    imagePropertiesElement,
    widthElement,
    heightElement,
    // addElement,
    messageElement,
  });

  tme.init();
};
