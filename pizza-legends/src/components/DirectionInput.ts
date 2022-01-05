type WASDmap = "KeyW" | "KeyS" | "KeyA" | "KeyD";
type ArrowsMap = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";
type KeyMap = {
  [key in WASDmap | ArrowsMap]: Directions;
};

class DirectionInput {
  heldDirection: Directions[];
  map: KeyMap;
  constructor() {
    this.heldDirection = [];

    this.map = {
      KeyW: "up",
      KeyS: "down",
      KeyA: "left",
      KeyD: "right",

      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
    };
  }

  get direction() {
    return this.heldDirection[0];
  }

  init() {
    document.addEventListener("keydown", (event) => {
      const pressed = event.code;
      const direction = this.map[pressed as keyof KeyMap];
      if (direction && this.heldDirection.indexOf(direction) === -1) {
        this.heldDirection.unshift(direction);
      }
    });
    document.addEventListener("keyup", (event) => {
      const pressed = event.code;
      const direction = this.map[pressed as keyof KeyMap];
      const index = this.heldDirection.indexOf(direction);
      if (index > -1) {
        this.heldDirection.splice(index, 1);
      }
    });
  }
}
