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
        "collage": {
          "$ref": "#/definitions/Collage"
        },
        "thumbnails": {
          "$ref": "#/definitions/Thumbnails"
        },
        "navigationArrows": {
          "$ref": "#/definitions/NavigationArrows"
        },
        "gallerySpacing": {
          "type": "number"
        },
        "itemSpacing": {
          "type": "number"
        },
        "enableStreching": {
          "type": "boolean"
        },
        "cropRatio": {
          "anyOf": [{
            "type": "array",
            "items": {
              "type": "string"
            }
          }, {
            "type": ["string", "number"]
          }]
        },
        "numberOfColumns": {
          "type": "number"
        },
        "numberOfRows": {
          "type": "number"
        },
        "cropType": {
          "type": "string"
        },
        "enableCrop": {
          "type": "boolean"
        },
        "enableSmartCrop": {
          "type": "boolean"
        },
        "minItemSize": {
          "type": "number"
        },
        "cropOnlyFill": {
          "type": "boolean"
        },
        "forceGroupsOrder": {
          "enum": ["LEFT_TO_RIGHT", "RIGHT_TO_LEFT"],
          "type": "string"
        },
        "slideshowInfoSize": {
          "type": "number"
        },
        "scatter": {
          "type": "number"
        },
        "scrollDirection": {
          "enum": ["HORIZONTAL", "VERTICAL"],
          "type": "string"
        },
        "layoutOrientation": {
          "enum": ["HORIZONTAL", "VERTICAL"],
          "type": "string"
        },
        "isSlideshow": {
          "type": "boolean"
        },
        "isGrid": {
          "type": "boolean"
        },
        "isMasonry": {
          "type": "boolean"
        },
        "isSlider": {
          "type": "boolean"
        },
        "isColumns": {
          "type": "boolean"
        }
      },
      "required": ["collage", "cropOnlyFill", "cropRatio", "cropType", "enableCrop", "enableSmartCrop", "enableStreching", "forceGroupsOrder", "gallerySpacing", "isColumns", "isGrid", "isMasonry", "isSlider", "isSlideshow", "itemSpacing", "layoutOrientation", "minItemSize", "navigationArrows", "numberOfColumns", "numberOfRows", "scatter", "scrollDirection", "slideshowInfoSize", "thumbnails"]
    },
    "Collage": {
      "type": "object",
      "properties": {
        "amount": {
          "type": "number"
        },
        "density": {
          "type": "number"
        },
        "groupByOrientation": {
          "type": "boolean"
        },
        "groupTypes": {
          "anyOf": [{
            "type": "array",
            "items": {
              "type": "string"
            }
          }, {
            "type": "string"
          }]
        },
        "groupSize": {
          "type": "number"
        }
      },
      "required": ["amount", "density", "groupByOrientation", "groupSize", "groupTypes"]
    },
    "Thumbnails": {
      "type": "object",
      "properties": {
        "enable": {
          "type": "boolean"
        },
        "spacings": {
          "type": "number"
        },
        "size": {
          "type": "number"
        },
        "alignment": {
          "enum": ["bottom", "left", "right", "top"],
          "type": "string"
        }
      },
      "required": ["alignment", "enable", "size", "spacings"]
    },
    "NavigationArrows": {
      "type": "object",
      "properties": {
        "enable": {
          "type": "boolean"
        },
        "size": {
          "type": "number"
        },
        "padding": {
          "type": "number"
        },
        "position": {
          "enum": ["ON_THE_GALLERY", "OUTSIDE_THE_GALLERY"],
          "type": "string"
        },
        "verticalAlignment": {
          "enum": ["IMAGE", "INFO", "ITEM"],
          "type": "string"
        }
      },
      "required": ["enable", "padding", "position", "size", "verticalAlignment"]
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
        "clickAction": {
          "enum": ["ACTION", "LINK", "MAGNIFY", "NOTHING"],
          "type": "string"
        },
        "video": {
          "$ref": "#/definitions/Video"
        },
        "overlay": {
          "$ref": "#/definitions/Overlay"
        },
        "info": {
          "$ref": "#/definitions/Info"
        }
      },
      "required": ["clickAction", "info", "overlay", "video"]
    },
    "Video": {
      "type": "object",
      "additionalProperties": {},
      "properties": {
        "speed": {
          "type": "number"
        },
        "volume": {
          "type": "number"
        },
        "loop": {
          "type": "boolean"
        },
        "playTrigger": {
          "enum": ["AUTO", "CLICK", "HOVER"],
          "type": "string"
        },
        "enablePlayButton": {
          "type": "boolean"
        },
        "enableControls": {
          "type": "boolean"
        }
      },
      "required": ["enableControls", "enablePlayButton", "loop", "playTrigger", "speed", "volume"]
    },
    "Overlay": {
      "type": "object",
      "additionalProperties": {},
      "properties": {
        "hoveringBehaviour": {
          "enum": ["ALWAYS_SHOW", "APPEARS", "DISAPPEARS", "NEVER_SHOW"],
          "type": "string"
        },
        "hoverAnimation": {
          "enum": ["BLUR", "COLOR_IN", "DARKENED", "GRAYSCALE", "INVERT", "NO_EFFECT", "SHRINK", "ZOOM_IN"],
          "type": "string"
        },
        "position": {
          "enum": ["BUTTOM", "CENTERED_HORIZONTALLY", "CENTERED_VERTICALLY", "LEFT", "RIGHT", "TOP"],
          "type": "string"
        },
        "size": {
          "type": "number"
        },
        "sizeUnits": {
          "enum": ["PERCENT", "PIXEL"],
          "type": "string"
        },
        "padding": {
          "type": "number"
        }
      },
      "required": ["hoverAnimation", "hoveringBehaviour", "padding", "position", "size", "sizeUnits"]
    },
    "Info": {
      "type": "object",
      "additionalProperties": {},
      "properties": {
        "placement": {
          "enum": ["ABOVE", "ALTERNATE_HORIZONTALY", "ALTERNATE_VERTICALY", "BELOW", "LEFT", "RIGHT"],
          "type": "string"
        }
      },
      "required": ["placement"]
    },
    "StylingParams": {
      "type": "object",
      "additionalProperties": {},
      "properties": {
        "arrowsColor": {
          "type": "string"
        },
        "itemShadowBlur": {
          "type": "number"
        },
        "itemShadowDirection": {
          "type": "number"
        },
        "itemShadowOpacityAndColor": {
          "type": "string"
        },
        "textBoxBorderColor": {
          "type": "string"
        },
        "textBoxBorderRadius": {
          "type": "number"
        },
        "itemShadowSize": {
          "type": "number"
        },
        "itemEnableShadow": {
          "type": "boolean"
        }
      },
      "required": ["arrowsColor", "itemEnableShadow", "itemShadowBlur", "itemShadowDirection", "itemShadowOpacityAndColor", "itemShadowSize", "textBoxBorderColor", "textBoxBorderRadius"]
    }
  },
  "$schema": "http://json-schema.org/draft-07/schema#"
};
var schema21 = {
  "type": "object",
  "additionalProperties": {},
  "properties": {
    "arrowsColor": {
      "type": "string"
    },
    "itemShadowBlur": {
      "type": "number"
    },
    "itemShadowDirection": {
      "type": "number"
    },
    "itemShadowOpacityAndColor": {
      "type": "string"
    },
    "textBoxBorderColor": {
      "type": "string"
    },
    "textBoxBorderRadius": {
      "type": "number"
    },
    "itemShadowSize": {
      "type": "number"
    },
    "itemEnableShadow": {
      "type": "boolean"
    }
  },
  "required": ["arrowsColor", "itemEnableShadow", "itemShadowBlur", "itemShadowDirection", "itemShadowOpacityAndColor", "itemShadowSize", "textBoxBorderColor", "textBoxBorderRadius"]
};
var schema12 = {
  "type": "object",
  "additionalProperties": {},
  "properties": {
    "collage": {
      "$ref": "#/definitions/Collage"
    },
    "thumbnails": {
      "$ref": "#/definitions/Thumbnails"
    },
    "navigationArrows": {
      "$ref": "#/definitions/NavigationArrows"
    },
    "gallerySpacing": {
      "type": "number"
    },
    "itemSpacing": {
      "type": "number"
    },
    "enableStreching": {
      "type": "boolean"
    },
    "cropRatio": {
      "anyOf": [{
        "type": "array",
        "items": {
          "type": "string"
        }
      }, {
        "type": ["string", "number"]
      }]
    },
    "numberOfColumns": {
      "type": "number"
    },
    "numberOfRows": {
      "type": "number"
    },
    "cropType": {
      "type": "string"
    },
    "enableCrop": {
      "type": "boolean"
    },
    "enableSmartCrop": {
      "type": "boolean"
    },
    "minItemSize": {
      "type": "number"
    },
    "cropOnlyFill": {
      "type": "boolean"
    },
    "forceGroupsOrder": {
      "enum": ["LEFT_TO_RIGHT", "RIGHT_TO_LEFT"],
      "type": "string"
    },
    "slideshowInfoSize": {
      "type": "number"
    },
    "scatter": {
      "type": "number"
    },
    "scrollDirection": {
      "enum": ["HORIZONTAL", "VERTICAL"],
      "type": "string"
    },
    "layoutOrientation": {
      "enum": ["HORIZONTAL", "VERTICAL"],
      "type": "string"
    },
    "isSlideshow": {
      "type": "boolean"
    },
    "isGrid": {
      "type": "boolean"
    },
    "isMasonry": {
      "type": "boolean"
    },
    "isSlider": {
      "type": "boolean"
    },
    "isColumns": {
      "type": "boolean"
    }
  },
  "required": ["collage", "cropOnlyFill", "cropRatio", "cropType", "enableCrop", "enableSmartCrop", "enableStreching", "forceGroupsOrder", "gallerySpacing", "isColumns", "isGrid", "isMasonry", "isSlider", "isSlideshow", "itemSpacing", "layoutOrientation", "minItemSize", "navigationArrows", "numberOfColumns", "numberOfRows", "scatter", "scrollDirection", "slideshowInfoSize", "thumbnails"]
};
var schema13 = {
  "type": "object",
  "properties": {
    "amount": {
      "type": "number"
    },
    "density": {
      "type": "number"
    },
    "groupByOrientation": {
      "type": "boolean"
    },
    "groupTypes": {
      "anyOf": [{
        "type": "array",
        "items": {
          "type": "string"
        }
      }, {
        "type": "string"
      }]
    },
    "groupSize": {
      "type": "number"
    }
  },
  "required": ["amount", "density", "groupByOrientation", "groupSize", "groupTypes"]
};
var schema14 = {
  "type": "object",
  "properties": {
    "enable": {
      "type": "boolean"
    },
    "spacings": {
      "type": "number"
    },
    "size": {
      "type": "number"
    },
    "alignment": {
      "enum": ["bottom", "left", "right", "top"],
      "type": "string"
    }
  },
  "required": ["alignment", "enable", "size", "spacings"]
};
var schema15 = {
  "type": "object",
  "properties": {
    "enable": {
      "type": "boolean"
    },
    "size": {
      "type": "number"
    },
    "padding": {
      "type": "number"
    },
    "position": {
      "enum": ["ON_THE_GALLERY", "OUTSIDE_THE_GALLERY"],
      "type": "string"
    },
    "verticalAlignment": {
      "enum": ["IMAGE", "INFO", "ITEM"],
      "type": "string"
    }
  },
  "required": ["enable", "padding", "position", "size", "verticalAlignment"]
};

var func0 = require("ajv/dist/runtime/equal")["default"];

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
      var missing0;

      if (data.collage === undefined && (missing0 = "collage") || data.cropOnlyFill === undefined && (missing0 = "cropOnlyFill") || data.cropRatio === undefined && (missing0 = "cropRatio") || data.cropType === undefined && (missing0 = "cropType") || data.enableCrop === undefined && (missing0 = "enableCrop") || data.enableSmartCrop === undefined && (missing0 = "enableSmartCrop") || data.enableStreching === undefined && (missing0 = "enableStreching") || data.forceGroupsOrder === undefined && (missing0 = "forceGroupsOrder") || data.gallerySpacing === undefined && (missing0 = "gallerySpacing") || data.isColumns === undefined && (missing0 = "isColumns") || data.isGrid === undefined && (missing0 = "isGrid") || data.isMasonry === undefined && (missing0 = "isMasonry") || data.isSlider === undefined && (missing0 = "isSlider") || data.isSlideshow === undefined && (missing0 = "isSlideshow") || data.itemSpacing === undefined && (missing0 = "itemSpacing") || data.layoutOrientation === undefined && (missing0 = "layoutOrientation") || data.minItemSize === undefined && (missing0 = "minItemSize") || data.navigationArrows === undefined && (missing0 = "navigationArrows") || data.numberOfColumns === undefined && (missing0 = "numberOfColumns") || data.numberOfRows === undefined && (missing0 = "numberOfRows") || data.scatter === undefined && (missing0 = "scatter") || data.scrollDirection === undefined && (missing0 = "scrollDirection") || data.slideshowInfoSize === undefined && (missing0 = "slideshowInfoSize") || data.thumbnails === undefined && (missing0 = "thumbnails")) {
        validate11.errors = [{
          instancePath: instancePath,
          schemaPath: "#/required",
          keyword: "required",
          params: {
            missingProperty: missing0
          },
          message: "must have required property '" + missing0 + "'",
          schema: schema12.required,
          parentSchema: schema12,
          data: data
        }];
        return false;
      } else {
        if (data.collage !== undefined) {
          var data0 = data.collage;
          var _errs2 = errors;
          var _errs3 = errors;

          if (errors === _errs3) {
            if (data0 && _typeof(data0) == "object" && !Array.isArray(data0)) {
              var missing1;

              if (data0.amount === undefined && (missing1 = "amount") || data0.density === undefined && (missing1 = "density") || data0.groupByOrientation === undefined && (missing1 = "groupByOrientation") || data0.groupSize === undefined && (missing1 = "groupSize") || data0.groupTypes === undefined && (missing1 = "groupTypes")) {
                validate11.errors = [{
                  instancePath: instancePath + "/collage",
                  schemaPath: "#/definitions/Collage/required",
                  keyword: "required",
                  params: {
                    missingProperty: missing1
                  },
                  message: "must have required property '" + missing1 + "'",
                  schema: schema13.required,
                  parentSchema: schema13,
                  data: data0
                }];
                return false;
              } else {
                if (data0.amount !== undefined) {
                  var data1 = data0.amount;
                  var _errs5 = errors;

                  if (!(typeof data1 == "number" && isFinite(data1))) {
                    validate11.errors = [{
                      instancePath: instancePath + "/collage/amount",
                      schemaPath: "#/definitions/Collage/properties/amount/type",
                      keyword: "type",
                      params: {
                        type: "number"
                      },
                      message: "must be number",
                      schema: schema13.properties.amount.type,
                      parentSchema: schema13.properties.amount,
                      data: data1
                    }];
                    return false;
                  }

                  var valid2 = _errs5 === errors;
                } else {
                  var valid2 = true;
                }

                if (valid2) {
                  if (data0.density !== undefined) {
                    var data2 = data0.density;
                    var _errs7 = errors;

                    if (!(typeof data2 == "number" && isFinite(data2))) {
                      validate11.errors = [{
                        instancePath: instancePath + "/collage/density",
                        schemaPath: "#/definitions/Collage/properties/density/type",
                        keyword: "type",
                        params: {
                          type: "number"
                        },
                        message: "must be number",
                        schema: schema13.properties.density.type,
                        parentSchema: schema13.properties.density,
                        data: data2
                      }];
                      return false;
                    }

                    var valid2 = _errs7 === errors;
                  } else {
                    var valid2 = true;
                  }

                  if (valid2) {
                    if (data0.groupByOrientation !== undefined) {
                      var data3 = data0.groupByOrientation;
                      var _errs9 = errors;

                      if (typeof data3 !== "boolean") {
                        validate11.errors = [{
                          instancePath: instancePath + "/collage/groupByOrientation",
                          schemaPath: "#/definitions/Collage/properties/groupByOrientation/type",
                          keyword: "type",
                          params: {
                            type: "boolean"
                          },
                          message: "must be boolean",
                          schema: schema13.properties.groupByOrientation.type,
                          parentSchema: schema13.properties.groupByOrientation,
                          data: data3
                        }];
                        return false;
                      }

                      var valid2 = _errs9 === errors;
                    } else {
                      var valid2 = true;
                    }

                    if (valid2) {
                      if (data0.groupTypes !== undefined) {
                        var data4 = data0.groupTypes;
                        var _errs11 = errors;
                        var _errs12 = errors;
                        var valid3 = false;
                        var _errs13 = errors;

                        if (errors === _errs13) {
                          if (Array.isArray(data4)) {
                            var valid4 = true;
                            var len0 = data4.length;

                            for (var i0 = 0; i0 < len0; i0++) {
                              var data5 = data4[i0];
                              var _errs15 = errors;

                              if (typeof data5 !== "string") {
                                var err0 = {
                                  instancePath: instancePath + "/collage/groupTypes/" + i0,
                                  schemaPath: "#/definitions/Collage/properties/groupTypes/anyOf/0/items/type",
                                  keyword: "type",
                                  params: {
                                    type: "string"
                                  },
                                  message: "must be string",
                                  schema: schema13.properties.groupTypes.anyOf[0].items.type,
                                  parentSchema: schema13.properties.groupTypes.anyOf[0].items,
                                  data: data5
                                };

                                if (vErrors === null) {
                                  vErrors = [err0];
                                } else {
                                  vErrors.push(err0);
                                }

                                errors++;
                              }

                              var valid4 = _errs15 === errors;

                              if (!valid4) {
                                break;
                              }
                            }
                          } else {
                            var err1 = {
                              instancePath: instancePath + "/collage/groupTypes",
                              schemaPath: "#/definitions/Collage/properties/groupTypes/anyOf/0/type",
                              keyword: "type",
                              params: {
                                type: "array"
                              },
                              message: "must be array",
                              schema: schema13.properties.groupTypes.anyOf[0].type,
                              parentSchema: schema13.properties.groupTypes.anyOf[0],
                              data: data4
                            };

                            if (vErrors === null) {
                              vErrors = [err1];
                            } else {
                              vErrors.push(err1);
                            }

                            errors++;
                          }
                        }

                        var _valid0 = _errs13 === errors;

                        valid3 = valid3 || _valid0;

                        if (!valid3) {
                          var _errs17 = errors;

                          if (typeof data4 !== "string") {
                            var err2 = {
                              instancePath: instancePath + "/collage/groupTypes",
                              schemaPath: "#/definitions/Collage/properties/groupTypes/anyOf/1/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string",
                              schema: schema13.properties.groupTypes.anyOf[1].type,
                              parentSchema: schema13.properties.groupTypes.anyOf[1],
                              data: data4
                            };

                            if (vErrors === null) {
                              vErrors = [err2];
                            } else {
                              vErrors.push(err2);
                            }

                            errors++;
                          }

                          var _valid0 = _errs17 === errors;

                          valid3 = valid3 || _valid0;
                        }

                        if (!valid3) {
                          var err3 = {
                            instancePath: instancePath + "/collage/groupTypes",
                            schemaPath: "#/definitions/Collage/properties/groupTypes/anyOf",
                            keyword: "anyOf",
                            params: {},
                            message: "must match a schema in anyOf",
                            schema: schema13.properties.groupTypes.anyOf,
                            parentSchema: schema13.properties.groupTypes,
                            data: data4
                          };

                          if (vErrors === null) {
                            vErrors = [err3];
                          } else {
                            vErrors.push(err3);
                          }

                          errors++;
                          validate11.errors = vErrors;
                          return false;
                        } else {
                          errors = _errs12;

                          if (vErrors !== null) {
                            if (_errs12) {
                              vErrors.length = _errs12;
                            } else {
                              vErrors = null;
                            }
                          }
                        }

                        var valid2 = _errs11 === errors;
                      } else {
                        var valid2 = true;
                      }

                      if (valid2) {
                        if (data0.groupSize !== undefined) {
                          var data6 = data0.groupSize;
                          var _errs19 = errors;

                          if (!(typeof data6 == "number" && isFinite(data6))) {
                            validate11.errors = [{
                              instancePath: instancePath + "/collage/groupSize",
                              schemaPath: "#/definitions/Collage/properties/groupSize/type",
                              keyword: "type",
                              params: {
                                type: "number"
                              },
                              message: "must be number",
                              schema: schema13.properties.groupSize.type,
                              parentSchema: schema13.properties.groupSize,
                              data: data6
                            }];
                            return false;
                          }

                          var valid2 = _errs19 === errors;
                        } else {
                          var valid2 = true;
                        }
                      }
                    }
                  }
                }
              }
            } else {
              validate11.errors = [{
                instancePath: instancePath + "/collage",
                schemaPath: "#/definitions/Collage/type",
                keyword: "type",
                params: {
                  type: "object"
                },
                message: "must be object",
                schema: schema13.type,
                parentSchema: schema13,
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
          if (data.thumbnails !== undefined) {
            var data7 = data.thumbnails;
            var _errs21 = errors;
            var _errs22 = errors;

            if (errors === _errs22) {
              if (data7 && _typeof(data7) == "object" && !Array.isArray(data7)) {
                var missing2;

                if (data7.alignment === undefined && (missing2 = "alignment") || data7.enable === undefined && (missing2 = "enable") || data7.size === undefined && (missing2 = "size") || data7.spacings === undefined && (missing2 = "spacings")) {
                  validate11.errors = [{
                    instancePath: instancePath + "/thumbnails",
                    schemaPath: "#/definitions/Thumbnails/required",
                    keyword: "required",
                    params: {
                      missingProperty: missing2
                    },
                    message: "must have required property '" + missing2 + "'",
                    schema: schema14.required,
                    parentSchema: schema14,
                    data: data7
                  }];
                  return false;
                } else {
                  if (data7.enable !== undefined) {
                    var data8 = data7.enable;
                    var _errs24 = errors;

                    if (typeof data8 !== "boolean") {
                      validate11.errors = [{
                        instancePath: instancePath + "/thumbnails/enable",
                        schemaPath: "#/definitions/Thumbnails/properties/enable/type",
                        keyword: "type",
                        params: {
                          type: "boolean"
                        },
                        message: "must be boolean",
                        schema: schema14.properties.enable.type,
                        parentSchema: schema14.properties.enable,
                        data: data8
                      }];
                      return false;
                    }

                    var valid6 = _errs24 === errors;
                  } else {
                    var valid6 = true;
                  }

                  if (valid6) {
                    if (data7.spacings !== undefined) {
                      var data9 = data7.spacings;
                      var _errs26 = errors;

                      if (!(typeof data9 == "number" && isFinite(data9))) {
                        validate11.errors = [{
                          instancePath: instancePath + "/thumbnails/spacings",
                          schemaPath: "#/definitions/Thumbnails/properties/spacings/type",
                          keyword: "type",
                          params: {
                            type: "number"
                          },
                          message: "must be number",
                          schema: schema14.properties.spacings.type,
                          parentSchema: schema14.properties.spacings,
                          data: data9
                        }];
                        return false;
                      }

                      var valid6 = _errs26 === errors;
                    } else {
                      var valid6 = true;
                    }

                    if (valid6) {
                      if (data7.size !== undefined) {
                        var data10 = data7.size;
                        var _errs28 = errors;

                        if (!(typeof data10 == "number" && isFinite(data10))) {
                          validate11.errors = [{
                            instancePath: instancePath + "/thumbnails/size",
                            schemaPath: "#/definitions/Thumbnails/properties/size/type",
                            keyword: "type",
                            params: {
                              type: "number"
                            },
                            message: "must be number",
                            schema: schema14.properties.size.type,
                            parentSchema: schema14.properties.size,
                            data: data10
                          }];
                          return false;
                        }

                        var valid6 = _errs28 === errors;
                      } else {
                        var valid6 = true;
                      }

                      if (valid6) {
                        if (data7.alignment !== undefined) {
                          var data11 = data7.alignment;
                          var _errs30 = errors;

                          if (typeof data11 !== "string") {
                            validate11.errors = [{
                              instancePath: instancePath + "/thumbnails/alignment",
                              schemaPath: "#/definitions/Thumbnails/properties/alignment/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string",
                              schema: schema14.properties.alignment.type,
                              parentSchema: schema14.properties.alignment,
                              data: data11
                            }];
                            return false;
                          }

                          if (!(data11 === "bottom" || data11 === "left" || data11 === "right" || data11 === "top")) {
                            validate11.errors = [{
                              instancePath: instancePath + "/thumbnails/alignment",
                              schemaPath: "#/definitions/Thumbnails/properties/alignment/enum",
                              keyword: "enum",
                              params: {
                                allowedValues: schema14.properties.alignment["enum"]
                              },
                              message: "must be equal to one of the allowed values",
                              schema: schema14.properties.alignment["enum"],
                              parentSchema: schema14.properties.alignment,
                              data: data11
                            }];
                            return false;
                          }

                          var valid6 = _errs30 === errors;
                        } else {
                          var valid6 = true;
                        }
                      }
                    }
                  }
                }
              } else {
                validate11.errors = [{
                  instancePath: instancePath + "/thumbnails",
                  schemaPath: "#/definitions/Thumbnails/type",
                  keyword: "type",
                  params: {
                    type: "object"
                  },
                  message: "must be object",
                  schema: schema14.type,
                  parentSchema: schema14,
                  data: data7
                }];
                return false;
              }
            }

            var valid0 = _errs21 === errors;
          } else {
            var valid0 = true;
          }

          if (valid0) {
            if (data.navigationArrows !== undefined) {
              var data12 = data.navigationArrows;
              var _errs32 = errors;
              var _errs33 = errors;

              if (errors === _errs33) {
                if (data12 && _typeof(data12) == "object" && !Array.isArray(data12)) {
                  var missing3;

                  if (data12.enable === undefined && (missing3 = "enable") || data12.padding === undefined && (missing3 = "padding") || data12.position === undefined && (missing3 = "position") || data12.size === undefined && (missing3 = "size") || data12.verticalAlignment === undefined && (missing3 = "verticalAlignment")) {
                    validate11.errors = [{
                      instancePath: instancePath + "/navigationArrows",
                      schemaPath: "#/definitions/NavigationArrows/required",
                      keyword: "required",
                      params: {
                        missingProperty: missing3
                      },
                      message: "must have required property '" + missing3 + "'",
                      schema: schema15.required,
                      parentSchema: schema15,
                      data: data12
                    }];
                    return false;
                  } else {
                    if (data12.enable !== undefined) {
                      var data13 = data12.enable;
                      var _errs35 = errors;

                      if (typeof data13 !== "boolean") {
                        validate11.errors = [{
                          instancePath: instancePath + "/navigationArrows/enable",
                          schemaPath: "#/definitions/NavigationArrows/properties/enable/type",
                          keyword: "type",
                          params: {
                            type: "boolean"
                          },
                          message: "must be boolean",
                          schema: schema15.properties.enable.type,
                          parentSchema: schema15.properties.enable,
                          data: data13
                        }];
                        return false;
                      }

                      var valid8 = _errs35 === errors;
                    } else {
                      var valid8 = true;
                    }

                    if (valid8) {
                      if (data12.size !== undefined) {
                        var data14 = data12.size;
                        var _errs37 = errors;

                        if (!(typeof data14 == "number" && isFinite(data14))) {
                          validate11.errors = [{
                            instancePath: instancePath + "/navigationArrows/size",
                            schemaPath: "#/definitions/NavigationArrows/properties/size/type",
                            keyword: "type",
                            params: {
                              type: "number"
                            },
                            message: "must be number",
                            schema: schema15.properties.size.type,
                            parentSchema: schema15.properties.size,
                            data: data14
                          }];
                          return false;
                        }

                        var valid8 = _errs37 === errors;
                      } else {
                        var valid8 = true;
                      }

                      if (valid8) {
                        if (data12.padding !== undefined) {
                          var data15 = data12.padding;
                          var _errs39 = errors;

                          if (!(typeof data15 == "number" && isFinite(data15))) {
                            validate11.errors = [{
                              instancePath: instancePath + "/navigationArrows/padding",
                              schemaPath: "#/definitions/NavigationArrows/properties/padding/type",
                              keyword: "type",
                              params: {
                                type: "number"
                              },
                              message: "must be number",
                              schema: schema15.properties.padding.type,
                              parentSchema: schema15.properties.padding,
                              data: data15
                            }];
                            return false;
                          }

                          var valid8 = _errs39 === errors;
                        } else {
                          var valid8 = true;
                        }

                        if (valid8) {
                          if (data12.position !== undefined) {
                            var data16 = data12.position;
                            var _errs41 = errors;

                            if (typeof data16 !== "string") {
                              validate11.errors = [{
                                instancePath: instancePath + "/navigationArrows/position",
                                schemaPath: "#/definitions/NavigationArrows/properties/position/type",
                                keyword: "type",
                                params: {
                                  type: "string"
                                },
                                message: "must be string",
                                schema: schema15.properties.position.type,
                                parentSchema: schema15.properties.position,
                                data: data16
                              }];
                              return false;
                            }

                            if (!(data16 === "ON_THE_GALLERY" || data16 === "OUTSIDE_THE_GALLERY")) {
                              validate11.errors = [{
                                instancePath: instancePath + "/navigationArrows/position",
                                schemaPath: "#/definitions/NavigationArrows/properties/position/enum",
                                keyword: "enum",
                                params: {
                                  allowedValues: schema15.properties.position["enum"]
                                },
                                message: "must be equal to one of the allowed values",
                                schema: schema15.properties.position["enum"],
                                parentSchema: schema15.properties.position,
                                data: data16
                              }];
                              return false;
                            }

                            var valid8 = _errs41 === errors;
                          } else {
                            var valid8 = true;
                          }

                          if (valid8) {
                            if (data12.verticalAlignment !== undefined) {
                              var data17 = data12.verticalAlignment;
                              var _errs43 = errors;

                              if (typeof data17 !== "string") {
                                validate11.errors = [{
                                  instancePath: instancePath + "/navigationArrows/verticalAlignment",
                                  schemaPath: "#/definitions/NavigationArrows/properties/verticalAlignment/type",
                                  keyword: "type",
                                  params: {
                                    type: "string"
                                  },
                                  message: "must be string",
                                  schema: schema15.properties.verticalAlignment.type,
                                  parentSchema: schema15.properties.verticalAlignment,
                                  data: data17
                                }];
                                return false;
                              }

                              if (!(data17 === "IMAGE" || data17 === "INFO" || data17 === "ITEM")) {
                                validate11.errors = [{
                                  instancePath: instancePath + "/navigationArrows/verticalAlignment",
                                  schemaPath: "#/definitions/NavigationArrows/properties/verticalAlignment/enum",
                                  keyword: "enum",
                                  params: {
                                    allowedValues: schema15.properties.verticalAlignment["enum"]
                                  },
                                  message: "must be equal to one of the allowed values",
                                  schema: schema15.properties.verticalAlignment["enum"],
                                  parentSchema: schema15.properties.verticalAlignment,
                                  data: data17
                                }];
                                return false;
                              }

                              var valid8 = _errs43 === errors;
                            } else {
                              var valid8 = true;
                            }
                          }
                        }
                      }
                    }
                  }
                } else {
                  validate11.errors = [{
                    instancePath: instancePath + "/navigationArrows",
                    schemaPath: "#/definitions/NavigationArrows/type",
                    keyword: "type",
                    params: {
                      type: "object"
                    },
                    message: "must be object",
                    schema: schema15.type,
                    parentSchema: schema15,
                    data: data12
                  }];
                  return false;
                }
              }

              var valid0 = _errs32 === errors;
            } else {
              var valid0 = true;
            }

            if (valid0) {
              if (data.gallerySpacing !== undefined) {
                var data18 = data.gallerySpacing;
                var _errs45 = errors;

                if (!(typeof data18 == "number" && isFinite(data18))) {
                  validate11.errors = [{
                    instancePath: instancePath + "/gallerySpacing",
                    schemaPath: "#/properties/gallerySpacing/type",
                    keyword: "type",
                    params: {
                      type: "number"
                    },
                    message: "must be number",
                    schema: schema12.properties.gallerySpacing.type,
                    parentSchema: schema12.properties.gallerySpacing,
                    data: data18
                  }];
                  return false;
                }

                var valid0 = _errs45 === errors;
              } else {
                var valid0 = true;
              }

              if (valid0) {
                if (data.itemSpacing !== undefined) {
                  var data19 = data.itemSpacing;
                  var _errs47 = errors;

                  if (!(typeof data19 == "number" && isFinite(data19))) {
                    validate11.errors = [{
                      instancePath: instancePath + "/itemSpacing",
                      schemaPath: "#/properties/itemSpacing/type",
                      keyword: "type",
                      params: {
                        type: "number"
                      },
                      message: "must be number",
                      schema: schema12.properties.itemSpacing.type,
                      parentSchema: schema12.properties.itemSpacing,
                      data: data19
                    }];
                    return false;
                  }

                  var valid0 = _errs47 === errors;
                } else {
                  var valid0 = true;
                }

                if (valid0) {
                  if (data.enableStreching !== undefined) {
                    var data20 = data.enableStreching;
                    var _errs49 = errors;

                    if (typeof data20 !== "boolean") {
                      validate11.errors = [{
                        instancePath: instancePath + "/enableStreching",
                        schemaPath: "#/properties/enableStreching/type",
                        keyword: "type",
                        params: {
                          type: "boolean"
                        },
                        message: "must be boolean",
                        schema: schema12.properties.enableStreching.type,
                        parentSchema: schema12.properties.enableStreching,
                        data: data20
                      }];
                      return false;
                    }

                    var valid0 = _errs49 === errors;
                  } else {
                    var valid0 = true;
                  }

                  if (valid0) {
                    if (data.cropRatio !== undefined) {
                      var data21 = data.cropRatio;
                      var _errs51 = errors;
                      var _errs52 = errors;
                      var valid9 = false;
                      var _errs53 = errors;

                      if (errors === _errs53) {
                        if (Array.isArray(data21)) {
                          var valid10 = true;
                          var len1 = data21.length;

                          for (var i1 = 0; i1 < len1; i1++) {
                            var data22 = data21[i1];
                            var _errs55 = errors;

                            if (typeof data22 !== "string") {
                              var err4 = {
                                instancePath: instancePath + "/cropRatio/" + i1,
                                schemaPath: "#/properties/cropRatio/anyOf/0/items/type",
                                keyword: "type",
                                params: {
                                  type: "string"
                                },
                                message: "must be string",
                                schema: schema12.properties.cropRatio.anyOf[0].items.type,
                                parentSchema: schema12.properties.cropRatio.anyOf[0].items,
                                data: data22
                              };

                              if (vErrors === null) {
                                vErrors = [err4];
                              } else {
                                vErrors.push(err4);
                              }

                              errors++;
                            }

                            var valid10 = _errs55 === errors;

                            if (!valid10) {
                              break;
                            }
                          }
                        } else {
                          var err5 = {
                            instancePath: instancePath + "/cropRatio",
                            schemaPath: "#/properties/cropRatio/anyOf/0/type",
                            keyword: "type",
                            params: {
                              type: "array"
                            },
                            message: "must be array",
                            schema: schema12.properties.cropRatio.anyOf[0].type,
                            parentSchema: schema12.properties.cropRatio.anyOf[0],
                            data: data21
                          };

                          if (vErrors === null) {
                            vErrors = [err5];
                          } else {
                            vErrors.push(err5);
                          }

                          errors++;
                        }
                      }

                      var _valid1 = _errs53 === errors;

                      valid9 = valid9 || _valid1;

                      if (!valid9) {
                        var _errs57 = errors;

                        if (typeof data21 !== "string" && !(typeof data21 == "number" && isFinite(data21))) {
                          var err6 = {
                            instancePath: instancePath + "/cropRatio",
                            schemaPath: "#/properties/cropRatio/anyOf/1/type",
                            keyword: "type",
                            params: {
                              type: schema12.properties.cropRatio.anyOf[1].type
                            },
                            message: "must be string,number",
                            schema: schema12.properties.cropRatio.anyOf[1].type,
                            parentSchema: schema12.properties.cropRatio.anyOf[1],
                            data: data21
                          };

                          if (vErrors === null) {
                            vErrors = [err6];
                          } else {
                            vErrors.push(err6);
                          }

                          errors++;
                        }

                        var _valid1 = _errs57 === errors;

                        valid9 = valid9 || _valid1;
                      }

                      if (!valid9) {
                        var err7 = {
                          instancePath: instancePath + "/cropRatio",
                          schemaPath: "#/properties/cropRatio/anyOf",
                          keyword: "anyOf",
                          params: {},
                          message: "must match a schema in anyOf",
                          schema: schema12.properties.cropRatio.anyOf,
                          parentSchema: schema12.properties.cropRatio,
                          data: data21
                        };

                        if (vErrors === null) {
                          vErrors = [err7];
                        } else {
                          vErrors.push(err7);
                        }

                        errors++;
                        validate11.errors = vErrors;
                        return false;
                      } else {
                        errors = _errs52;

                        if (vErrors !== null) {
                          if (_errs52) {
                            vErrors.length = _errs52;
                          } else {
                            vErrors = null;
                          }
                        }
                      }

                      var valid0 = _errs51 === errors;
                    } else {
                      var valid0 = true;
                    }

                    if (valid0) {
                      if (data.numberOfColumns !== undefined) {
                        var data23 = data.numberOfColumns;
                        var _errs59 = errors;

                        if (!(typeof data23 == "number" && isFinite(data23))) {
                          validate11.errors = [{
                            instancePath: instancePath + "/numberOfColumns",
                            schemaPath: "#/properties/numberOfColumns/type",
                            keyword: "type",
                            params: {
                              type: "number"
                            },
                            message: "must be number",
                            schema: schema12.properties.numberOfColumns.type,
                            parentSchema: schema12.properties.numberOfColumns,
                            data: data23
                          }];
                          return false;
                        }

                        var valid0 = _errs59 === errors;
                      } else {
                        var valid0 = true;
                      }

                      if (valid0) {
                        if (data.numberOfRows !== undefined) {
                          var data24 = data.numberOfRows;
                          var _errs61 = errors;

                          if (!(typeof data24 == "number" && isFinite(data24))) {
                            validate11.errors = [{
                              instancePath: instancePath + "/numberOfRows",
                              schemaPath: "#/properties/numberOfRows/type",
                              keyword: "type",
                              params: {
                                type: "number"
                              },
                              message: "must be number",
                              schema: schema12.properties.numberOfRows.type,
                              parentSchema: schema12.properties.numberOfRows,
                              data: data24
                            }];
                            return false;
                          }

                          var valid0 = _errs61 === errors;
                        } else {
                          var valid0 = true;
                        }

                        if (valid0) {
                          if (data.cropType !== undefined) {
                            var data25 = data.cropType;
                            var _errs63 = errors;

                            if (typeof data25 !== "string") {
                              validate11.errors = [{
                                instancePath: instancePath + "/cropType",
                                schemaPath: "#/properties/cropType/type",
                                keyword: "type",
                                params: {
                                  type: "string"
                                },
                                message: "must be string",
                                schema: schema12.properties.cropType.type,
                                parentSchema: schema12.properties.cropType,
                                data: data25
                              }];
                              return false;
                            }

                            var valid0 = _errs63 === errors;
                          } else {
                            var valid0 = true;
                          }

                          if (valid0) {
                            if (data.enableCrop !== undefined) {
                              var data26 = data.enableCrop;
                              var _errs65 = errors;

                              if (typeof data26 !== "boolean") {
                                validate11.errors = [{
                                  instancePath: instancePath + "/enableCrop",
                                  schemaPath: "#/properties/enableCrop/type",
                                  keyword: "type",
                                  params: {
                                    type: "boolean"
                                  },
                                  message: "must be boolean",
                                  schema: schema12.properties.enableCrop.type,
                                  parentSchema: schema12.properties.enableCrop,
                                  data: data26
                                }];
                                return false;
                              }

                              var valid0 = _errs65 === errors;
                            } else {
                              var valid0 = true;
                            }

                            if (valid0) {
                              if (data.enableSmartCrop !== undefined) {
                                var data27 = data.enableSmartCrop;
                                var _errs67 = errors;

                                if (typeof data27 !== "boolean") {
                                  validate11.errors = [{
                                    instancePath: instancePath + "/enableSmartCrop",
                                    schemaPath: "#/properties/enableSmartCrop/type",
                                    keyword: "type",
                                    params: {
                                      type: "boolean"
                                    },
                                    message: "must be boolean",
                                    schema: schema12.properties.enableSmartCrop.type,
                                    parentSchema: schema12.properties.enableSmartCrop,
                                    data: data27
                                  }];
                                  return false;
                                }

                                var valid0 = _errs67 === errors;
                              } else {
                                var valid0 = true;
                              }

                              if (valid0) {
                                if (data.minItemSize !== undefined) {
                                  var data28 = data.minItemSize;
                                  var _errs69 = errors;

                                  if (!(typeof data28 == "number" && isFinite(data28))) {
                                    validate11.errors = [{
                                      instancePath: instancePath + "/minItemSize",
                                      schemaPath: "#/properties/minItemSize/type",
                                      keyword: "type",
                                      params: {
                                        type: "number"
                                      },
                                      message: "must be number",
                                      schema: schema12.properties.minItemSize.type,
                                      parentSchema: schema12.properties.minItemSize,
                                      data: data28
                                    }];
                                    return false;
                                  }

                                  var valid0 = _errs69 === errors;
                                } else {
                                  var valid0 = true;
                                }

                                if (valid0) {
                                  if (data.cropOnlyFill !== undefined) {
                                    var data29 = data.cropOnlyFill;
                                    var _errs71 = errors;

                                    if (typeof data29 !== "boolean") {
                                      validate11.errors = [{
                                        instancePath: instancePath + "/cropOnlyFill",
                                        schemaPath: "#/properties/cropOnlyFill/type",
                                        keyword: "type",
                                        params: {
                                          type: "boolean"
                                        },
                                        message: "must be boolean",
                                        schema: schema12.properties.cropOnlyFill.type,
                                        parentSchema: schema12.properties.cropOnlyFill,
                                        data: data29
                                      }];
                                      return false;
                                    }

                                    var valid0 = _errs71 === errors;
                                  } else {
                                    var valid0 = true;
                                  }

                                  if (valid0) {
                                    if (data.forceGroupsOrder !== undefined) {
                                      var data30 = data.forceGroupsOrder;
                                      var _errs73 = errors;

                                      if (typeof data30 !== "string") {
                                        validate11.errors = [{
                                          instancePath: instancePath + "/forceGroupsOrder",
                                          schemaPath: "#/properties/forceGroupsOrder/type",
                                          keyword: "type",
                                          params: {
                                            type: "string"
                                          },
                                          message: "must be string",
                                          schema: schema12.properties.forceGroupsOrder.type,
                                          parentSchema: schema12.properties.forceGroupsOrder,
                                          data: data30
                                        }];
                                        return false;
                                      }

                                      if (!(data30 === "LEFT_TO_RIGHT" || data30 === "RIGHT_TO_LEFT")) {
                                        validate11.errors = [{
                                          instancePath: instancePath + "/forceGroupsOrder",
                                          schemaPath: "#/properties/forceGroupsOrder/enum",
                                          keyword: "enum",
                                          params: {
                                            allowedValues: schema12.properties.forceGroupsOrder["enum"]
                                          },
                                          message: "must be equal to one of the allowed values",
                                          schema: schema12.properties.forceGroupsOrder["enum"],
                                          parentSchema: schema12.properties.forceGroupsOrder,
                                          data: data30
                                        }];
                                        return false;
                                      }

                                      var valid0 = _errs73 === errors;
                                    } else {
                                      var valid0 = true;
                                    }

                                    if (valid0) {
                                      if (data.slideshowInfoSize !== undefined) {
                                        var data31 = data.slideshowInfoSize;
                                        var _errs75 = errors;

                                        if (!(typeof data31 == "number" && isFinite(data31))) {
                                          validate11.errors = [{
                                            instancePath: instancePath + "/slideshowInfoSize",
                                            schemaPath: "#/properties/slideshowInfoSize/type",
                                            keyword: "type",
                                            params: {
                                              type: "number"
                                            },
                                            message: "must be number",
                                            schema: schema12.properties.slideshowInfoSize.type,
                                            parentSchema: schema12.properties.slideshowInfoSize,
                                            data: data31
                                          }];
                                          return false;
                                        }

                                        var valid0 = _errs75 === errors;
                                      } else {
                                        var valid0 = true;
                                      }

                                      if (valid0) {
                                        if (data.scatter !== undefined) {
                                          var data32 = data.scatter;
                                          var _errs77 = errors;

                                          if (!(typeof data32 == "number" && isFinite(data32))) {
                                            validate11.errors = [{
                                              instancePath: instancePath + "/scatter",
                                              schemaPath: "#/properties/scatter/type",
                                              keyword: "type",
                                              params: {
                                                type: "number"
                                              },
                                              message: "must be number",
                                              schema: schema12.properties.scatter.type,
                                              parentSchema: schema12.properties.scatter,
                                              data: data32
                                            }];
                                            return false;
                                          }

                                          var valid0 = _errs77 === errors;
                                        } else {
                                          var valid0 = true;
                                        }

                                        if (valid0) {
                                          if (data.scrollDirection !== undefined) {
                                            var data33 = data.scrollDirection;
                                            var _errs79 = errors;

                                            if (typeof data33 !== "string") {
                                              validate11.errors = [{
                                                instancePath: instancePath + "/scrollDirection",
                                                schemaPath: "#/properties/scrollDirection/type",
                                                keyword: "type",
                                                params: {
                                                  type: "string"
                                                },
                                                message: "must be string",
                                                schema: schema12.properties.scrollDirection.type,
                                                parentSchema: schema12.properties.scrollDirection,
                                                data: data33
                                              }];
                                              return false;
                                            }

                                            if (!(data33 === "HORIZONTAL" || data33 === "VERTICAL")) {
                                              validate11.errors = [{
                                                instancePath: instancePath + "/scrollDirection",
                                                schemaPath: "#/properties/scrollDirection/enum",
                                                keyword: "enum",
                                                params: {
                                                  allowedValues: schema12.properties.scrollDirection["enum"]
                                                },
                                                message: "must be equal to one of the allowed values",
                                                schema: schema12.properties.scrollDirection["enum"],
                                                parentSchema: schema12.properties.scrollDirection,
                                                data: data33
                                              }];
                                              return false;
                                            }

                                            var valid0 = _errs79 === errors;
                                          } else {
                                            var valid0 = true;
                                          }

                                          if (valid0) {
                                            if (data.layoutOrientation !== undefined) {
                                              var data34 = data.layoutOrientation;
                                              var _errs81 = errors;

                                              if (typeof data34 !== "string") {
                                                validate11.errors = [{
                                                  instancePath: instancePath + "/layoutOrientation",
                                                  schemaPath: "#/properties/layoutOrientation/type",
                                                  keyword: "type",
                                                  params: {
                                                    type: "string"
                                                  },
                                                  message: "must be string",
                                                  schema: schema12.properties.layoutOrientation.type,
                                                  parentSchema: schema12.properties.layoutOrientation,
                                                  data: data34
                                                }];
                                                return false;
                                              }

                                              if (!(data34 === "HORIZONTAL" || data34 === "VERTICAL")) {
                                                validate11.errors = [{
                                                  instancePath: instancePath + "/layoutOrientation",
                                                  schemaPath: "#/properties/layoutOrientation/enum",
                                                  keyword: "enum",
                                                  params: {
                                                    allowedValues: schema12.properties.layoutOrientation["enum"]
                                                  },
                                                  message: "must be equal to one of the allowed values",
                                                  schema: schema12.properties.layoutOrientation["enum"],
                                                  parentSchema: schema12.properties.layoutOrientation,
                                                  data: data34
                                                }];
                                                return false;
                                              }

                                              var valid0 = _errs81 === errors;
                                            } else {
                                              var valid0 = true;
                                            }

                                            if (valid0) {
                                              if (data.isSlideshow !== undefined) {
                                                var data35 = data.isSlideshow;
                                                var _errs83 = errors;

                                                if (typeof data35 !== "boolean") {
                                                  validate11.errors = [{
                                                    instancePath: instancePath + "/isSlideshow",
                                                    schemaPath: "#/properties/isSlideshow/type",
                                                    keyword: "type",
                                                    params: {
                                                      type: "boolean"
                                                    },
                                                    message: "must be boolean",
                                                    schema: schema12.properties.isSlideshow.type,
                                                    parentSchema: schema12.properties.isSlideshow,
                                                    data: data35
                                                  }];
                                                  return false;
                                                }

                                                var valid0 = _errs83 === errors;
                                              } else {
                                                var valid0 = true;
                                              }

                                              if (valid0) {
                                                if (data.isGrid !== undefined) {
                                                  var data36 = data.isGrid;
                                                  var _errs85 = errors;

                                                  if (typeof data36 !== "boolean") {
                                                    validate11.errors = [{
                                                      instancePath: instancePath + "/isGrid",
                                                      schemaPath: "#/properties/isGrid/type",
                                                      keyword: "type",
                                                      params: {
                                                        type: "boolean"
                                                      },
                                                      message: "must be boolean",
                                                      schema: schema12.properties.isGrid.type,
                                                      parentSchema: schema12.properties.isGrid,
                                                      data: data36
                                                    }];
                                                    return false;
                                                  }

                                                  var valid0 = _errs85 === errors;
                                                } else {
                                                  var valid0 = true;
                                                }

                                                if (valid0) {
                                                  if (data.isMasonry !== undefined) {
                                                    var data37 = data.isMasonry;
                                                    var _errs87 = errors;

                                                    if (typeof data37 !== "boolean") {
                                                      validate11.errors = [{
                                                        instancePath: instancePath + "/isMasonry",
                                                        schemaPath: "#/properties/isMasonry/type",
                                                        keyword: "type",
                                                        params: {
                                                          type: "boolean"
                                                        },
                                                        message: "must be boolean",
                                                        schema: schema12.properties.isMasonry.type,
                                                        parentSchema: schema12.properties.isMasonry,
                                                        data: data37
                                                      }];
                                                      return false;
                                                    }

                                                    var valid0 = _errs87 === errors;
                                                  } else {
                                                    var valid0 = true;
                                                  }

                                                  if (valid0) {
                                                    if (data.isSlider !== undefined) {
                                                      var data38 = data.isSlider;
                                                      var _errs89 = errors;

                                                      if (typeof data38 !== "boolean") {
                                                        validate11.errors = [{
                                                          instancePath: instancePath + "/isSlider",
                                                          schemaPath: "#/properties/isSlider/type",
                                                          keyword: "type",
                                                          params: {
                                                            type: "boolean"
                                                          },
                                                          message: "must be boolean",
                                                          schema: schema12.properties.isSlider.type,
                                                          parentSchema: schema12.properties.isSlider,
                                                          data: data38
                                                        }];
                                                        return false;
                                                      }

                                                      var valid0 = _errs89 === errors;
                                                    } else {
                                                      var valid0 = true;
                                                    }

                                                    if (valid0) {
                                                      if (data.isColumns !== undefined) {
                                                        var data39 = data.isColumns;
                                                        var _errs91 = errors;

                                                        if (typeof data39 !== "boolean") {
                                                          validate11.errors = [{
                                                            instancePath: instancePath + "/isColumns",
                                                            schemaPath: "#/properties/isColumns/type",
                                                            keyword: "type",
                                                            params: {
                                                              type: "boolean"
                                                            },
                                                            message: "must be boolean",
                                                            schema: schema12.properties.isColumns.type,
                                                            parentSchema: schema12.properties.isColumns,
                                                            data: data39
                                                          }];
                                                          return false;
                                                        }

                                                        var valid0 = _errs91 === errors;
                                                      } else {
                                                        var valid0 = true;
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
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
        schema: schema12.type,
        parentSchema: schema12,
        data: data
      }];
      return false;
    }
  }

  validate11.errors = vErrors;
  return errors === 0;
}

var schema16 = {
  "type": "object",
  "additionalProperties": {},
  "properties": {
    "item": {
      "$ref": "#/definitions/Item"
    }
  }
};
var schema17 = {
  "type": "object",
  "additionalProperties": {},
  "properties": {
    "clickAction": {
      "enum": ["ACTION", "LINK", "MAGNIFY", "NOTHING"],
      "type": "string"
    },
    "video": {
      "$ref": "#/definitions/Video"
    },
    "overlay": {
      "$ref": "#/definitions/Overlay"
    },
    "info": {
      "$ref": "#/definitions/Info"
    }
  },
  "required": ["clickAction", "info", "overlay", "video"]
};
var schema18 = {
  "type": "object",
  "additionalProperties": {},
  "properties": {
    "speed": {
      "type": "number"
    },
    "volume": {
      "type": "number"
    },
    "loop": {
      "type": "boolean"
    },
    "playTrigger": {
      "enum": ["AUTO", "CLICK", "HOVER"],
      "type": "string"
    },
    "enablePlayButton": {
      "type": "boolean"
    },
    "enableControls": {
      "type": "boolean"
    }
  },
  "required": ["enableControls", "enablePlayButton", "loop", "playTrigger", "speed", "volume"]
};
var schema19 = {
  "type": "object",
  "additionalProperties": {},
  "properties": {
    "hoveringBehaviour": {
      "enum": ["ALWAYS_SHOW", "APPEARS", "DISAPPEARS", "NEVER_SHOW"],
      "type": "string"
    },
    "hoverAnimation": {
      "enum": ["BLUR", "COLOR_IN", "DARKENED", "GRAYSCALE", "INVERT", "NO_EFFECT", "SHRINK", "ZOOM_IN"],
      "type": "string"
    },
    "position": {
      "enum": ["BUTTOM", "CENTERED_HORIZONTALLY", "CENTERED_VERTICALLY", "LEFT", "RIGHT", "TOP"],
      "type": "string"
    },
    "size": {
      "type": "number"
    },
    "sizeUnits": {
      "enum": ["PERCENT", "PIXEL"],
      "type": "string"
    },
    "padding": {
      "type": "number"
    }
  },
  "required": ["hoverAnimation", "hoveringBehaviour", "padding", "position", "size", "sizeUnits"]
};
var schema20 = {
  "type": "object",
  "additionalProperties": {},
  "properties": {
    "placement": {
      "enum": ["ABOVE", "ALTERNATE_HORIZONTALY", "ALTERNATE_VERTICALY", "BELOW", "LEFT", "RIGHT"],
      "type": "string"
    }
  },
  "required": ["placement"]
};

function validate14(data, valCxt) {
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

      if (data.clickAction === undefined && (missing0 = "clickAction") || data.info === undefined && (missing0 = "info") || data.overlay === undefined && (missing0 = "overlay") || data.video === undefined && (missing0 = "video")) {
        validate14.errors = [{
          instancePath: instancePath,
          schemaPath: "#/required",
          keyword: "required",
          params: {
            missingProperty: missing0
          },
          message: "must have required property '" + missing0 + "'",
          schema: schema17.required,
          parentSchema: schema17,
          data: data
        }];
        return false;
      } else {
        if (data.clickAction !== undefined) {
          var data0 = data.clickAction;
          var _errs2 = errors;

          if (typeof data0 !== "string") {
            validate14.errors = [{
              instancePath: instancePath + "/clickAction",
              schemaPath: "#/properties/clickAction/type",
              keyword: "type",
              params: {
                type: "string"
              },
              message: "must be string",
              schema: schema17.properties.clickAction.type,
              parentSchema: schema17.properties.clickAction,
              data: data0
            }];
            return false;
          }

          if (!(data0 === "ACTION" || data0 === "LINK" || data0 === "MAGNIFY" || data0 === "NOTHING")) {
            validate14.errors = [{
              instancePath: instancePath + "/clickAction",
              schemaPath: "#/properties/clickAction/enum",
              keyword: "enum",
              params: {
                allowedValues: schema17.properties.clickAction["enum"]
              },
              message: "must be equal to one of the allowed values",
              schema: schema17.properties.clickAction["enum"],
              parentSchema: schema17.properties.clickAction,
              data: data0
            }];
            return false;
          }

          var valid0 = _errs2 === errors;
        } else {
          var valid0 = true;
        }

        if (valid0) {
          if (data.video !== undefined) {
            var data1 = data.video;
            var _errs4 = errors;
            var _errs5 = errors;

            if (errors === _errs5) {
              if (data1 && _typeof(data1) == "object" && !Array.isArray(data1)) {
                var missing1;

                if (data1.enableControls === undefined && (missing1 = "enableControls") || data1.enablePlayButton === undefined && (missing1 = "enablePlayButton") || data1.loop === undefined && (missing1 = "loop") || data1.playTrigger === undefined && (missing1 = "playTrigger") || data1.speed === undefined && (missing1 = "speed") || data1.volume === undefined && (missing1 = "volume")) {
                  validate14.errors = [{
                    instancePath: instancePath + "/video",
                    schemaPath: "#/definitions/Video/required",
                    keyword: "required",
                    params: {
                      missingProperty: missing1
                    },
                    message: "must have required property '" + missing1 + "'",
                    schema: schema18.required,
                    parentSchema: schema18,
                    data: data1
                  }];
                  return false;
                } else {
                  if (data1.speed !== undefined) {
                    var data2 = data1.speed;
                    var _errs8 = errors;

                    if (!(typeof data2 == "number" && isFinite(data2))) {
                      validate14.errors = [{
                        instancePath: instancePath + "/video/speed",
                        schemaPath: "#/definitions/Video/properties/speed/type",
                        keyword: "type",
                        params: {
                          type: "number"
                        },
                        message: "must be number",
                        schema: schema18.properties.speed.type,
                        parentSchema: schema18.properties.speed,
                        data: data2
                      }];
                      return false;
                    }

                    var valid2 = _errs8 === errors;
                  } else {
                    var valid2 = true;
                  }

                  if (valid2) {
                    if (data1.volume !== undefined) {
                      var data3 = data1.volume;
                      var _errs10 = errors;

                      if (!(typeof data3 == "number" && isFinite(data3))) {
                        validate14.errors = [{
                          instancePath: instancePath + "/video/volume",
                          schemaPath: "#/definitions/Video/properties/volume/type",
                          keyword: "type",
                          params: {
                            type: "number"
                          },
                          message: "must be number",
                          schema: schema18.properties.volume.type,
                          parentSchema: schema18.properties.volume,
                          data: data3
                        }];
                        return false;
                      }

                      var valid2 = _errs10 === errors;
                    } else {
                      var valid2 = true;
                    }

                    if (valid2) {
                      if (data1.loop !== undefined) {
                        var data4 = data1.loop;
                        var _errs12 = errors;

                        if (typeof data4 !== "boolean") {
                          validate14.errors = [{
                            instancePath: instancePath + "/video/loop",
                            schemaPath: "#/definitions/Video/properties/loop/type",
                            keyword: "type",
                            params: {
                              type: "boolean"
                            },
                            message: "must be boolean",
                            schema: schema18.properties.loop.type,
                            parentSchema: schema18.properties.loop,
                            data: data4
                          }];
                          return false;
                        }

                        var valid2 = _errs12 === errors;
                      } else {
                        var valid2 = true;
                      }

                      if (valid2) {
                        if (data1.playTrigger !== undefined) {
                          var data5 = data1.playTrigger;
                          var _errs14 = errors;

                          if (typeof data5 !== "string") {
                            validate14.errors = [{
                              instancePath: instancePath + "/video/playTrigger",
                              schemaPath: "#/definitions/Video/properties/playTrigger/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string",
                              schema: schema18.properties.playTrigger.type,
                              parentSchema: schema18.properties.playTrigger,
                              data: data5
                            }];
                            return false;
                          }

                          if (!(data5 === "AUTO" || data5 === "CLICK" || data5 === "HOVER")) {
                            validate14.errors = [{
                              instancePath: instancePath + "/video/playTrigger",
                              schemaPath: "#/definitions/Video/properties/playTrigger/enum",
                              keyword: "enum",
                              params: {
                                allowedValues: schema18.properties.playTrigger["enum"]
                              },
                              message: "must be equal to one of the allowed values",
                              schema: schema18.properties.playTrigger["enum"],
                              parentSchema: schema18.properties.playTrigger,
                              data: data5
                            }];
                            return false;
                          }

                          var valid2 = _errs14 === errors;
                        } else {
                          var valid2 = true;
                        }

                        if (valid2) {
                          if (data1.enablePlayButton !== undefined) {
                            var data6 = data1.enablePlayButton;
                            var _errs16 = errors;

                            if (typeof data6 !== "boolean") {
                              validate14.errors = [{
                                instancePath: instancePath + "/video/enablePlayButton",
                                schemaPath: "#/definitions/Video/properties/enablePlayButton/type",
                                keyword: "type",
                                params: {
                                  type: "boolean"
                                },
                                message: "must be boolean",
                                schema: schema18.properties.enablePlayButton.type,
                                parentSchema: schema18.properties.enablePlayButton,
                                data: data6
                              }];
                              return false;
                            }

                            var valid2 = _errs16 === errors;
                          } else {
                            var valid2 = true;
                          }

                          if (valid2) {
                            if (data1.enableControls !== undefined) {
                              var data7 = data1.enableControls;
                              var _errs18 = errors;

                              if (typeof data7 !== "boolean") {
                                validate14.errors = [{
                                  instancePath: instancePath + "/video/enableControls",
                                  schemaPath: "#/definitions/Video/properties/enableControls/type",
                                  keyword: "type",
                                  params: {
                                    type: "boolean"
                                  },
                                  message: "must be boolean",
                                  schema: schema18.properties.enableControls.type,
                                  parentSchema: schema18.properties.enableControls,
                                  data: data7
                                }];
                                return false;
                              }

                              var valid2 = _errs18 === errors;
                            } else {
                              var valid2 = true;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              } else {
                validate14.errors = [{
                  instancePath: instancePath + "/video",
                  schemaPath: "#/definitions/Video/type",
                  keyword: "type",
                  params: {
                    type: "object"
                  },
                  message: "must be object",
                  schema: schema18.type,
                  parentSchema: schema18,
                  data: data1
                }];
                return false;
              }
            }

            var valid0 = _errs4 === errors;
          } else {
            var valid0 = true;
          }

          if (valid0) {
            if (data.overlay !== undefined) {
              var data8 = data.overlay;
              var _errs20 = errors;
              var _errs21 = errors;

              if (errors === _errs21) {
                if (data8 && _typeof(data8) == "object" && !Array.isArray(data8)) {
                  var missing2;

                  if (data8.hoverAnimation === undefined && (missing2 = "hoverAnimation") || data8.hoveringBehaviour === undefined && (missing2 = "hoveringBehaviour") || data8.padding === undefined && (missing2 = "padding") || data8.position === undefined && (missing2 = "position") || data8.size === undefined && (missing2 = "size") || data8.sizeUnits === undefined && (missing2 = "sizeUnits")) {
                    validate14.errors = [{
                      instancePath: instancePath + "/overlay",
                      schemaPath: "#/definitions/Overlay/required",
                      keyword: "required",
                      params: {
                        missingProperty: missing2
                      },
                      message: "must have required property '" + missing2 + "'",
                      schema: schema19.required,
                      parentSchema: schema19,
                      data: data8
                    }];
                    return false;
                  } else {
                    if (data8.hoveringBehaviour !== undefined) {
                      var data9 = data8.hoveringBehaviour;
                      var _errs24 = errors;

                      if (typeof data9 !== "string") {
                        validate14.errors = [{
                          instancePath: instancePath + "/overlay/hoveringBehaviour",
                          schemaPath: "#/definitions/Overlay/properties/hoveringBehaviour/type",
                          keyword: "type",
                          params: {
                            type: "string"
                          },
                          message: "must be string",
                          schema: schema19.properties.hoveringBehaviour.type,
                          parentSchema: schema19.properties.hoveringBehaviour,
                          data: data9
                        }];
                        return false;
                      }

                      if (!(data9 === "ALWAYS_SHOW" || data9 === "APPEARS" || data9 === "DISAPPEARS" || data9 === "NEVER_SHOW")) {
                        validate14.errors = [{
                          instancePath: instancePath + "/overlay/hoveringBehaviour",
                          schemaPath: "#/definitions/Overlay/properties/hoveringBehaviour/enum",
                          keyword: "enum",
                          params: {
                            allowedValues: schema19.properties.hoveringBehaviour["enum"]
                          },
                          message: "must be equal to one of the allowed values",
                          schema: schema19.properties.hoveringBehaviour["enum"],
                          parentSchema: schema19.properties.hoveringBehaviour,
                          data: data9
                        }];
                        return false;
                      }

                      var valid4 = _errs24 === errors;
                    } else {
                      var valid4 = true;
                    }

                    if (valid4) {
                      if (data8.hoverAnimation !== undefined) {
                        var data10 = data8.hoverAnimation;
                        var _errs26 = errors;

                        if (typeof data10 !== "string") {
                          validate14.errors = [{
                            instancePath: instancePath + "/overlay/hoverAnimation",
                            schemaPath: "#/definitions/Overlay/properties/hoverAnimation/type",
                            keyword: "type",
                            params: {
                              type: "string"
                            },
                            message: "must be string",
                            schema: schema19.properties.hoverAnimation.type,
                            parentSchema: schema19.properties.hoverAnimation,
                            data: data10
                          }];
                          return false;
                        }

                        if (!(data10 === "BLUR" || data10 === "COLOR_IN" || data10 === "DARKENED" || data10 === "GRAYSCALE" || data10 === "INVERT" || data10 === "NO_EFFECT" || data10 === "SHRINK" || data10 === "ZOOM_IN")) {
                          validate14.errors = [{
                            instancePath: instancePath + "/overlay/hoverAnimation",
                            schemaPath: "#/definitions/Overlay/properties/hoverAnimation/enum",
                            keyword: "enum",
                            params: {
                              allowedValues: schema19.properties.hoverAnimation["enum"]
                            },
                            message: "must be equal to one of the allowed values",
                            schema: schema19.properties.hoverAnimation["enum"],
                            parentSchema: schema19.properties.hoverAnimation,
                            data: data10
                          }];
                          return false;
                        }

                        var valid4 = _errs26 === errors;
                      } else {
                        var valid4 = true;
                      }

                      if (valid4) {
                        if (data8.position !== undefined) {
                          var data11 = data8.position;
                          var _errs28 = errors;

                          if (typeof data11 !== "string") {
                            validate14.errors = [{
                              instancePath: instancePath + "/overlay/position",
                              schemaPath: "#/definitions/Overlay/properties/position/type",
                              keyword: "type",
                              params: {
                                type: "string"
                              },
                              message: "must be string",
                              schema: schema19.properties.position.type,
                              parentSchema: schema19.properties.position,
                              data: data11
                            }];
                            return false;
                          }

                          if (!(data11 === "BUTTOM" || data11 === "CENTERED_HORIZONTALLY" || data11 === "CENTERED_VERTICALLY" || data11 === "LEFT" || data11 === "RIGHT" || data11 === "TOP")) {
                            validate14.errors = [{
                              instancePath: instancePath + "/overlay/position",
                              schemaPath: "#/definitions/Overlay/properties/position/enum",
                              keyword: "enum",
                              params: {
                                allowedValues: schema19.properties.position["enum"]
                              },
                              message: "must be equal to one of the allowed values",
                              schema: schema19.properties.position["enum"],
                              parentSchema: schema19.properties.position,
                              data: data11
                            }];
                            return false;
                          }

                          var valid4 = _errs28 === errors;
                        } else {
                          var valid4 = true;
                        }

                        if (valid4) {
                          if (data8.size !== undefined) {
                            var data12 = data8.size;
                            var _errs30 = errors;

                            if (!(typeof data12 == "number" && isFinite(data12))) {
                              validate14.errors = [{
                                instancePath: instancePath + "/overlay/size",
                                schemaPath: "#/definitions/Overlay/properties/size/type",
                                keyword: "type",
                                params: {
                                  type: "number"
                                },
                                message: "must be number",
                                schema: schema19.properties.size.type,
                                parentSchema: schema19.properties.size,
                                data: data12
                              }];
                              return false;
                            }

                            var valid4 = _errs30 === errors;
                          } else {
                            var valid4 = true;
                          }

                          if (valid4) {
                            if (data8.sizeUnits !== undefined) {
                              var data13 = data8.sizeUnits;
                              var _errs32 = errors;

                              if (typeof data13 !== "string") {
                                validate14.errors = [{
                                  instancePath: instancePath + "/overlay/sizeUnits",
                                  schemaPath: "#/definitions/Overlay/properties/sizeUnits/type",
                                  keyword: "type",
                                  params: {
                                    type: "string"
                                  },
                                  message: "must be string",
                                  schema: schema19.properties.sizeUnits.type,
                                  parentSchema: schema19.properties.sizeUnits,
                                  data: data13
                                }];
                                return false;
                              }

                              if (!(data13 === "PERCENT" || data13 === "PIXEL")) {
                                validate14.errors = [{
                                  instancePath: instancePath + "/overlay/sizeUnits",
                                  schemaPath: "#/definitions/Overlay/properties/sizeUnits/enum",
                                  keyword: "enum",
                                  params: {
                                    allowedValues: schema19.properties.sizeUnits["enum"]
                                  },
                                  message: "must be equal to one of the allowed values",
                                  schema: schema19.properties.sizeUnits["enum"],
                                  parentSchema: schema19.properties.sizeUnits,
                                  data: data13
                                }];
                                return false;
                              }

                              var valid4 = _errs32 === errors;
                            } else {
                              var valid4 = true;
                            }

                            if (valid4) {
                              if (data8.padding !== undefined) {
                                var data14 = data8.padding;
                                var _errs34 = errors;

                                if (!(typeof data14 == "number" && isFinite(data14))) {
                                  validate14.errors = [{
                                    instancePath: instancePath + "/overlay/padding",
                                    schemaPath: "#/definitions/Overlay/properties/padding/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number",
                                    schema: schema19.properties.padding.type,
                                    parentSchema: schema19.properties.padding,
                                    data: data14
                                  }];
                                  return false;
                                }

                                var valid4 = _errs34 === errors;
                              } else {
                                var valid4 = true;
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                } else {
                  validate14.errors = [{
                    instancePath: instancePath + "/overlay",
                    schemaPath: "#/definitions/Overlay/type",
                    keyword: "type",
                    params: {
                      type: "object"
                    },
                    message: "must be object",
                    schema: schema19.type,
                    parentSchema: schema19,
                    data: data8
                  }];
                  return false;
                }
              }

              var valid0 = _errs20 === errors;
            } else {
              var valid0 = true;
            }

            if (valid0) {
              if (data.info !== undefined) {
                var data15 = data.info;
                var _errs36 = errors;
                var _errs37 = errors;

                if (errors === _errs37) {
                  if (data15 && _typeof(data15) == "object" && !Array.isArray(data15)) {
                    var missing3;

                    if (data15.placement === undefined && (missing3 = "placement")) {
                      validate14.errors = [{
                        instancePath: instancePath + "/info",
                        schemaPath: "#/definitions/Info/required",
                        keyword: "required",
                        params: {
                          missingProperty: missing3
                        },
                        message: "must have required property '" + missing3 + "'",
                        schema: schema20.required,
                        parentSchema: schema20,
                        data: data15
                      }];
                      return false;
                    } else {
                      if (data15.placement !== undefined) {
                        var data16 = data15.placement;

                        if (typeof data16 !== "string") {
                          validate14.errors = [{
                            instancePath: instancePath + "/info/placement",
                            schemaPath: "#/definitions/Info/properties/placement/type",
                            keyword: "type",
                            params: {
                              type: "string"
                            },
                            message: "must be string",
                            schema: schema20.properties.placement.type,
                            parentSchema: schema20.properties.placement,
                            data: data16
                          }];
                          return false;
                        }

                        if (!(data16 === "ABOVE" || data16 === "ALTERNATE_HORIZONTALY" || data16 === "ALTERNATE_VERTICALY" || data16 === "BELOW" || data16 === "LEFT" || data16 === "RIGHT")) {
                          validate14.errors = [{
                            instancePath: instancePath + "/info/placement",
                            schemaPath: "#/definitions/Info/properties/placement/enum",
                            keyword: "enum",
                            params: {
                              allowedValues: schema20.properties.placement["enum"]
                            },
                            message: "must be equal to one of the allowed values",
                            schema: schema20.properties.placement["enum"],
                            parentSchema: schema20.properties.placement,
                            data: data16
                          }];
                          return false;
                        }
                      }
                    }
                  } else {
                    validate14.errors = [{
                      instancePath: instancePath + "/info",
                      schemaPath: "#/definitions/Info/type",
                      keyword: "type",
                      params: {
                        type: "object"
                      },
                      message: "must be object",
                      schema: schema20.type,
                      parentSchema: schema20,
                      data: data15
                    }];
                    return false;
                  }
                }

                var valid0 = _errs36 === errors;
              } else {
                var valid0 = true;
              }
            }
          }
        }
      }
    } else {
      validate14.errors = [{
        instancePath: instancePath,
        schemaPath: "#/type",
        keyword: "type",
        params: {
          type: "object"
        },
        message: "must be object",
        schema: schema17.type,
        parentSchema: schema17,
        data: data
      }];
      return false;
    }
  }

  validate14.errors = vErrors;
  return errors === 0;
}

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
      if (data.item !== undefined) {
        if (!validate14(data.item, {
          instancePath: instancePath + "/item",
          parentData: data,
          parentDataProperty: "item",
          rootData: rootData
        })) {
          vErrors = vErrors === null ? validate14.errors : vErrors.concat(validate14.errors);
          errors = vErrors.length;
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
        schema: schema16.type,
        parentSchema: schema16,
        data: data
      }];
      return false;
    }
  }

  validate13.errors = vErrors;
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
          var _errs2 = errors;

          if (!validate11(data.layoutParams, {
            instancePath: instancePath + "/layoutParams",
            parentData: data,
            parentDataProperty: "layoutParams",
            rootData: rootData
          })) {
            vErrors = vErrors === null ? validate11.errors : vErrors.concat(validate11.errors);
            errors = vErrors.length;
          }

          var valid0 = _errs2 === errors;
        } else {
          var valid0 = true;
        }

        if (valid0) {
          if (data.behavourParams !== undefined) {
            var _errs3 = errors;

            if (!validate13(data.behavourParams, {
              instancePath: instancePath + "/behavourParams",
              parentData: data,
              parentDataProperty: "behavourParams",
              rootData: rootData
            })) {
              vErrors = vErrors === null ? validate13.errors : vErrors.concat(validate13.errors);
              errors = vErrors.length;
            }

            var valid0 = _errs3 === errors;
          } else {
            var valid0 = true;
          }

          if (valid0) {
            if (data.stylingParams !== undefined) {
              var data2 = data.stylingParams;
              var _errs4 = errors;
              var _errs5 = errors;

              if (errors === _errs5) {
                if (data2 && _typeof(data2) == "object" && !Array.isArray(data2)) {
                  var missing1;

                  if (data2.arrowsColor === undefined && (missing1 = "arrowsColor") || data2.itemEnableShadow === undefined && (missing1 = "itemEnableShadow") || data2.itemShadowBlur === undefined && (missing1 = "itemShadowBlur") || data2.itemShadowDirection === undefined && (missing1 = "itemShadowDirection") || data2.itemShadowOpacityAndColor === undefined && (missing1 = "itemShadowOpacityAndColor") || data2.itemShadowSize === undefined && (missing1 = "itemShadowSize") || data2.textBoxBorderColor === undefined && (missing1 = "textBoxBorderColor") || data2.textBoxBorderRadius === undefined && (missing1 = "textBoxBorderRadius")) {
                    validate10.errors = [{
                      instancePath: instancePath + "/stylingParams",
                      schemaPath: "#/definitions/StylingParams/required",
                      keyword: "required",
                      params: {
                        missingProperty: missing1
                      },
                      message: "must have required property '" + missing1 + "'",
                      schema: schema21.required,
                      parentSchema: schema21,
                      data: data2
                    }];
                    return false;
                  } else {
                    if (data2.arrowsColor !== undefined) {
                      var data3 = data2.arrowsColor;
                      var _errs8 = errors;

                      if (typeof data3 !== "string") {
                        validate10.errors = [{
                          instancePath: instancePath + "/stylingParams/arrowsColor",
                          schemaPath: "#/definitions/StylingParams/properties/arrowsColor/type",
                          keyword: "type",
                          params: {
                            type: "string"
                          },
                          message: "must be string",
                          schema: schema21.properties.arrowsColor.type,
                          parentSchema: schema21.properties.arrowsColor,
                          data: data3
                        }];
                        return false;
                      }

                      var valid2 = _errs8 === errors;
                    } else {
                      var valid2 = true;
                    }

                    if (valid2) {
                      if (data2.itemShadowBlur !== undefined) {
                        var data4 = data2.itemShadowBlur;
                        var _errs10 = errors;

                        if (!(typeof data4 == "number" && isFinite(data4))) {
                          validate10.errors = [{
                            instancePath: instancePath + "/stylingParams/itemShadowBlur",
                            schemaPath: "#/definitions/StylingParams/properties/itemShadowBlur/type",
                            keyword: "type",
                            params: {
                              type: "number"
                            },
                            message: "must be number",
                            schema: schema21.properties.itemShadowBlur.type,
                            parentSchema: schema21.properties.itemShadowBlur,
                            data: data4
                          }];
                          return false;
                        }

                        var valid2 = _errs10 === errors;
                      } else {
                        var valid2 = true;
                      }

                      if (valid2) {
                        if (data2.itemShadowDirection !== undefined) {
                          var data5 = data2.itemShadowDirection;
                          var _errs12 = errors;

                          if (!(typeof data5 == "number" && isFinite(data5))) {
                            validate10.errors = [{
                              instancePath: instancePath + "/stylingParams/itemShadowDirection",
                              schemaPath: "#/definitions/StylingParams/properties/itemShadowDirection/type",
                              keyword: "type",
                              params: {
                                type: "number"
                              },
                              message: "must be number",
                              schema: schema21.properties.itemShadowDirection.type,
                              parentSchema: schema21.properties.itemShadowDirection,
                              data: data5
                            }];
                            return false;
                          }

                          var valid2 = _errs12 === errors;
                        } else {
                          var valid2 = true;
                        }

                        if (valid2) {
                          if (data2.itemShadowOpacityAndColor !== undefined) {
                            var data6 = data2.itemShadowOpacityAndColor;
                            var _errs14 = errors;

                            if (typeof data6 !== "string") {
                              validate10.errors = [{
                                instancePath: instancePath + "/stylingParams/itemShadowOpacityAndColor",
                                schemaPath: "#/definitions/StylingParams/properties/itemShadowOpacityAndColor/type",
                                keyword: "type",
                                params: {
                                  type: "string"
                                },
                                message: "must be string",
                                schema: schema21.properties.itemShadowOpacityAndColor.type,
                                parentSchema: schema21.properties.itemShadowOpacityAndColor,
                                data: data6
                              }];
                              return false;
                            }

                            var valid2 = _errs14 === errors;
                          } else {
                            var valid2 = true;
                          }

                          if (valid2) {
                            if (data2.textBoxBorderColor !== undefined) {
                              var data7 = data2.textBoxBorderColor;
                              var _errs16 = errors;

                              if (typeof data7 !== "string") {
                                validate10.errors = [{
                                  instancePath: instancePath + "/stylingParams/textBoxBorderColor",
                                  schemaPath: "#/definitions/StylingParams/properties/textBoxBorderColor/type",
                                  keyword: "type",
                                  params: {
                                    type: "string"
                                  },
                                  message: "must be string",
                                  schema: schema21.properties.textBoxBorderColor.type,
                                  parentSchema: schema21.properties.textBoxBorderColor,
                                  data: data7
                                }];
                                return false;
                              }

                              var valid2 = _errs16 === errors;
                            } else {
                              var valid2 = true;
                            }

                            if (valid2) {
                              if (data2.textBoxBorderRadius !== undefined) {
                                var data8 = data2.textBoxBorderRadius;
                                var _errs18 = errors;

                                if (!(typeof data8 == "number" && isFinite(data8))) {
                                  validate10.errors = [{
                                    instancePath: instancePath + "/stylingParams/textBoxBorderRadius",
                                    schemaPath: "#/definitions/StylingParams/properties/textBoxBorderRadius/type",
                                    keyword: "type",
                                    params: {
                                      type: "number"
                                    },
                                    message: "must be number",
                                    schema: schema21.properties.textBoxBorderRadius.type,
                                    parentSchema: schema21.properties.textBoxBorderRadius,
                                    data: data8
                                  }];
                                  return false;
                                }

                                var valid2 = _errs18 === errors;
                              } else {
                                var valid2 = true;
                              }

                              if (valid2) {
                                if (data2.itemShadowSize !== undefined) {
                                  var data9 = data2.itemShadowSize;
                                  var _errs20 = errors;

                                  if (!(typeof data9 == "number" && isFinite(data9))) {
                                    validate10.errors = [{
                                      instancePath: instancePath + "/stylingParams/itemShadowSize",
                                      schemaPath: "#/definitions/StylingParams/properties/itemShadowSize/type",
                                      keyword: "type",
                                      params: {
                                        type: "number"
                                      },
                                      message: "must be number",
                                      schema: schema21.properties.itemShadowSize.type,
                                      parentSchema: schema21.properties.itemShadowSize,
                                      data: data9
                                    }];
                                    return false;
                                  }

                                  var valid2 = _errs20 === errors;
                                } else {
                                  var valid2 = true;
                                }

                                if (valid2) {
                                  if (data2.itemEnableShadow !== undefined) {
                                    var data10 = data2.itemEnableShadow;
                                    var _errs22 = errors;

                                    if (typeof data10 !== "boolean") {
                                      validate10.errors = [{
                                        instancePath: instancePath + "/stylingParams/itemEnableShadow",
                                        schemaPath: "#/definitions/StylingParams/properties/itemEnableShadow/type",
                                        keyword: "type",
                                        params: {
                                          type: "boolean"
                                        },
                                        message: "must be boolean",
                                        schema: schema21.properties.itemEnableShadow.type,
                                        parentSchema: schema21.properties.itemEnableShadow,
                                        data: data10
                                      }];
                                      return false;
                                    }

                                    var valid2 = _errs22 === errors;
                                  } else {
                                    var valid2 = true;
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                } else {
                  validate10.errors = [{
                    instancePath: instancePath + "/stylingParams",
                    schemaPath: "#/definitions/StylingParams/type",
                    keyword: "type",
                    params: {
                      type: "object"
                    },
                    message: "must be object",
                    schema: schema21.type,
                    parentSchema: schema21,
                    data: data2
                  }];
                  return false;
                }
              }

              var valid0 = _errs4 === errors;
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
