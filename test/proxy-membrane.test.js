import { describe, test, expect } from '@jest/globals';
import { proxyMembrane } from '../src/proxy-membrane.js';

describe('Proxy Membrane', () => {
  test('Detect a first level property has changed', () => {
    // Assert
    let changed = false;
    const monster = { eyeCount: 4 };

    const handler = (paths) => {
      if (paths[0] === 'eyeCount') {
        changed = true;
      }
    };

    const proxy = proxyMembrane(monster, handler);

    // Act
    proxy.eyeCount = 1;

    // Assert
    expect(changed).toBeTruthy();
  });

  test('Detect a second level property has not changed', () => {
    // Assert
    let changed = false;
    const monster = { sub: { eyeCount: 4 } };

    const handler = (paths) => {
      if (paths[1] === 'eyeCount') {
        changed = true;
      }
    };

    const proxy = proxyMembrane(monster, handler);

    // Act
    proxy.sub.eyeCount = 1;

    // Assert
    expect(changed).toBeTruthy();
  });

  test('Detect an array has changed (add item)', () => {
    // Assert
    let changed = false;
    const monster = { arr: [1, 2, 3] };

    const handler = (paths) => {
      if (paths[0] === 'arr') {
        changed = true;
      }
    };

    const proxy = proxyMembrane(monster, handler);

    // Act
    proxy.arr[2] = 5;

    // Assert
    expect(changed).toBeTruthy();
  });
});
