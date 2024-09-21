import { GLUtilities, gl } from "./gl/gl";
import { AttributeInfo, GLBuffer } from "./gl/glBuffer";
import { Shader } from "./gl/shader";
import { Sprite } from "./graphics/sprite";
import { Matrix4x4 } from "./math/matrix4x4";

export class Engine {
  // Buffer: A container for data to be pushed inside the graphics card to be used in the vertex shader
  //
  private _canvas: HTMLCanvasElement;
  private _shader: Shader;
  private _sprite: Sprite;
  private _projection: Matrix4x4;

  public constructor() {
    console.log("Hello");
  }

  public start(): void {
    this._canvas = GLUtilities.initialize();
    gl.clearColor(0, 0, 0, 1);

    this.loadShaders();
    this._shader.use();

    this._projection = Matrix4x4.orthographic(
      0,
      this._canvas.width,
      0,
      this._canvas.height,
      -100.0,
      100.0
    );
    this._sprite = new Sprite("test");

    this._sprite.position.x = 0;
    this._sprite.position.y = 0;
    this._sprite.loadHexagon();

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

    //This says max area of the screen
    gl.viewport(-1, 1, -1, 1);
  }

  public createBuffer(): void {}

  /**
   * The game loop ------ CONTINUE AT 11:23
   */
  private loop(): void {
    gl.clear(gl.COLOR_BUFFER_BIT);

    let colorPosition = this._shader.getUniformLocation("u_color");
    gl.uniform4f(colorPosition, 0.4, 0.7, 0.3, 1);

    let projectionPosition = this._shader.getUniformLocation("u_projection");
    gl.uniformMatrix4fv(
      projectionPosition,
      false,
      new Float32Array(this._projection.data)
    );

    let modelLocation = this._shader.getUniformLocation("u_model");
    gl.uniformMatrix4fv(
      modelLocation,
      false,
      new Float32Array(Matrix4x4.translation(this._sprite.position).data)
    );

    this._sprite.draw();

    requestAnimationFrame(this.loop.bind(this));
  }

  private loadShaders(): void {
    // This language is called GLSL, and it interacts with the GPU

    // Another way to write the glPos... gl_Position = vec4(a_position.x, a_position.y, a_position.z, 1.0)
    let vertexShaderSource = `
    attribute vec3 a_position;

    uniform mat4 u_projection;
    uniform mat4 u_model;
    void main() {
        gl_Position = u_projection * u_model * vec4(a_position, 1.0);
    }
    `;

    // This shader specifies colors
    // precision specifies how accurate the floats will be

    // Colors are vectors, r,g,b,a?

    let fragmentShaderSource = `
    precision mediump float;

    uniform vec4 u_color;

    void main() {
      gl_FragColor = u_color;
    }
    `;

    this._shader = new Shader(
      "basic",
      vertexShaderSource,
      fragmentShaderSource
    );
  }
}
