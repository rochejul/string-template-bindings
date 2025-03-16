import { BindindString } from './binding-string.js';

export function bindings(strings, mapping = {}) {
  /** @type String */
  const template = (Array.isArray(strings) ? strings.join('') : strings) ?? '';

  /** @type String */
  const convertedTemplate = template.replace('#{', '${');

  return new BindindString(convertedTemplate, mapping);
}
