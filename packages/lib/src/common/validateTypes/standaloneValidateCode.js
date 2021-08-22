(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.nirnaor = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
}); // https://github.com/ajv-validator/ajv/issues/889

var equal = require("fast-deep-equal");

equal.code = 'require("ajv/dist/runtime/equal").default';
exports["default"] = equal;

},{"fast-deep-equal":2}],2:[function(require,module,exports){
'use strict'; // do not edit .js files directly - edit src/index.jst

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

module.exports = function equal(a, b) {
  if (a === b) return true;

  if (a && b && _typeof(a) == 'object' && _typeof(b) == 'object') {
    if (a.constructor !== b.constructor) return false;
    var length, i, keys;

    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;

      for (i = length; i-- !== 0;) {
        if (!equal(a[i], b[i])) return false;
      }

      return true;
    }

    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0;) {
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
    }

    for (i = length; i-- !== 0;) {
      var key = keys[i];
      if (!equal(a[key], b[key])) return false;
    }

    return true;
  } // true if both NaN, false otherwise


  return a !== a && b !== b;
};

},{}],3:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

module.exports = validate10;
module.exports["default"] = validate10;
var schema11 = {
  "type": "object",
  "additionalProperties": {},
  "properties": {
    "layoutParams": {
      "$ref": "#/definitions/LayoutParams"
    },
    "behavourParams": {
      "$ref": "#/definitions/BehaviourParams"
    },
    "stylingParams": {
      "$ref": "#/definitions/StylingParams"
    }
  },
  "required": ["layoutParams"],
  "definitions": {
    "LayoutParams": {
      "type": "object",
      "additionalProperties": {},
      "properties": {
        "cropRatio": {
          "type": ["string", "number"]
        },
        "numberOfGroupsPerRow": {
          "type": "number"
        },
        "gallerySpacing": {
          "type": "number"
        }
      },
      "required": ["cropRatio", "gallerySpacing", "numberOfGroupsPerRow"]
    },
    "BehaviourParams": {
      "type": "object",
      "additionalProperties": {},
      "properties": {
        "item": {
          "$ref": "#/definitions/Item"
        }
      }
    },
    "Item": {
      "type": "object",
      "additionalProperties": {},
      "properties": {
        "video": {
          "$ref": "#/definitions/Video"
        }
      },
      "required": ["video"]
    },
    "Video": {
      "type": "object",
      "additionalProperties": {},
      "properties": {
        "playOn": {
          "$ref": "#/definitions/PlayOn"
        }
      },
      "required": ["playOn"]
    },
    "PlayOn": {
      "enum": ["auto", "hover", "onClick"],
      "type": "string"
    },
    "StylingParams": {
      "type": "object",
      "additionalProperties": {}
    }
  },
  "$schema": "http://json-schema.org/draft-07/schema#"
};
var schema12 = {
  "type": "object",
  "additionalProperties": {},
  "properties": {
    "cropRatio": {
      "type": ["string", "number"]
    },
    "numberOfGroupsPerRow": {
      "type": "number"
    },
    "gallerySpacing": {
      "type": "number"
    }
  },
  "required": ["cropRatio", "gallerySpacing", "numberOfGroupsPerRow"]
};
var schema17 = {
  "type": "object",
  "additionalProperties": {}
};
var schema13 = {
  "type": "object",
  "additionalProperties": {},
  "properties": {
    "item": {
      "$ref": "#/definitions/Item"
    }
  }
};
var schema14 = {
  "type": "object",
  "additionalProperties": {},
  "properties": {
    "video": {
      "$ref": "#/definitions/Video"
    }
  },
  "required": ["video"]
};
var schema15 = {
  "type": "object",
  "additionalProperties": {},
  "properties": {
    "playOn": {
      "$ref": "#/definitions/PlayOn"
    }
  },
  "required": ["playOn"]
};
var schema16 = {
  "enum": ["auto", "hover", "onClick"],
  "type": "string"
};

var func0 = require("ajv/dist/runtime/equal")["default"];

function validate13(data, valCxt) {
  "use strict";

  ;

  if (valCxt) {
    var instancePath = valCxt.instancePath;
    var parentData = valCxt.parentData;
    var parentDataProperty = valCxt.parentDataProperty;
    var rootData = valCxt.rootData;
  } else {
    var instancePath = "";
    var parentData = undefined;
    var parentDataProperty = undefined;
    var rootData = data;
  }

  var vErrors = null;
  var errors = 0;

  if (errors === 0) {
    if (data && _typeof(data) == "object" && !Array.isArray(data)) {
      var missing0;

      if (data.playOn === undefined && (missing0 = "playOn")) {
        validate13.errors = [{
          instancePath: instancePath,
          schemaPath: "#/required",
          keyword: "required",
          params: {
            missingProperty: missing0
          },
          message: "must have required property '" + missing0 + "'",
          schema: schema15.required,
          parentSchema: schema15,
          data: data
        }];
        return false;
      } else {
        if (data.playOn !== undefined) {
          var data0 = data.playOn;

          if (typeof data0 !== "string") {
            validate13.errors = [{
              instancePath: instancePath + "/playOn",
              schemaPath: "#/definitions/PlayOn/type",
              keyword: "type",
              params: {
                type: "string"
              },
              message: "must be string",
              schema: schema16.type,
              parentSchema: schema16,
              data: data0
            }];
            return false;
          }

          if (!(data0 === "auto" || data0 === "hover" || data0 === "onClick")) {
            validate13.errors = [{
              instancePath: instancePath + "/playOn",
              schemaPath: "#/definitions/PlayOn/enum",
              keyword: "enum",
              params: {
                allowedValues: schema16["enum"]
              },
              message: "must be equal to one of the allowed values",
              schema: schema16["enum"],
              parentSchema: schema16,
              data: data0
            }];
            return false;
          }
        }
      }
    } else {
      validate13.errors = [{
        instancePath: instancePath,
        schemaPath: "#/type",
        keyword: "type",
        params: {
          type: "object"
        },
        message: "must be object",
        schema: schema15.type,
        parentSchema: schema15,
        data: data
      }];
      return false;
    }
  }

  validate13.errors = vErrors;
  return errors === 0;
}

function validate12(data, valCxt) {
  "use strict";

  ;

  if (valCxt) {
    var instancePath = valCxt.instancePath;
    var parentData = valCxt.parentData;
    var parentDataProperty = valCxt.parentDataProperty;
    var rootData = valCxt.rootData;
  } else {
    var instancePath = "";
    var parentData = undefined;
    var parentDataProperty = undefined;
    var rootData = data;
  }

  var vErrors = null;
  var errors = 0;

  if (errors === 0) {
    if (data && _typeof(data) == "object" && !Array.isArray(data)) {
      var missing0;

      if (data.video === undefined && (missing0 = "video")) {
        validate12.errors = [{
          instancePath: instancePath,
          schemaPath: "#/required",
          keyword: "required",
          params: {
            missingProperty: missing0
          },
          message: "must have required property '" + missing0 + "'",
          schema: schema14.required,
          parentSchema: schema14,
          data: data
        }];
        return false;
      } else {
        if (data.video !== undefined) {
          if (!validate13(data.video, {
            instancePath: instancePath + "/video",
            parentData: data,
            parentDataProperty: "video",
            rootData: rootData
          })) {
            vErrors = vErrors === null ? validate13.errors : vErrors.concat(validate13.errors);
            errors = vErrors.length;
          }
        }
      }
    } else {
      validate12.errors = [{
        instancePath: instancePath,
        schemaPath: "#/type",
        keyword: "type",
        params: {
          type: "object"
        },
        message: "must be object",
        schema: schema14.type,
        parentSchema: schema14,
        data: data
      }];
      return false;
    }
  }

  validate12.errors = vErrors;
  return errors === 0;
}

function validate11(data, valCxt) {
  "use strict";

  ;

  if (valCxt) {
    var instancePath = valCxt.instancePath;
    var parentData = valCxt.parentData;
    var parentDataProperty = valCxt.parentDataProperty;
    var rootData = valCxt.rootData;
  } else {
    var instancePath = "";
    var parentData = undefined;
    var parentDataProperty = undefined;
    var rootData = data;
  }

  var vErrors = null;
  var errors = 0;

  if (errors === 0) {
    if (data && _typeof(data) == "object" && !Array.isArray(data)) {
      if (data.item !== undefined) {
        if (!validate12(data.item, {
          instancePath: instancePath + "/item",
          parentData: data,
          parentDataProperty: "item",
          rootData: rootData
        })) {
          vErrors = vErrors === null ? validate12.errors : vErrors.concat(validate12.errors);
          errors = vErrors.length;
        }
      }
    } else {
      validate11.errors = [{
        instancePath: instancePath,
        schemaPath: "#/type",
        keyword: "type",
        params: {
          type: "object"
        },
        message: "must be object",
        schema: schema13.type,
        parentSchema: schema13,
        data: data
      }];
      return false;
    }
  }

  validate11.errors = vErrors;
  return errors === 0;
}

function validate10(data, valCxt) {
  "use strict";

  ;

  if (valCxt) {
    var instancePath = valCxt.instancePath;
    var parentData = valCxt.parentData;
    var parentDataProperty = valCxt.parentDataProperty;
    var rootData = valCxt.rootData;
  } else {
    var instancePath = "";
    var parentData = undefined;
    var parentDataProperty = undefined;
    var rootData = data;
  }

  var vErrors = null;
  var errors = 0;

  if (errors === 0) {
    if (data && _typeof(data) == "object" && !Array.isArray(data)) {
      var missing0;

      if (data.layoutParams === undefined && (missing0 = "layoutParams")) {
        validate10.errors = [{
          instancePath: instancePath,
          schemaPath: "#/required",
          keyword: "required",
          params: {
            missingProperty: missing0
          },
          message: "must have required property '" + missing0 + "'",
          schema: schema11.required,
          parentSchema: schema11,
          data: data
        }];
        return false;
      } else {
        if (data.layoutParams !== undefined) {
          var data0 = data.layoutParams;
          var _errs2 = errors;
          var _errs3 = errors;

          if (errors === _errs3) {
            if (data0 && _typeof(data0) == "object" && !Array.isArray(data0)) {
              var missing1;

              if (data0.cropRatio === undefined && (missing1 = "cropRatio") || data0.gallerySpacing === undefined && (missing1 = "gallerySpacing") || data0.numberOfGroupsPerRow === undefined && (missing1 = "numberOfGroupsPerRow")) {
                validate10.errors = [{
                  instancePath: instancePath + "/layoutParams",
                  schemaPath: "#/definitions/LayoutParams/required",
                  keyword: "required",
                  params: {
                    missingProperty: missing1
                  },
                  message: "must have required property '" + missing1 + "'",
                  schema: schema12.required,
                  parentSchema: schema12,
                  data: data0
                }];
                return false;
              } else {
                if (data0.cropRatio !== undefined) {
                  var data1 = data0.cropRatio;
                  var _errs6 = errors;

                  if (typeof data1 !== "string" && !(typeof data1 == "number" && isFinite(data1))) {
                    validate10.errors = [{
                      instancePath: instancePath + "/layoutParams/cropRatio",
                      schemaPath: "#/definitions/LayoutParams/properties/cropRatio/type",
                      keyword: "type",
                      params: {
                        type: schema12.properties.cropRatio.type
                      },
                      message: "must be string,number",
                      schema: schema12.properties.cropRatio.type,
                      parentSchema: schema12.properties.cropRatio,
                      data: data1
                    }];
                    return false;
                  }

                  var valid2 = _errs6 === errors;
                } else {
                  var valid2 = true;
                }

                if (valid2) {
                  if (data0.numberOfGroupsPerRow !== undefined) {
                    var data2 = data0.numberOfGroupsPerRow;
                    var _errs8 = errors;

                    if (!(typeof data2 == "number" && isFinite(data2))) {
                      validate10.errors = [{
                        instancePath: instancePath + "/layoutParams/numberOfGroupsPerRow",
                        schemaPath: "#/definitions/LayoutParams/properties/numberOfGroupsPerRow/type",
                        keyword: "type",
                        params: {
                          type: "number"
                        },
                        message: "must be number",
                        schema: schema12.properties.numberOfGroupsPerRow.type,
                        parentSchema: schema12.properties.numberOfGroupsPerRow,
                        data: data2
                      }];
                      return false;
                    }

                    var valid2 = _errs8 === errors;
                  } else {
                    var valid2 = true;
                  }

                  if (valid2) {
                    if (data0.gallerySpacing !== undefined) {
                      var data3 = data0.gallerySpacing;
                      var _errs10 = errors;

                      if (!(typeof data3 == "number" && isFinite(data3))) {
                        validate10.errors = [{
                          instancePath: instancePath + "/layoutParams/gallerySpacing",
                          schemaPath: "#/definitions/LayoutParams/properties/gallerySpacing/type",
                          keyword: "type",
                          params: {
                            type: "number"
                          },
                          message: "must be number",
                          schema: schema12.properties.gallerySpacing.type,
                          parentSchema: schema12.properties.gallerySpacing,
                          data: data3
                        }];
                        return false;
                      }

                      var valid2 = _errs10 === errors;
                    } else {
                      var valid2 = true;
                    }
                  }
                }
              }
            } else {
              validate10.errors = [{
                instancePath: instancePath + "/layoutParams",
                schemaPath: "#/definitions/LayoutParams/type",
                keyword: "type",
                params: {
                  type: "object"
                },
                message: "must be object",
                schema: schema12.type,
                parentSchema: schema12,
                data: data0
              }];
              return false;
            }
          }

          var valid0 = _errs2 === errors;
        } else {
          var valid0 = true;
        }

        if (valid0) {
          if (data.behavourParams !== undefined) {
            var _errs12 = errors;

            if (!validate11(data.behavourParams, {
              instancePath: instancePath + "/behavourParams",
              parentData: data,
              parentDataProperty: "behavourParams",
              rootData: rootData
            })) {
              vErrors = vErrors === null ? validate11.errors : vErrors.concat(validate11.errors);
              errors = vErrors.length;
            }

            var valid0 = _errs12 === errors;
          } else {
            var valid0 = true;
          }

          if (valid0) {
            if (data.stylingParams !== undefined) {
              var data5 = data.stylingParams;
              var _errs13 = errors;
              var _errs14 = errors;

              if (errors === _errs14) {
                if (data5 && _typeof(data5) == "object" && !Array.isArray(data5)) {} else {
                  validate10.errors = [{
                    instancePath: instancePath + "/stylingParams",
                    schemaPath: "#/definitions/StylingParams/type",
                    keyword: "type",
                    params: {
                      type: "object"
                    },
                    message: "must be object",
                    schema: schema17.type,
                    parentSchema: schema17,
                    data: data5
                  }];
                  return false;
                }
              }

              var valid0 = _errs13 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate10.errors = [{
        instancePath: instancePath,
        schemaPath: "#/type",
        keyword: "type",
        params: {
          type: "object"
        },
        message: "must be object",
        schema: schema11.type,
        parentSchema: schema11,
        data: data
      }];
      return false;
    }
  }

  validate10.errors = vErrors;
  return errors === 0;
}

},{"ajv/dist/runtime/equal":1}]},{},[3])(3)
});
