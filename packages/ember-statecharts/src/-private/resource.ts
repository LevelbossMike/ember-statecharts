import { setHelperManager, capabilities } from '@ember/helper';

import { setOwner } from '@ember/application';
import {
  destroy,
  associateDestroyableChild,
  registerDestructor,
} from '@ember/destroyable';

import { createCache, getValue } from '@glimmer/tracking/primitives/cache';

import type { Cache } from '@glimmer/validator';

type Owner = Record<string, unknown>;

export interface TemplateArgs {
  positional: readonly unknown[];
  named: Record<string, unknown>;
}

declare const HELPER_DEFINITION: unique symbol;
type HelperDefinition<T = unknown> = T & {
  readonly [HELPER_DEFINITION]: true;
};

export abstract class Resource<Args extends TemplateArgs = TemplateArgs> {
  protected readonly args!: Args;

  constructor(owner: Owner, args: Args) {
    setOwner(this, owner);

    this.args = args;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup(): void {}

  update?(args: Args): void;
  teardown?(): void;
}

class ResourceManager {
  readonly capabilities = capabilities('3.23', {
    hasValue: true,
    hasDestroyable: true,
  });

  private readonly owner: Owner;

  constructor(owner: Owner) {
    this.owner = owner;
  }

  createHelper<Args extends TemplateArgs = TemplateArgs>(
    Class: HelperDefinition<new (owner: Owner, args: Args) => Resource>,
    args: Args
  ): Cache<Resource> {
    const { update, teardown } = Class.prototype as Resource;

    const hasUpdate = typeof update === 'function';
    const hasTeardown = typeof teardown === 'function';

    const owner = this.owner;

    let instance: Resource | undefined;
    let cache: Cache<Resource>;

    if (hasUpdate) {
      cache = createCache(() => {
        if (instance === undefined) {
          instance = setupInstance(cache, Class, owner, args, hasTeardown);
        } else {
          instance.update!(args); // eslint-disable-line
        }

        return instance;
      });
    } else {
      cache = createCache(() => {
        if (instance !== undefined) {
          destroy(instance);
        }

        instance = setupInstance(cache, Class, owner, args, hasTeardown);

        return instance;
      });
    }

    return cache;
  }

  getValue(cache: Cache<Resource>): Resource | undefined {
    const instance = getValue(cache);

    return instance;
  }

  getDestroyable(cache: Cache): Cache {
    return cache;
  }

  //eslint-disable-next-line
  getDebugName(fn: (...args: any[]) => void): string {
    return fn.name || '(anonymous function)';
  }
}

function setupInstance<T extends Resource>(
  cache: Cache,
  Class: new (owner: Owner, args: TemplateArgs) => T,
  owner: Owner,
  args: TemplateArgs,
  hasTeardown: boolean
): T {
  const instance = new Class(owner, args);
  associateDestroyableChild(cache, instance);
  instance.setup();

  if (hasTeardown) {
    registerDestructor(instance, () => instance.teardown!()); // eslint-disable-line
  }

  return instance;
}

setHelperManager((owner: Owner) => new ResourceManager(owner), Resource);
