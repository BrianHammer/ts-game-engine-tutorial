/**
 * The webGL rendering context
 */
export var gl: WebGLRenderingContext;

export class GLUtilities {
  /**
   * Responsible for setting up webGL
   * @param elementId Optional. The ID to find in the html
   * @returns
   */
  public static initialize(elementId?: string): HTMLCanvasElement {
    let canvas: HTMLCanvasElement;

    if (elementId !== undefined) {
      canvas = document.getElementById(elementId) as HTMLCanvasElement;
      if (canvas == undefined) {
        throw new Error(
          `[GLUTILITIES_INITIALIZE] Cannot find the element with an id of "${elementId}"`
        );
      }
    } else {
      canvas = document.createElement("canvas");
      document.body.appendChild(canvas);
    }

    gl = canvas.getContext("webgl");
    if (gl == undefined) {
      throw new Error("[GLUTIL_INITIALIZE] Unable to initialize webGL");
    }

    return canvas;
  }
}
