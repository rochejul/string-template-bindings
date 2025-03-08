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
    const actual = bindings`this is a string`;

    // Assert
    expect(actual).toEqual(expected);
  });
});
