import { gl } from "./gl";

/**
 * Represents information needed for a webglBuffer attribute
 */
export class AttributeInfo {
  // location of this attribute
  public location: number;

  //Number of elements in the attribute (vec3 === 3)
  public size: number;

  // Number of elements from the beginning of the buffer (default=0)
  public offset: number;
}

/**
 * Represents a webGL buffer
 */
export class GLBuffer {
  private _hasAttributeLocation: boolean = false;
  private _elementSize: number;

  private _stride: number;
  private _buffer: WebGLBuffer;

  private _targetBufferType: number;
  private _dataType: number;
  private _mode: number;
  private _typeSize: number;

  private _attributes: AttributeInfo[] = [];
  private _data: number[] = [];

  /**
   * Creates a new GL buffer
   * @param size size of each element in this buffer
   * @param dataType The data type of the buffer. Default = gl.FLOAT
   * @param targetBufferType The type of buffer. Default = ARRAY. ARRAY or ELEMENT buffer
   * @param mode What the drawing mode is. default = triangles. GL.triangles or GL.lines
   */
  public constructor(
    size: number,
    dataType: number = gl.FLOAT,
    targetBufferType: number = gl.ARRAY_BUFFER,
    mode: number = gl.TRIANGLES
  ) {
    this._elementSize = size;
    this._dataType = dataType;
    this._targetBufferType = targetBufferType;
    this._mode = mode;

    //determine byte size

    switch (this._dataType) {
      case gl.FLOAT:
      case gl.INT:
      case gl.UNSIGNED_INT:
        this._typeSize = 4;
        break;
      case gl.SHORT:
      case gl.UNSIGNED_SHORT:
        this._typeSize = 2;
        break;
      case gl.BYTE:
      case gl.UNSIGNED_BYTE:
        this._typeSize = 1;
        break;
      default:
        throw new Error(`Unrecognized data type ${this._dataType.toString()}`);
    }

    this._stride = this._elementSize * this._typeSize;
    this._buffer = gl.createBuffer();
  }

  public destroy(): void {
    gl.deleteBuffer(this._buffer);
  }

  /**
   * Binds this buffer
   * @param normalized Determines if data should be normalized. default=false
   */
  public bind(normalized: boolean = false): void {
    gl.bindBuffer(this._targetBufferType, this._buffer);

    if (this._hasAttributeLocation) {
      for (let it of this._attributes) {
        gl.vertexAttribPointer(
          it.location,
          it.size,
          this._dataType,
          normalized,
          this._stride,
          it.offset * this._typeSize
        );
        gl.enableVertexAttribArray(it.location);
      }
    }
  }

  /**
   * Unbinds this buffer
   */
  public unbind(): void {
    for (let it of this._attributes) {
      gl.disableVertexAttribArray(it.location);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
  }

  /**
   * Adds attribute with the provided information
   * @param info information added
   */
  public addAttributeLocation(info: AttributeInfo): void {
    this._hasAttributeLocation = true;
    this._attributes.push(info);
  }

  /**
   * Adds data to the buffer
   * @param data what will be added into the buffer
   */
  public pushbackData(data: number[]): void {
    for(let d of data){
      this._data.push(d)
    }
  }

  public upload(): void {
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);

    let bufferData: ArrayBufferView;

    switch (this._dataType) {
      case gl.FLOAT:
        bufferData = new Float32Array(this._data);
        break;
      case gl.INT:
        bufferData = new Int32Array(this._data);
        break;
      case gl.UNSIGNED_INT:
        bufferData = new Uint32Array(this._data);
        break;

      case gl.SHORT:
        bufferData = new Int16Array(this._data);
        break;
      case gl.UNSIGNED_SHORT:
        bufferData = new Uint16Array(this._data);
        break;
      case gl.BYTE:
        bufferData = new Int8Array(this._data);
        break;
      case gl.UNSIGNED_BYTE:
        bufferData = new Uint8Array(this._data);
        break;
      default:
        throw new Error(`[GLBUFFER_PUSHBACK] Incorrect data type`);
    }
    gl.bufferData(this._targetBufferType, bufferData, gl.STATIC_DRAW);
  }

  /**
   * Draws this buffer to the canvas
   */
  public draw(): void {
    if (this._targetBufferType === gl.ARRAY_BUFFER) {
      gl.drawArrays(this._mode, 0, this._data.length / this._elementSize);
    } else if (this._targetBufferType === gl.ELEMENT_ARRAY_BUFFER) {
      gl.drawElements(this._mode, this._data.length, this._dataType, 0);
    }
  }
}
