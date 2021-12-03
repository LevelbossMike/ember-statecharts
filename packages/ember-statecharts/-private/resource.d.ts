declare type Owner = Record<string, unknown>;
export interface TemplateArgs {
  positional: readonly unknown[];
  named: Record<string, unknown>;
}
export declare abstract class Resource<
  Args extends TemplateArgs = TemplateArgs
> {
  protected readonly args: Args;
  constructor(owner: Owner, args: Args);
  setup(): void;
  update?(args: Args): void;
  teardown?(): void;
}
export {};
