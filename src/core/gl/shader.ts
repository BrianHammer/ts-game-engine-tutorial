import { gl } from "./gl";

export class Shader {
  private _name: string;
  private _program: WebGLProgram;
  private _attributes: { [name: string]: number } = {};
  private _uniforms: { [name: string]: WebGLUniformLocation } = {};

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

    this.detectAttributes();
    this.detectUniforms();
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

  /**
   * Gets the location of the attribute
   * @param name the name of the attribute location. Throws error if it does not exist
   * @returns The location of the name passed into the function
   */
  public getAttributeLocation(name: string): number {
    const attr = this._attributes[name];
    if (attr === undefined) {
      throw new Error(
        `[SHADER_GETATTRLOCATION] Unable to find attribute "${name}" inside of shader ${this._name}`
      );
    }

    return attr;
  }

  /**
   * Gets the location of the unifrom
   * @param name the name of the attribute location. Throws error if it does not exist
   * @returns The location of the name passed into the function
   */
  public getUniformLocation(name: string): WebGLUniformLocation {
    const attr = this._uniforms[name];
    if (attr === undefined) {
      throw new Error(
        `[SHADER_GETUNIFORMLOCATION] Unable to find uniform "${name}" inside of shader ${this._name}`
      );
    }
    return attr;
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

  private detectAttributes(): void {
    let attributeCount = gl.getProgramParameter(
      this._program,
      gl.ACTIVE_ATTRIBUTES
    );
    for (let i = 0; i < attributeCount; i++) {
      let info: WebGLActiveInfo = gl.getActiveAttrib(this._program, i);

      if (!info) {
        break;
      }

      this._attributes[info.name] = gl.getAttribLocation(
        this._program,
        info.name
      );
    }
  }

  private detectUniforms(): void {
    let uniformCount = gl.getProgramParameter(
      this._program,
      gl.ACTIVE_UNIFORMS
    );
    for (let i = 0; i < uniformCount; i++) {
      let info: WebGLActiveInfo = gl.getActiveUniform(this._program, i);

      if (!info) {
        break;
      }

      this._uniforms[info.name] = gl.getUniformLocation(
        this._program,
        info.name
      );
    }
  }
}
