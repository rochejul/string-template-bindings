/**
 *
 * @param {String} string
 * @param {Object} mapping
 * @returns
 */
export function interpolate(string, mapping) {
  const names = Object.keys(mapping);
  const vals = Object.values(mapping);

  return new Function(...names, `return \`${string}\`;`)(...vals);
}
