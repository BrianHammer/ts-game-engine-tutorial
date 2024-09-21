// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/core/gl/gl.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GLUtilities = exports.gl = void 0;
var GLUtilities = /** @class */function () {
  function GLUtilities() {}
  /**
   * Responsible for setting up webGL
   * @param elementId Optional. The ID to find in the html
   * @returns
   */
  GLUtilities.initialize = function (elementId) {
    var canvas;
    if (elementId !== undefined) {
      canvas = document.getElementById(elementId);
      if (canvas == undefined) {
        throw new Error("[GLUTILITIES_INITIALIZE] Cannot find the element with an id of \"".concat(elementId, "\""));
      }
    } else {
      canvas = document.createElement("canvas");
      document.body.appendChild(canvas);
    }
    exports.gl = canvas.getContext("webgl");
    if (exports.gl == undefined) {
      throw new Error("[GLUTIL_INITIALIZE] Unable to initialize webGL");
    }
    return canvas;
  };
  return GLUtilities;
}();
exports.GLUtilities = GLUtilities;
},{}],"src/core/gl/shader.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Shader = void 0;
var gl_1 = require("./gl");
var Shader = /** @class */function () {
  /**
   * Creates a new shader
   * @param name Name of the shader
   * @param vertexSource The source of the vertex shader
   * @param fragmentSource the source of the fragment shaders
   */
  function Shader(name, vertexSource, fragmentSource) {
    this._attributes = {};
    this._uniforms = {};
    this._name = name;
    var vertexShader = this.loadShader(vertexSource, gl_1.gl.VERTEX_SHADER);
    var fragmentShader = this.loadShader(fragmentSource, gl_1.gl.FRAGMENT_SHADER);
    this.createProgram(vertexShader, fragmentShader);
    this.detectAttributes();
    this.detectUniforms();
  }
  Object.defineProperty(Shader.prototype, "name", {
    get: function get() {
      return this._name;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Use this shader.
   */
  Shader.prototype.use = function () {
    gl_1.gl.useProgram(this._program);
  };
  Shader.prototype.loadShader = function (source, shaderType) {
    var shader = gl_1.gl.createShader(shaderType);
    gl_1.gl.shaderSource(shader, source);
    gl_1.gl.compileShader(shader);
    var error = gl_1.gl.getShaderInfoLog(shader);
    if (error != "") {
      throw new Error("[SHADER_LOADSHADER] Error compiling the \"".concat(this._name, "\" shader: ").concat(error));
    }
    return shader;
  };
  /**
   * Gets the location of the attribute
   * @param name the name of the attribute location. Throws error if it does not exist
   * @returns The location of the name passed into the function
   */
  Shader.prototype.getAttributeLocation = function (name) {
    var attr = this._attributes[name];
    if (attr === undefined) {
      throw new Error("[SHADER_GETATTRLOCATION] Unable to find attribute \"".concat(name, "\" inside of shader ").concat(this._name));
    }
    return attr;
  };
  /**
   * Gets the location of the unifrom
   * @param name the name of the attribute location. Throws error if it does not exist
   * @returns The location of the name passed into the function
   */
  Shader.prototype.getUniformLocation = function (name) {
    var attr = this._uniforms[name];
    if (attr === undefined) {
      throw new Error("[SHADER_GETUNIFORMLOCATION] Unable to find uniform \"".concat(name, "\" inside of shader ").concat(this._name));
    }
    return attr;
  };
  Shader.prototype.createProgram = function (vertexShader, fragmentShader) {
    this._program = gl_1.gl.createProgram();
    gl_1.gl.attachShader(this._program, vertexShader);
    gl_1.gl.attachShader(this._program, fragmentShader);
    gl_1.gl.linkProgram(this._program);
    var error = gl_1.gl.getProgramInfoLog(this._program);
    if (error) {
      throw new Error("[SHADER_CREATEPROGRAM] Error creating the program ".concat(this._name, ": \"").concat(error, "\""));
    }
  };
  Shader.prototype.detectAttributes = function () {
    var attributeCount = gl_1.gl.getProgramParameter(this._program, gl_1.gl.ACTIVE_ATTRIBUTES);
    for (var i = 0; i < attributeCount; i++) {
      var info = gl_1.gl.getActiveAttrib(this._program, i);
      if (!info) {
        break;
      }
      this._attributes[info.name] = gl_1.gl.getAttribLocation(this._program, info.name);
    }
  };
  Shader.prototype.detectUniforms = function () {
    var uniformCount = gl_1.gl.getProgramParameter(this._program, gl_1.gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < uniformCount; i++) {
      var info = gl_1.gl.getActiveUniform(this._program, i);
      if (!info) {
        break;
      }
      this._uniforms[info.name] = gl_1.gl.getUniformLocation(this._program, info.name);
    }
  };
  return Shader;
}();
exports.Shader = Shader;
},{"./gl":"src/core/gl/gl.ts"}],"src/core/gl/glBuffer.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GLBuffer = exports.AttributeInfo = void 0;
var gl_1 = require("./gl");
/**
 * Represents information needed for a webglBuffer attribute
 */
var AttributeInfo = /** @class */function () {
  function AttributeInfo() {}
  return AttributeInfo;
}();
exports.AttributeInfo = AttributeInfo;
/**
 * Represents a webGL buffer
 */
var GLBuffer = /** @class */function () {
  /**
   * Creates a new GL buffer
   * @param size size of each element in this buffer
   * @param dataType The data type of the buffer. Default = gl.FLOAT
   * @param targetBufferType The type of buffer. Default = ARRAY. ARRAY or ELEMENT buffer
   * @param mode What the drawing mode is. default = triangles. GL.triangles or GL.lines
   */
  function GLBuffer(size, dataType, targetBufferType, mode) {
    if (dataType === void 0) {
      dataType = gl_1.gl.FLOAT;
    }
    if (targetBufferType === void 0) {
      targetBufferType = gl_1.gl.ARRAY_BUFFER;
    }
    if (mode === void 0) {
      mode = gl_1.gl.TRIANGLES;
    }
    this._hasAttributeLocation = false;
    this._attributes = [];
    this._data = [];
    this._elementSize = size;
    this._dataType = dataType;
    this._targetBufferType = targetBufferType;
    this._mode = mode;
    //determine byte size
    switch (this._dataType) {
      case gl_1.gl.FLOAT:
      case gl_1.gl.INT:
      case gl_1.gl.UNSIGNED_INT:
        this._typeSize = 4;
        break;
      case gl_1.gl.SHORT:
      case gl_1.gl.UNSIGNED_SHORT:
        this._typeSize = 2;
        break;
      case gl_1.gl.BYTE:
      case gl_1.gl.UNSIGNED_BYTE:
        this._typeSize = 1;
        break;
      default:
        throw new Error("Unrecognized data type ".concat(this._dataType.toString()));
    }
    this._stride = this._elementSize * this._typeSize;
    this._buffer = gl_1.gl.createBuffer();
  }
  GLBuffer.prototype.destroy = function () {
    gl_1.gl.deleteBuffer(this._buffer);
  };
  /**
   * Binds this buffer
   * @param normalized Determines if data should be normalized. default=false
   */
  GLBuffer.prototype.bind = function (normalized) {
    if (normalized === void 0) {
      normalized = false;
    }
    gl_1.gl.bindBuffer(this._targetBufferType, this._buffer);
    if (this._hasAttributeLocation) {
      for (var _i = 0, _a = this._attributes; _i < _a.length; _i++) {
        var it = _a[_i];
        gl_1.gl.vertexAttribPointer(it.location, it.size, this._dataType, normalized, this._stride, it.offset * this._typeSize);
        gl_1.gl.enableVertexAttribArray(it.location);
      }
    }
  };
  /**
   * Unbinds this buffer
   */
  GLBuffer.prototype.unbind = function () {
    for (var _i = 0, _a = this._attributes; _i < _a.length; _i++) {
      var it = _a[_i];
      gl_1.gl.disableVertexAttribArray(it.location);
    }
    gl_1.gl.bindBuffer(gl_1.gl.ARRAY_BUFFER, this._buffer);
  };
  /**
   * Adds attribute with the provided information
   * @param info information added
   */
  GLBuffer.prototype.addAttributeLocation = function (info) {
    this._hasAttributeLocation = true;
    this._attributes.push(info);
  };
  /**
   * Adds data to the buffer
   * @param data what will be added into the buffer
   */
  GLBuffer.prototype.pushbackData = function (data) {
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
      var d = data_1[_i];
      this._data.push(d);
    }
  };
  GLBuffer.prototype.upload = function () {
    gl_1.gl.bindBuffer(gl_1.gl.ARRAY_BUFFER, this._buffer);
    var bufferData;
    switch (this._dataType) {
      case gl_1.gl.FLOAT:
        bufferData = new Float32Array(this._data);
        break;
      case gl_1.gl.INT:
        bufferData = new Int32Array(this._data);
        break;
      case gl_1.gl.UNSIGNED_INT:
        bufferData = new Uint32Array(this._data);
        break;
      case gl_1.gl.SHORT:
        bufferData = new Int16Array(this._data);
        break;
      case gl_1.gl.UNSIGNED_SHORT:
        bufferData = new Uint16Array(this._data);
        break;
      case gl_1.gl.BYTE:
        bufferData = new Int8Array(this._data);
        break;
      case gl_1.gl.UNSIGNED_BYTE:
        bufferData = new Uint8Array(this._data);
        break;
      default:
        throw new Error("[GLBUFFER_PUSHBACK] Incorrect data type");
    }
    gl_1.gl.bufferData(this._targetBufferType, bufferData, gl_1.gl.STATIC_DRAW);
  };
  /**
   * Draws this buffer to the canvas
   */
  GLBuffer.prototype.draw = function () {
    if (this._targetBufferType === gl_1.gl.ARRAY_BUFFER) {
      gl_1.gl.drawArrays(this._mode, 0, this._data.length / this._elementSize);
    } else if (this._targetBufferType === gl_1.gl.ELEMENT_ARRAY_BUFFER) {
      gl_1.gl.drawElements(this._mode, this._data.length, this._dataType, 0);
    }
  };
  return GLBuffer;
}();
exports.GLBuffer = GLBuffer;
},{"./gl":"src/core/gl/gl.ts"}],"src/core/math/vector3.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vector3 = void 0;
var Vector3 = /** @class */function () {
  function Vector3(x, y, z) {
    if (x === void 0) {
      x = 0;
    }
    if (y === void 0) {
      y = 0;
    }
    if (z === void 0) {
      z = 0;
    }
    this._x = x;
    this._y = y;
    this._z = z;
  }
  Object.defineProperty(Vector3.prototype, "x", {
    get: function get() {
      return this._x;
    },
    set: function set(value) {
      this._x = value;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Vector3.prototype, "y", {
    get: function get() {
      return this._y;
    },
    set: function set(value) {
      this._y = value;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Vector3.prototype, "z", {
    get: function get() {
      return this._z;
    },
    set: function set(value) {
      this._z = value;
    },
    enumerable: false,
    configurable: true
  });
  Vector3.prototype.toArray = function () {
    return [this._x, this._y, this._z];
  };
  Vector3.prototype.toFloat32Array = function () {
    return new Float32Array([this._x, this._y, this._z]);
  };
  return Vector3;
}();
exports.Vector3 = Vector3;
},{}],"src/core/graphics/sprite.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Sprite = void 0;
var glBuffer_1 = require("../gl/glBuffer");
var vector3_1 = require("../math/vector3");
var Sprite = /** @class */function () {
  function Sprite(name, width, height) {
    if (width === void 0) {
      width = 100;
    }
    if (height === void 0) {
      height = 100;
    }
    this.position = new vector3_1.Vector3();
    this._height = height;
    this._width = width;
    this._name = name;
  }
  Sprite.prototype.load = function () {
    this._buffer = new glBuffer_1.GLBuffer(3);
    var positionAttribute = new glBuffer_1.AttributeInfo();
    positionAttribute.location = 0;
    positionAttribute.offset = 0;
    positionAttribute.size = 3;
    this._buffer.addAttributeLocation(positionAttribute);
    var posX = this.position.x;
    var posY = this.position.y;
    var verticies = [
    //pointone
    0, 0, 0,
    //point2
    0, this._height, 0,
    //point3
    this._width, this._height, 0,
    //triangle 2 point 1
    this._width, this._height, 0,
    //2.2
    this._width, 0, 0,
    //2.3
    0, 0, 0];
    this._buffer.pushbackData(verticies);
    this._buffer.upload();
    this._buffer.unbind();
  };
  Sprite.prototype.loadHexagon = function () {
    this._buffer = new glBuffer_1.GLBuffer(3);
    var positionAttribute = new glBuffer_1.AttributeInfo();
    positionAttribute.location = 0;
    positionAttribute.offset = 0;
    positionAttribute.size = 3;
    this._buffer.addAttributeLocation(positionAttribute);
    // all six points on the hexagon
    // A starts at the leftmost point, and goes clockwise to the next.
    var Ay = this._height * 0.5;
    var Ax = 0;
    var Bx = this._width * 0.25;
    var By = this._height;
    var Cx = this._width * 0.75;
    var Cy = this._height;
    var Dx = this._width;
    var Dy = this._height * 0.5;
    var Ex = this._width * 0.75;
    var Ey = 0;
    var Fx = this._width * 0.25;
    var Fy = 0;
    // ABF, BCF, CEF, CDE
    var verticies = [
    //Tri ABF
    Ax, Ay, 0, Bx, By, 0, Fx, Fy, 0,
    //Tri BCF
    Bx, By, 0, Cx, Cy, 0, Fx, Fy, 0,
    //Tri CEF
    Cx, Cy, 0, Ex, Ey, 0, Fx, Fy, 0,
    //Tri CDE
    Cx, Cy, 0, Dx, Dy, 0, Ex, Ey, 0];
    this._buffer.pushbackData(verticies);
    this._buffer.upload();
    this._buffer.unbind();
  };
  Sprite.prototype.update = function (time) {};
  Sprite.prototype.draw = function () {
    this._buffer.bind();
    this._buffer.draw();
  };
  return Sprite;
}();
exports.Sprite = Sprite;
},{"../gl/glBuffer":"src/core/gl/glBuffer.ts","../math/vector3":"src/core/math/vector3.ts"}],"src/core/math/matrix4x4.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Matrix4x4 = void 0;
var Matrix4x4 = /** @class */function () {
  // Makes identity matrix
  function Matrix4x4() {
    this._data = [];
    this._data = [1, 0, 0, 0,
    //
    0, 1, 0, 0,
    //
    0, 0, 1, 0,
    //
    0, 0, 0, 1];
  }
  Object.defineProperty(Matrix4x4.prototype, "data", {
    get: function get() {
      return this._data;
    },
    enumerable: false,
    configurable: true
  });
  Matrix4x4.identity = function () {
    return new Matrix4x4();
  };
  Matrix4x4.orthographic = function (left, right, bottom, top, nearClip, farClip) {
    var m = new Matrix4x4();
    var lr = 1.0 / (left - right);
    var bt = 1.0 / (bottom - top);
    var nf = 1.0 / (nearClip - farClip);
    m._data[0] = -2.0 * lr;
    m._data[5] = -2 * bt;
    m._data[10] = 2.0 * nf;
    m._data[12] = (left + right) * lr;
    m._data[13] = (top + bottom) * bt;
    m._data[14] = (farClip + nearClip) * nf;
    return m;
  };
  Matrix4x4.translation = function (position) {
    var m = new Matrix4x4();
    m._data[12] = position.x;
    m._data[13] = position.y;
    m._data[14] = position.z;
    return m;
  };
  return Matrix4x4;
}();
exports.Matrix4x4 = Matrix4x4;
},{}],"src/core/Engine.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Engine = void 0;
var gl_1 = require("./gl/gl");
var shader_1 = require("./gl/shader");
var sprite_1 = require("./graphics/sprite");
var matrix4x4_1 = require("./math/matrix4x4");
var Engine = /** @class */function () {
  function Engine() {
    console.log("Hello");
  }
  Engine.prototype.start = function () {
    this._canvas = gl_1.GLUtilities.initialize();
    gl_1.gl.clearColor(0, 0, 0, 1);
    this.loadShaders();
    this._shader.use();
    this._projection = matrix4x4_1.Matrix4x4.orthographic(0, this._canvas.width, 0, this._canvas.height, -100.0, 100.0);
    this._sprite = new sprite_1.Sprite("test");
    this._sprite.position.x = 0;
    this._sprite.position.y = 0;
    this._sprite.loadHexagon();
    this.resize();
    this.loop();
  };
  /**
   * Resizes the canvas to fit the window
   */
  Engine.prototype.resize = function () {
    if (this._canvas == undefined) return;
    this._canvas.width = window.innerWidth;
    this._canvas.height = window.innerHeight;
    //This says max area of the screen
    gl_1.gl.viewport(-1, 1, -1, 1);
  };
  Engine.prototype.createBuffer = function () {};
  /**
   * The game loop ------ CONTINUE AT 11:23
   */
  Engine.prototype.loop = function () {
    gl_1.gl.clear(gl_1.gl.COLOR_BUFFER_BIT);
    var colorPosition = this._shader.getUniformLocation("u_color");
    gl_1.gl.uniform4f(colorPosition, 0.4, 0.7, 0.3, 1);
    var projectionPosition = this._shader.getUniformLocation("u_projection");
    gl_1.gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this._projection.data));
    var modelLocation = this._shader.getUniformLocation("u_model");
    gl_1.gl.uniformMatrix4fv(modelLocation, false, new Float32Array(matrix4x4_1.Matrix4x4.translation(this._sprite.position).data));
    this._sprite.draw();
    requestAnimationFrame(this.loop.bind(this));
  };
  Engine.prototype.loadShaders = function () {
    // This language is called GLSL, and it interacts with the GPU
    // Another way to write the glPos... gl_Position = vec4(a_position.x, a_position.y, a_position.z, 1.0)
    var vertexShaderSource = "\n    attribute vec3 a_position;\n\n    uniform mat4 u_projection;\n    uniform mat4 u_model;\n    void main() {\n        gl_Position = u_projection * u_model * vec4(a_position, 1.0);\n    }\n    ";
    // This shader specifies colors
    // precision specifies how accurate the floats will be
    // Colors are vectors, r,g,b,a?
    var fragmentShaderSource = "\n    precision mediump float;\n\n    uniform vec4 u_color;\n\n    void main() {\n      gl_FragColor = u_color;\n    }\n    ";
    this._shader = new shader_1.Shader("basic", vertexShaderSource, fragmentShaderSource);
  };
  return Engine;
}();
exports.Engine = Engine;
},{"./gl/gl":"src/core/gl/gl.ts","./gl/shader":"src/core/gl/shader.ts","./graphics/sprite":"src/core/graphics/sprite.ts","./math/matrix4x4":"src/core/math/matrix4x4.ts"}],"src/app.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Engine_1 = require("./core/Engine");
var engine;
window.onload = function () {
  engine = new Engine_1.Engine();
  engine.start();
};
window.onresize = function () {
  engine.resize();
};
},{"./core/Engine":"src/core/Engine.ts"}],"../../../../.nvm/versions/node/v20.16.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "44451" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../../../../.nvm/versions/node/v20.16.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/app.ts"], null)
//# sourceMappingURL=/app.5cec07dd.js.map