import { gl } from "./gl";

export class Shader {
  private _name: string;
  private _program: WebGLProgram;

  /**
   * Creates a new shader
   * @param name Name of the shader
   * @param vertexSource The source of the vertex shader
   * @param fragmentSource the source of the fragment shaders
   */
  public constructor(
    name: string,
    vertexSource: string,
    fragmentSource: string
  ) {
    this._name = name;
    let vertexShader = this.loadShader(vertexSource, gl.VERTEX_SHADER);
    let fragmentShader = this.loadShader(fragmentSource, gl.FRAGMENT_SHADER);

    this.createProgram(vertexShader, fragmentShader);
  }

  public get name(): string {
    return this._name;
  }

  /**
   * Use this shader.
   */
  public use(): void {
    gl.useProgram(this._program);
  }

  private loadShader(source: string, shaderType: number): WebGLShader {
    let shader: WebGLShader = gl.createShader(shaderType);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const error = gl.getShaderInfoLog(shader);
    if (error != "") {
      throw new Error(
        `[SHADER_LOADSHADER] Error compiling the "${this._name}" shader: ${error}`
      );
    }

    return shader;
  }

  private createProgram(
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): void {
    this._program = gl.createProgram();

    gl.attachShader(this._program, vertexShader);
    gl.attachShader(this._program, fragmentShader);

    gl.linkProgram(this._program);

    const error = gl.getProgramInfoLog(this._program);

    if (error) {
      throw new Error(
        `[SHADER_CREATEPROGRAM] Error creating the program ${this._name}: "${error}"`
      );
    }
  }
}
