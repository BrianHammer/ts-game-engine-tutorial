import { AttributeInfo, GLBuffer } from "../gl/glBuffer";
import { Shader } from "../gl/shader";
import { Vector3 } from "../math/vector3";

export class Sprite {
  private _width: number;
  private _height: number;
  private _name: string;
  private _buffer: GLBuffer;

  public position: Vector3 = new Vector3();

  public constructor(name: string, width: number = 50, height: number = 50) {
    this._height = height;
    this._width = width;
    this._name = name;
  }

  public load(): void {
    this._buffer = new GLBuffer(3);

    let positionAttribute = new AttributeInfo();
    positionAttribute.location = 0;
    positionAttribute.offset = 0;
    positionAttribute.size = 3;
    this._buffer.addAttributeLocation(positionAttribute);

    const posX = this.position.x;
    const posY = this.position.y;
    let verticies = [
      //pointone
      0,
      0,
      0,
      //point2
      0,
      this._height,
      0,
      //point3
      this._width,
      this._height,
      0,

      //triangle 2 point 1
      this._width,
      this._height,
      0,
      //2.2
      this._width,
      0,
      0,
      //2.3
      0,
      0,
      0,
    ];

    this._buffer.pushbackData(verticies);
    this._buffer.upload();
    this._buffer.unbind();
  }

  public loadHexagon(): void {
    this._buffer = new GLBuffer(3);

    let positionAttribute = new AttributeInfo();
    positionAttribute.location = 0;
    positionAttribute.offset = 0;
    positionAttribute.size = 3;
    this._buffer.addAttributeLocation(positionAttribute);

    // all six points on the hexagon
    // A starts at the leftmost point, and goes clockwise to the next.
    const Ay = this._height * 0.5;
    const Ax = 0;

    const Bx = this._width * 0.3333;
    const By = this._height;

    const Cx = this._width * 0.6666;
    const Cy = this._height;

    const Dx = this._width;
    const Dy = this._height * 0.5;

    const Ex = this._width * 0.6666;
    const Ey = 0;

    const Fx = this._width * 0.3333;
    const Fy = 0;

    // ABF, BCF, CEF, CDE
    let verticies = [
      //Tri ABF
      Ax,
      Ay,
      0,
      Bx,
      By,
      0,
      Fx,
      Fy,
      0,
      //Tri BCF
      Bx,
      By,
      0,
      Cx,
      Cy,
      0,
      Fx,
      Fy,
      0,
      //Tri CEF
      Cx,
      Cy,
      0,
      Ex,
      Ey,
      0,
      Fx,
      Fy,
      0,
      //Tri CDE
      Cx,
      Cy,
      0,
      Dx,
      Dy,
      0,
      Ex,
      Ey,
      0,
    ];

    this._buffer.pushbackData(verticies);
    this._buffer.upload();
    this._buffer.unbind();
  }

  public update(time: number): void {}

  public draw(): void {
    this._buffer.bind();
    this._buffer.draw();
  }
}
