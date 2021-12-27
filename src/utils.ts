const DIMENSIONS = {
  /**A cell is 16x16 px */
  gridSize: 16,
  /**Dimensions for different types of sprite designs*/
  spriteSize: {
    /**A person sprite is 32x32 px */
    person: {width: 32, height: 32},
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
};
