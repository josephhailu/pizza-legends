const DIMENSIONS = {
  /**A cell is 16x16 px */
  gridSize: 16,
  /**Dimensions for different types of sprite designs*/
  spriteSize: {
    /**A person sprite is 32x32 px */
    person: { width: 32, height: 32 },
  },
  /** The canvas dimensions are based on designing map assets
   * using 22 horizontal cells and 13 vertical cells.
   *
   * Each cell is 16x16 px so we have,
   *
   *      Width:   22cell * 16px/cell = 352px
   *      Height:   13cell * 16px/cell = 208px
   */
  canvasDimensions: {
    width: 352,
    height: 208,
  },
};

const UTILS = {
  /** Move sprites away from top left (0,0) to a more visually appealing spot in a cell */
  nudgeSprite: {
    /** a person sprite looks nice at (7,18) */
    person: {
      x: 7,
      y: 18,
    },
  },
  /**A cameraPerson is locked into the middle of the center cell of the canvas */
  cameraPersonOffset: {
    x: DIMENSIONS.canvasDimensions.width / DIMENSIONS.gridSize / 2 - 0.5,
    y: DIMENSIONS.canvasDimensions.height / DIMENSIONS.gridSize / 2 - 0.5,
  },
  /**Converts from cell value to pixel value */
  withGrid: (n: number) => {
    return n * DIMENSIONS.gridSize;
  },
  asGridCoord(x: number, y: number) {
    return `${x * DIMENSIONS.gridSize},${y * DIMENSIONS.gridSize}`;
  },
  nextPosition(initialX: number, initialY: number, direction: Directions) {
    let x = initialX;
    let y = initialY;
    const size = DIMENSIONS.gridSize;
    if (direction === "left") {
      x -= size;
    } else if (direction === "right") {
      x += size;
    } else if (direction === "up") {
      y -= size;
    } else if (direction === "down") {
      y += size;
    }

    return { x, y };
  },

  emitEvent(name: string, detail: any) {
    const event = new CustomEvent(name, {
      detail,
    });
    document.dispatchEvent(event);
  },
};

const ANIMATIONS = {
  singleFrame: {
    "idle-down": [[0, 0]],
    "idle-right": [[0, 0]],
    "idle-up": [[0, 0]],
    "idle-left": [[0, 0]],

    "walk-down": [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ],
    "walk-right": [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ],
    "walk-up": [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ],
    "walk-left": [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ],
  },
  /** animation based on default hero spritesheet */
  defaultAnimation: {
    "idle-down": [[0, 0]],
    "idle-right": [[0, 1]],
    "idle-up": [[0, 2]],
    "idle-left": [[0, 3]],

    "walk-down": [
      [1, 0],
      [0, 0],
      [3, 0],
      [0, 0],
    ],
    "walk-right": [
      [1, 1],
      [0, 1],
      [3, 1],
      [0, 1],
    ],
    "walk-up": [
      [1, 2],
      [0, 2],
      [3, 2],
      [0, 2],
    ],
    "walk-left": [
      [1, 3],
      [0, 3],
      [3, 3],
      [0, 3],
    ],
  },
};
