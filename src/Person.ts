type PersonConfig = GameObjectConfig & {

}

type DirectionUpdate = {
    [key in "up" | "down" | "left" | "right"]: [property: "x" | "y", change: -1 | 1];
};
class Person extends GameObject {
    movingProgressRemaining: number;
    directionUpdate: DirectionUpdate;
    constructor(config: PersonConfig) {
        super(config);
        this.movingProgressRemaining = 16;

        this.directionUpdate = {
            "up": ["y", -1],
            "down": ["y", 1],
            "left": ["x", -1],
            "right": ["x", 1],
        }
    }

    update(state: {}) {
        this.updatePosition();
    }

    updatePosition() {
        if (this.movingProgressRemaining > 0) {
            const [property, change] = this.directionUpdate[this.direction];
            this[property] += change;
            this.movingProgressRemaining -= 1;
        }
    }

}