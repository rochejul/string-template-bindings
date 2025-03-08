function interpolate(string, mapping) {
  const names = Object.keys(mapping);
  const vals = Object.values(mapping);

  return new Function(...names, `return \`${string}\`;`)(...vals);
}

export function bindings(strings, mapping = {}) {
  const template = (Array.isArray(strings) ? strings.join('') : strings) ?? '';
  const convertedTemplate = template.replace('#{', '${');

  return interpolate(convertedTemplate, mapping);
}
