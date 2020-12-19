type LazyTrackedArgs = {
  positional?: Array<unknown>;
  named?: Record<string, unknown>;
};

export const use: PropertyDecorator;
export class Resource<Args extends LazyTrackedArgs> {
  protected args: Args;

  // This is a lie, but makes the call site nice
  constructor(fn: () => Args['positional'] | Args);
}
