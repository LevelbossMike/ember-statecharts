import type { Resource } from './resource';
interface TemplateArgs {
  positional: readonly unknown[];
  named: Record<string, unknown>;
}
declare type Args =
  | TemplateArgs
  | TemplateArgs['positional']
  | TemplateArgs['named'];
export declare function useUnproxiedResource<
  TArgs = Args,
  T extends Resource<TemplateArgs> = Resource<TemplateArgs>
>(
  destroyable: object,
  definition: object,
  args?: () => TArgs
): {
  value: T;
};
export declare function useResource<
  TArgs = Args,
  T extends Resource<TemplateArgs> = Resource<TemplateArgs>
>(destroyable: object, definition: object, args?: () => TArgs): T;
export {};
