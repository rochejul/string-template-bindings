import { describe, test, expect } from '@jest/globals';

describe('Proxy', () => {
  test('Detect a first level property has changed', () => {
    // Assert
    let changed = false;
    const monster = { eyeCount: 4 };

    const handler = {
      set(_obj, prop /*, value*/) {
        if (prop === 'eyeCount') {
          changed = true;
        }

        return Reflect.set(...arguments);
      },
    };

    const proxy = new Proxy(monster, handler);

    // Act
    proxy.eyeCount = 1;

    // Assert
    expect(changed).toBeTruthy();
  });

  test('Detect a second level property has not changed', () => {
    // Assert
    let changed = false;
    const monster = { sub: { eyeCount: 4 } };

    const handler = {
      set(_obj, prop /*, value*/) {
        if (prop === 'eyeCount') {
          changed = true;
        }

        return Reflect.set(...arguments);
      },
    };

    const proxy = new Proxy(monster, handler);

    // Act
    proxy.sub.eyeCount = 1;

    // Assert
    expect(changed).toBeFalsy();
  });

  test('Detect an array has changed (add item)', () => {
    // Assert
    let changed = false;
    const monster = { arr: [1, 2, 3] };

    const handler = {
      set(_obj, prop /*, value*/) {
        if (prop === 'arr') {
          changed = true;
        }

        return Reflect.set(...arguments);
      },
    };

    const proxy = new Proxy(monster, handler);

    // Act
    proxy.arr.push(4);

    // Assert
    expect(changed).toBeFalsy();
  });
});
