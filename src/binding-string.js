import { interpolate } from './utils.js';

const templateSymbol = Symbol('template');
const mappingSymbol = Symbol('mapping');

/**
 *
 * @param {String} template
 * @param {Object} mapping
 */
export function BindindString(template, mapping) {
  String.call(this, interpolate(template, mapping));

  this[templateSymbol] = template;
  this[mappingSymbol] = mapping;
}

Object.setPrototypeOf(BindindString.prototype, String.prototype);

BindindString.prototype.toJSON = function () {
  return interpolate(this[templateSymbol], this[mappingSymbol]);
};

BindindString.prototype.toString = function () {
  return interpolate(this[templateSymbol], this[mappingSymbol]);
};
