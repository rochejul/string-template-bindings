const REVOKE = Symbol();

function isArray(obj) {
  return Array.isArray(obj);
}

function isObject(obj) {
  return typeof obj === 'object';
}

function proxifyIfRequired(property, value, handler, paths) {
  const newPaths = [...paths, property];

  if (isArray(value)) {
    return new ArrayProxyMembrane(value, handler, newPaths);
  }

  if (isObject(value)) {
    return new ObjectProxyMembrane(value, handler, newPaths);
  }

  return value;
}

class ProxyMembrane {
  #revokableProxy;
  #handler;
  #paths;

  static revoke(membrane) {
    membrane?.[REVOKE]?.();
  }

  constructor(root, handler, paths = []) {
    this.#paths = Object.freeze(paths);
    this.#handler = handler;
    this.#revokableProxy = Proxy.revocable(root, this.handlerDefinition());
  }

  handlerDefinition() {
    return {};
  }

  notifyChange(paths, oldValue, newValue) {
    this.#handler?.(paths, oldValue, newValue);
  }

  get handler() {
    return this.#handler;
  }

  get paths() {
    return this.#paths;
  }

  get proxy() {
    return this.#revokableProxy.proxy;
  }

  [REVOKE]() {
    this.#revokableProxy.revoke();
    this.#revokableProxy = undefined;
    this.#handler = undefined;
    this.#paths = undefined;
  }

  toString() {
    return JSON.parse(JSON.stringify(this.proxy));
  }
}

class ArrayProxyMembrane extends ProxyMembrane {
  #cache = new Map();

  constructor(root, handler, paths) {
    super(root, handler, paths);

    root.forEach((value, index) => {
      const property = `${index}`;
      const proxy = proxifyIfRequired(
        property,
        value,
        this.handler,
        this.paths,
      );

      if (proxy instanceof ProxyMembrane) {
        this.#cache.set(property, proxy);
      }
    });
  }

  handlerDefinition() {
    return {
      get: (target, property) => {
        if (this.#cache.has(property)) {
          return this.#cache.get(property).proxy;
        }

        return Reflect.get(target, property);
      },

      set: (target, property, newValue) => {
        const oldValue = Reflect.get(target, property);
        let value = proxifyIfRequired(
          property,
          newValue,
          this.handler,
          this.paths,
        );

        if (newValue === null || newValue == undefined) {
          ProxyMembrane.revoke(this.#cache.get(property));
          this.#cache.delete(property);
        } else if (value instanceof ProxyMembrane) {
          this.#cache.set(property, value);
          value = value.proxy;
        }

        this.notifyChange([...this.paths, property], oldValue, value);
        return Reflect.set(target, property, value);
      },
    };
  }
}

class ObjectProxyMembrane extends ProxyMembrane {
  #cache = new Map();

  constructor(root, handler, paths) {
    super(root, handler, paths);

    Object.entries(root).map(([property, value]) => {
      const proxy = proxifyIfRequired(
        property,
        value,
        this.handler,
        this.paths,
      );

      if (proxy instanceof ProxyMembrane) {
        this.#cache.set(property, proxy);
      }
    });
  }

  handlerDefinition() {
    return {
      get: (target, property) => {
        if (this.#cache.has(property)) {
          return this.#cache.get(property).proxy;
        }

        return Reflect.get(target, property);
      },

      set: (target, property, newValue) => {
        const oldValue = Reflect.get(target, property);
        let value = proxifyIfRequired(
          property,
          newValue,
          this.handler,
          this.paths,
        );

        if (newValue === null || newValue == undefined) {
          ProxyMembrane.revoke(this.#cache.get(property));
          this.#cache.delete(property);
        } else if (value instanceof ProxyMembrane) {
          this.#cache.set(property, value);
          value = value.proxy;
        }

        this.notifyChange([...this.paths, property], oldValue, value);
        return Reflect.set(target, property, value);
      },

      deleteProperty: (target, property) => {
        const oldValue = Reflect.get(target, property);

        ProxyMembrane.revoke(this.#cache.get(property));
        this.#cache.delete(property);

        this.notifyChange([...this.paths, property], oldValue, undefined);
        return Reflect.deleteProperty(target, property);
      },
    };
  }

  [REVOKE]() {
    Array.from(this.#cache.values()).forEach(ProxyMembrane.revoke);
    this.#cache = undefined;

    super[REVOKE]();
  }
}

export function proxyMembrane(target, handler) {
  if (isArray(target)) {
    return new ArrayProxyMembrane(target, handler).proxy;
  }

  return new ObjectProxyMembrane(target, handler).proxy;
}
