class FixedStepEngine {
  updateFps: number;
  renderFps: number;
  update: (delta: number) => any;
  render: (delta: number) => any;
  updateInterval: number;
  renderInterval: number;
  sinceLastUpdate: number;
  sinceLastRender: number;
  running: boolean;
  lastTime: number = 0;
  constructor(
    updateFps: number,
    update: (delta: number) => any,
    renderFps: number,
    render: (delta: number) => any
  ) {
    this.updateFps = updateFps;
    this.renderFps = renderFps;
    this.update = update;
    this.render = render;

    this.updateInterval = 1000 / this.updateFps / 1000;
    this.renderInterval = 1000 / this.renderFps / 1000;
    this.sinceLastUpdate = 0;
    this.sinceLastRender = 0;
    this.running = false;
  }
  start() {
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.gameLoop);
  }
  stop() {
    this.running = false;
  }

  gameLoop = (timestamp: number) => {
    if (this.running) {
      requestAnimationFrame(this.gameLoop);
    }

    const deltaTime = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    this.sinceLastUpdate += deltaTime;
    this.sinceLastRender += deltaTime;

    while (this.sinceLastUpdate >= this.updateInterval) {
      this.update(this.updateInterval);
      this.sinceLastUpdate -= this.updateInterval;
    }
    if (this.renderFps != null) {
      let renders = 0;
      while (this.sinceLastRender >= this.renderInterval) {
        renders++;
        this.sinceLastRender -= this.renderInterval;
      }
      if (renders > 0) {
        this.render(this.renderInterval * renders);
      }
    }
  };
}
