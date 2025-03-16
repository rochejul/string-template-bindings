import { describe, test, expect } from '@jest/globals';
import { bindings } from '../src/index.js';

describe('bindings', () => {
  test('it should be a function', () => {
    // Assert
    expect(bindings).toEqual(expect.any(Function));
  });

  test('it should return the raw string', () => {
    // Arrange
    const expected = 'this is a string';

    // Act
    const actual = bindings(`this is a string`);

    // Assert
    expect(actual.toString()).toEqual(expected);
  });

  test('it should return the binded expression', () => {
    // Arrange
    const expected = 'this is a string with expr: foo';

    // Act
    const actual = bindings(`this is a string with expr: #{expr}`, {
      expr: 'foo',
    });

    // Assert
    expect(actual.toString()).toEqual(expected);
  });

  test('it should update the returned string', () => {
    // Arrange
    const expected = 'this is a string with expr: not foo';
    const mapping = {
      expr: 'foo',
    };

    // Act
    const actual = bindings(`this is a string with expr: #{expr}`, mapping);
    mapping.expr = 'not foo';

    // Assert
    expect(actual.toString()).toEqual(expected);
  });
});
