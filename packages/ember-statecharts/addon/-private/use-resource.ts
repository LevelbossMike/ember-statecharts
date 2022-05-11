import type { Resource } from './resource';
import type { Cache } from '@glimmer/validator';
import { invokeHelper } from '@ember/helper';

interface TemplateArgs {
  positional: readonly unknown[];
  named: Record<string, unknown>;
}
type Args = TemplateArgs | TemplateArgs['positional'] | TemplateArgs['named'];

import { getValue } from '@glimmer/tracking/primitives/cache';

export function useUnproxiedResource<
  TArgs = Args,
  T extends Resource<TemplateArgs> = Resource<TemplateArgs>
>(destroyable: object, definition: object, args?: () => TArgs): { value: T } {
  let resource: Cache<T>;

  return {
    get value(): T {
      if (!resource) {
        resource = invokeHelper(
          destroyable,
          definition, // eslint-disable-line
          args
        ) as Cache<T>;
      }

      return getValue<T>(resource)!; // eslint-disable-line
    },
  };
}

export function useResource<
  TArgs = Args,
  T extends Resource<TemplateArgs> = Resource<TemplateArgs>
>(destroyable: object, definition: object, args?: () => TArgs): T {
  const target = useUnproxiedResource<TArgs, T>(destroyable, definition, args);

  return new Proxy(target, {
    get(target, key): unknown {
      const instance = target.value;
      const value = Reflect.get(instance, key, instance);

      return typeof value === 'function' ? value.bind(instance) : value;
    },
    ownKeys(target): (string | symbol)[] {
      return Reflect.ownKeys(target.value);
    },
    getOwnPropertyDescriptor(target, key): PropertyDescriptor | undefined {
      return Reflect.getOwnPropertyDescriptor(target.value, key);
    },
  }) as never as T;
}
