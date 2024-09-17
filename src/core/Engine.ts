import { GLUtilities, gl } from "./gl/gl";
import { Shader } from "./gl/shader";

export class Engine {
  private _canvas: HTMLCanvasElement;
  private _shader: Shader;
  public constructor() {
    console.log("Hello");
  }

  public start(): void {
    this._canvas = GLUtilities.initialize();

    gl.clearColor(0, 0, 0, 1);
    this.loadShaders();
    this._shader.use();
    this.resize();
    this.loop();
  }

  /**
   * Resizes the canvas to fit the window
   */
  public resize(): void {
    if (this._canvas == undefined) return;

    this._canvas.width = window.innerWidth;
    this._canvas.height = window.innerHeight;
  }

  /**
   * z
   */
  private loop(): void {
    gl.clear(gl.COLOR_BUFFER_BIT);
    requestAnimationFrame(this.loop.bind(this));
  }

  private loadShaders(): void {
    // This language is called GLSL, and it interacts with the GPU

    // Another way to write the glPos... gl_Position = vec4(a_position.x, a_position.y, a_position.z, 1.0)
    let vertexShaderSource = `
    attribute vec3 a_position;
    void main() {
        gl_Position = vec4(a_position, 1.0);
    }
    `;

    // This shader specifies colors
    // precision specifies how accurate the floats will be

    // Colors are vectors, r,g,b,a?

    let fragmentShaderSource = `
    precision mediump float;

    void main() {
      gl_FragColor = vec4(1.0);
    }
    `;

    this._shader = new Shader(
      "basic",
      vertexShaderSource,
      fragmentShaderSource
    );
  }
}
