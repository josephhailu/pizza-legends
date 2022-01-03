type TileMapEditorConfig = {
  canvasElement: HTMLCanvasElement;
  fileElement: HTMLInputElement;
  imagePropertiesElement: HTMLParagraphElement;
  widthElement: HTMLInputElement;
  heightElement: HTMLInputElement;
  //   addElement: HTMLInputElement;
};

class TileMapEditor {
  canvasElement: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  fileElement: HTMLInputElement;
  imagePropertiesElement: HTMLParagraphElement;
  widthElement: HTMLInputElement;
  heightElement: HTMLInputElement;
  //   addElement: HTMLInputElement;

  image: HTMLImageElement;
  isLoaded: boolean = false;
  selectedFile?: File;

  cellSize: {width: number; height: number};

  /**
   *
   */
  constructor(config: TileMapEditorConfig) {
    this.canvasElement = config.canvasElement;
    this.ctx = this.canvasElement.getContext("2d")!;

    this.fileElement = config.fileElement;
    this.imagePropertiesElement = config.imagePropertiesElement;
    this.widthElement = config.widthElement;
    this.heightElement = config.heightElement;
    // this.addElement = config.addElement;

    this.image = new Image();

    this.image.onload = () => {
      this.isLoaded = true;
      this.canvasElement.width = this.image.width;
      this.canvasElement.height = this.image.height;
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
    this.ctx.clearRect(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );

    this.ctx.drawImage(this.image, 0, 0);

    //draw grid based on input values
    this.ctx.fillStyle = "blue";
    for (
      let index = 0;
      index < this.canvasElement.width / this.cellSize.width;
      index++
    ) {
      this.ctx.fillRect(
        index * this.cellSize.width,
        0,
        0.5,
        this.canvasElement.height
      );
    }
    this.ctx.fillStyle = "green";
    for (
      let index = 0;
      index < this.canvasElement.height / this.cellSize.height;
      index++
    ) {
      this.ctx.fillRect(
        0,
        index * this.cellSize.height,
        this.canvasElement.width,
        0.5
      );
    }
  }
}

window.onload = function () {
  const canvasElement = document.querySelector(
    ".tilemap-canvas"
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

  const tme = new TileMapEditor({
    canvasElement,
    fileElement,
    imagePropertiesElement,
    widthElement,
    heightElement,
    // addElement,
  });

  tme.init();
};
