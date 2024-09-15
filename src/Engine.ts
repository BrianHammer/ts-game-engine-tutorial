export class Engine {
  public constructor() {
    console.log("Hello");
  }

  private _count = 0;
  public start(): void {
    this.loop();
  }

  /**
   * z
   */
  private loop(): void {
    this._count++;
    document.title = this._count.toString();
    requestAnimationFrame(this.loop.bind(this));
  }
}
