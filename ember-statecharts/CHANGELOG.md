## 0.15.1

### Patch Changes

- da688ce: [#392 Avoid changing state property](https://github.com/LevelbossMike/ember-statecharts/pull/392) - [miguelcobain](https://github.com/miguelcobain)

  Make sure to only update the resources `state`-property when the state actually changed. This makes sure
  we don't trigger reactive getters unnecessarily.

  See [Xstate-Transitions docs](https://xstate.js.org/docs/guides/interpretation.html#transitions) for reference.

## 0.15.0

### Minor Changes

- 1c27cb6: Port add-on to a proper [v2 add-on](https://github.com/embroider-build/embroider/blob/main/SPEC.md) setup.

  This restructuring does change the behavior of the add-on slightly and is introducing breaking changes.

  ## 🥁 Features

  ### `use-machine` is now an `ember-resource`-resource

  `ember-statecharts` now uses [ember-resources](https://github.com/NullVoxPopuli/ember-resources/tree/main) under the hood to provide its functionality. Make sure you install it as a dependency of your project:

  ```sh
  ember install ember-resources
  ```

  This doesn't change the way you use `useMachine` but comes with the additional benefit of you now having the possibilty to create resources in your application and model their behavior explicitly via `useMachine`:

  Example:

  ```js
  import { tracked } from '@glimmer/tracking';
  import { Resource } from 'ember-resources';
  import { useMachine } from 'ember-statecharts';
  import asyncMachine from '../machines/async';

  function noop = async function() {}

  class Async extends Resource {
    @tracked onSuccess;
    @tracked onError;
    @tracked onSubmit;

    statechart = useMachine(this, () => {
      return {
        machine: asyncMachine.withConfig({
          actions: {
            onError,
            onSuccess,
          },
          services: {
            onSubmit
          }
        })
      }
    });

    submit = () => {
      this.statechart.send('SUBMIT');
    }

    retry = () => {
      this.statechart.send('RETRY');
    }

    get isBusy() {
      return this.statechart.state.matches('busy');
    }

    modify(positional, { onSubmit, onError, onSuccess}) {
      this.onSubmit = onSubmit || noop;
      this.onError = onError || noop;
      this.onSuccess = onSuccess || noop;
    }
  }

  // use it somewhere
  import Async from '../resources/async';

  class AsyncButton extends Component {
    async = Async.from(this, () => {
      return {
        onSubmit,
        onSuccess,
        onError
      }
    })

    get isDisabled() {
      return this.async.isBusy;
    }

    // ...
  }
  ```

  Please refer to the documentation of [ember-resources](https://github.com/NullVoxPopuli/ember-resources/tree/main) to learn more how to implement your own custom resources, and how to use them in your projects.

  ###

  ## 💥 Breaking changes

  ### `statechart`-computed-macro has been removed

  The `@statechart`-macro, i.e. the [computed based statechart API](https://ember-statecharts.com/versions/v0.9.0/docs/statecharts) has been removed from the add-on completely. `ember-statecharts` is a proper v2-addon now and chances
  are that if you still rely on the `statechart`-computed you won't need to update to a v2-addon. The API also does
  not play very well with the Octane paradigms.

  ### `@matchesState`-decorator removed

  The [`@matchesState`-decorator](https://ember-statecharts.com/versions/v0.14.0/docs/statecharts#matching-state) has been removed. Decorators don't play very well with TypeScript and [matching against state](https://xstate.js.org/docs/guides/states.html#state-methods-and-properties) is a built-in feature of XState.

  Refactoring your `@matchesState`-decorators towards reactive getters is rather simple:

  ```js
  @matchesState({ interactivity: 'idle'})
  isIdle;

  // => refactor towards native getter

  get isIdle() {
    return this.statechart.state.matches({ interactivity: 'idle' })
  }
  ```

  If you can't live without the decorator it is also rather simple to recreate it in your own project:

  ```ts
  import { matchesState as xStateMatchesState } from 'xstate';

  function matchesState(
    state: StateValue,
    statechartPropertyName = 'statechart'
  ): any {
    return function () {
      return {
        get(this: any): boolean {
          const statechart = this[statechartPropertyName] as
            | { state: { value: StateValue } }
            | undefined;

          if (statechart) {
            return xstateMatchesState(state, statechart.state.value);
          } else {
            return false;
          }
        },
      };
    };
  }

  // you can use this as a @matchesState-decorator
  class ButtonComponent extends Component {
    statechart = useMachine(this, () => {
      // ...
    });

    @matchesState('busy') isBusy;
  }
  ```

## [0.15.0-beta.0](https://github.com/LevelbossMike/ember-statecharts/compare/v0.14.0...v0.15.0-beta.0) (2022-05-11)

This beta makes ember-statecharts compatible with embroider. You have to use ember-auto-import-v2 to use this release.

### Bug Fixes

- make linter happy ([af41285](https://github.com/LevelbossMike/ember-statecharts/commit/af412858e0822ac841d24a9e0d2ef9280f6ea762))
- make sure addon works with embroider ([3178b07](https://github.com/LevelbossMike/ember-statecharts/commit/3178b0790e9ccd92d253ef159491dd2c76349481))
- more fixes for embroider ([4ddc193](https://github.com/LevelbossMike/ember-statecharts/commit/4ddc193f14102bf511a977c541a3aa2089f2c72f))
- pin eslint to 7.29 ([cc327c5](https://github.com/LevelbossMike/ember-statecharts/commit/cc327c5c3face9ad319440ec507bfb5c0640e653))
- remove ember-auto-import from dev dependencies ([0b6a4f7](https://github.com/LevelbossMike/ember-statecharts/commit/0b6a4f7ead4ffdd81dd5b02fed819e41351a8a27))
- test-setup test-app / site ([15d29e9](https://github.com/LevelbossMike/ember-statecharts/commit/15d29e976e7545126bf6a9811e302a27663a5fc2))

## [0.14.0](https://github.com/LevelbossMike/ember-statecharts/compare/v0.13.2...v0.14.0) (2022-03-09)

### Bug Fixes

- **site:** downgrade ember-showcase to 0.1.0 ([1e057ef](https://github.com/LevelbossMike/ember-statecharts/commit/1e057efd2bfac0e429928bf05e0199ea54b5fa29))
- dedupe ember-cli-babel ([12f2063](https://github.com/LevelbossMike/ember-statecharts/commit/12f2063ea010688f021f19ab9eca458a9d1f0dd4))
- linting errors after ember upgrade ([ff6c7a7](https://github.com/LevelbossMike/ember-statecharts/commit/ff6c7a787b2554893e978548001d9304c93104b2))
- make sure to use any port available for testing ([9d93f1e](https://github.com/LevelbossMike/ember-statecharts/commit/9d93f1e67448a27124168c7c6c21df07064984c8))
- onEntry -> entry; onExit -> exit ([d4ecd5b](https://github.com/LevelbossMike/ember-statecharts/commit/d4ecd5b45561f226cce2bebf84fb0a826d429d5e))
- override docs-viewer ([b19101b](https://github.com/LevelbossMike/ember-statecharts/commit/b19101b758689988d39776dc25a9d39225b4411f))
- try to fix CI Build with auto-import-v2 ([80b409f](https://github.com/LevelbossMike/ember-statecharts/commit/80b409f680ea49308a2d9d22ec9c3008bcecdbe8)), closes [/github.com/emberjs/ember.js/pull/19761#issuecomment-942623604](https://github.com//github.com/emberjs/ember.js/pull/19761/issues/issuecomment-942623604)
- use custom docs-header ([154850f](https://github.com/LevelbossMike/ember-statecharts/commit/154850f42ab937595ce0de9d27efb429be912e5e))

### Features

- add logo ([0b02482](https://github.com/LevelbossMike/ember-statecharts/commit/0b0248262115315926b98e2a0193c3878633d9b5))
- add versions dropdown to application header ([656efdf](https://github.com/LevelbossMike/ember-statecharts/commit/656efdf1e6748240f98d9e69256b7ca9c76f47d6))
- versions-dropdown ([aefa6db](https://github.com/LevelbossMike/ember-statecharts/commit/aefa6dbbea3467614ae7d7c8d623a64c883c31f8))

## [0.14.0-beta.0](https://github.com/LevelbossMike/ember-statecharts/compare/v0.13.2...v0.14.0-beta.0) (2021-12-03)

This is the first prerelease of the new updated `useMachine`-API that does not require `ember-usable` anymore but is implemented based on the `[invokeHelper](https://api.emberjs.com/ember/3.28/functions/@ember%2Fhelper/invokeHelper)-API. **You need to run Ember.js >= 3.24.x to use this release**.

## Changes in this release:

### new `useMachine`-API

`useMachine` is now a helper. Thus the invocation has changed slightly:

```js
import { useMachine, matchesState } from 'ember-statecharts';

export default class ToggleComponent extends Component {
  statechart = useMachine(this, () => {
    return {
      machine: toggleMachine.withConfig({ /* ... */ }).withContext({ /* ... */}),
      update({ machine, restart, send }) => { /* ... */}, // optional
      onTransition(state) => { /* ... */}, // optional
      initialState: this.args.state, // optional
      interpreterOptions: { /* ... */} // optional
    };
  });

  @matchesState('off') isOff;
  @matchesState('on') isOn;

  @action toggle() {
    this.statechart.send('TOGGLE');
  }
}

```

### XState is a peer dependency now

XState now needs to be installed separately - `ember-statecharts` will not pull in this dependency for you anymore:

```

yarn add -D xstate
```

or

```
npm install --save-dev xstate
```

### No more `ember-usable`

This addon does not depend on a separate `use`able-addon anymore. If your app relies on the previous implicit install of ember-usable you will need to install it yourself now.

## [0.13.2](https://github.com/LevelbossMike/ember-statecharts/compare/v0.13.1...v0.13.2) (2020-09-25)

## [0.13.1](https://github.com/LevelbossMike/ember-statecharts/compare/v0.13.0...v0.13.1) (2020-09-07)

# [0.13.0](https://github.com/LevelbossMike/ember-statecharts/compare/v0.12.0...v0.13.0) (2020-09-06)

### Features

- use TypeScript for `use-machine` ([1b1fdae](https://github.com/LevelbossMike/ember-statecharts/commit/1b1fdaeaf19d863f212de8c2dab46a4520ef7256))

# [0.12.0](https://github.com/LevelbossMike/ember-statecharts/compare/v0.11.0...v0.12.0) (2020-08-25)

### Features

- add `onTransition`-hook for useMachine ([462c518](https://github.com/LevelbossMike/ember-statecharts/commit/462c51800e32e5ecc49f2e3f917e45015ea3b750))
- start/restart in specific state is now possible([1d3e2a2](https://github.com/LevelbossMike/ember-statecharts/commit/1d3e2a2a029f5c4182591442c9d1c50fc797ebc8))
- add types for new update method ([acf2b5d](https://github.com/LevelbossMike/ember-statecharts/commit/acf2b5dc14d77e16cde74bae5fec0433ce7e89e4))

# [0.11.0](https://github.com/LevelbossMike/ember-statecharts/compare/v0.9.0...v0.11.0) (2020-07-04)

### Bug Fixes

- `or` not working with new `matchesState` ([2168822](https://github.com/LevelbossMike/ember-statecharts/commit/2168822e0e26ca90971bf57f9fc6ee942126eeb5))
- allow interpreter options to be passed to override devTool / other things if desired (except the clock) ([997bc9e](https://github.com/LevelbossMike/ember-statecharts/commit/997bc9e1a97c2999168ae7f1be3402a7ebbce4bd))
- check for passed in machine ([ce31e89](https://github.com/LevelbossMike/ember-statecharts/commit/ce31e8916f391452d43909628d391cf94460d446))
- handle machine creation in useMachine function ([22e35b8](https://github.com/LevelbossMike/ember-statecharts/commit/22e35b8475f2bd0d65427ff788aec4a8c5196fb9))
- Update CHANGELOG.md v0.10.0-beta.0 ([2060e40](https://github.com/LevelbossMike/ember-statecharts/commit/2060e40aa457e594b5f973510c4dd8def8192490))

### Features

- add `.update`-hook for handling usable updates ([fd31747](https://github.com/LevelbossMike/ember-statecharts/commit/fd317472dcff8de372fe5657b6105378b1c04351))
- Add type definitions ([4329796](https://github.com/LevelbossMike/ember-statecharts/commit/4329796c1e75c62a99ae2934d76e87d1d4f490c4))
- expose interpreted machine service ([8065939](https://github.com/LevelbossMike/ember-statecharts/commit/80659398462068d6f209afa2e74412936408e0b7))
- implement `useMachine` ([d7ce532](https://github.com/LevelbossMike/ember-statecharts/commit/d7ce5327d511aa26db9d8ea3a688c60ea4118721))
- support machine configs ([59ff076](https://github.com/LevelbossMike/ember-statecharts/commit/59ff0761813616f047bbefcbddf1540bd9801ae6))
- warn about usable-updates on args/state changes ([d278f97](https://github.com/LevelbossMike/ember-statecharts/commit/d278f976eecbec6e147cf430bf31045bd0643904))

# [0.10.0](https://github.com/LevelbossMike/ember-statecharts/compare/v0.10.0-beta.1...v0.10.0) (2020-06-10)

### Bug Fixes

- `or` not working with new `matchesState` ([118e163](https://github.com/LevelbossMike/ember-statecharts/commit/118e16328f7da96704dc29faab7636841d7c4f2b))

# [0.10.0-beta.1](https://github.com/LevelbossMike/ember-statecharts/compare/v0.9.0...v0.10.0-beta.1) (2020-06-04)

### Bug Fixes

- allow interpreter options to be passed to override devTool / other things if desired (except the clock) ([0fa019a](https://github.com/LevelbossMike/ember-statecharts/commit/0fa019aa545c712c5f2d3e16e2673d443215e6d4))
- check for passed in machine ([2cf1c0f](https://github.com/LevelbossMike/ember-statecharts/commit/2cf1c0fe7f8080a83ccdc835359605e5ebcd9829))
- handle machine creation in useMachine function ([96769be](https://github.com/LevelbossMike/ember-statecharts/commit/96769be9bfae30ee8f1ba32250abf719e5b93b80))
- Update CHANGELOG.md v0.10.0-beta.0 ([84cb5b0](https://github.com/LevelbossMike/ember-statecharts/commit/84cb5b0d1e5804074e28eefef65732fab58d7c4b))

### Features

- Add type definitions ([15569b7](https://github.com/LevelbossMike/ember-statecharts/commit/15569b70169bee6052a5084cab3529ed44114924))
- expose interpreted machine service ([6c63289](https://github.com/LevelbossMike/ember-statecharts/commit/6c63289551d10cb8db3ce957f8ece50d5fc2dd36))
- implement `useMachine` ([b4b2155](https://github.com/LevelbossMike/ember-statecharts/commit/b4b2155dcf453f0f01597232ce845e73aa708c03))
- support machine configs ([c9c471c](https://github.com/LevelbossMike/ember-statecharts/commit/c9c471cd43762fa7f90d28cbfe54f2080b316c5b))
- warn about usable-updates on args/state changes ([85cd021](https://github.com/LevelbossMike/ember-statecharts/commit/85cd021380b89b023ebf5fa8d099c3830b36a0a9))

# Change Log

## [v0.10.0-beta.0](https://github.com/LevelbossMike/ember-statecharts/tree/v0.10.0-beta.0) (2020-05-04)

This beta release of `ember-statecharts` comes with an improved api to work
with xstate-machines directly - `useMachine`. Please refer to
[#235](https://github.com/LevelbossMike/ember-statecharts/issues/235) for
details about the idea behind `useMachine` and make sure to report any issues
you find.

#### :rocket: Enhancement / Feature

- [#235](https://github.com/LevelbossMike/ember-statecharts/issues/235) Initial
  implementation `useMachine`-api

#### Committers: 1

- Michael Klein ([@LevelbossMike](https://github.com/LevelbossMike))

[Full Changelog](https://github.com/LevelbossMike/ember-statecharts/compare/v0.9.0...v0.10.0-beta.0)

## [v0.9.0](https://github.com/LevelbossMike/ember-statecharts/tree/v0.9.0) (2020-04-09)

[Full Changelog](https://github.com/LevelbossMike/ember-statecharts/compare/v0.8.2...v0.9.0)

#### :house: Internal

- [#217](https://github.com/LevelbossMike/ember-statecharts/pull/217) Update
  docs to Octane
- [#217](https://github.com/LevelbossMike/ember-statecharts/pull/217) Update
  xstate to 4.8.0

See [xstate#4.8.0 - release notes](https://github.com/davidkpiano/xstate/releases/tag/xstate%404.8.0) for new xstate release notes.

#### Committers: 2

- Clemens M�ller ([@pangratz](https://github.com/pangratz))
- Michael Klein ([@LevelbossMike](https://github.com/LevelbossMike))

## [v0.8.2](https://github.com/LevelbossMike/ember-statecharts/tree/v0.8.2) (2019-07-05)

[Full Changelog](https://github.com/LevelbossMike/ember-statecharts/compare/v0.8.1...v0.8.2)

#### :house: Internal

- [c0dec97](https://github.com/LevelbossMike/ember-statecharts/commit/c0dec97c631a8786218731d9b699cfcdd8d3e212) Update xstate to 4.6.4 ([@LevelbossMike](https://github.com/levelbossmike))

See [xstate#4.6.4 - release notes](https://github.com/davidkpiano/xstate/releases/tag/v4.6.4) for new xstate release notes.

#### Committers: 1

- Michael Klein ([@LevelbossMike](https://github.com/LevelbossMike))

## [v0.8.1](https://github.com/LevelbossMike/ember-statecharts/tree/v0.8.1) (2019-07-05)

[Full Changelog](https://github.com/LevelbossMike/ember-statecharts/compare/v0.8.0...v0.8.1)

#### :rocket: Enhancement / Feature

- [#118](https://github.com/LevelbossMike/ember-statecharts/pull/118) Add addon-docs ([@LevelbossMike](https://github.com/levelbossmike))

Finally we have an addon-docs page :rocket:.

#### Committers: 1

- Michael Klein ([@LevelbossMike](https://github.com/LevelbossMike))

## [v0.8.0](https://github.com/LevelbossMike/ember-statecharts/tree/v0.8.0) (2019-06-16)

[Full Changelog](https://github.com/LevelbossMike/ember-statecharts/compare/v0.7.1...v0.8.0)

#### :rocket: Enhancement / Feature

- [dda27d6](https://github.com/LevelbossMike/ember-statecharts/commit/dda27d6d5176d858992d8cae16c590d66c2fb8bf) Improve `matchesState` and `debugState` ([@LevelbossMike](https://github.com/levelbossmike))

`matchesState` and `debugState` now also support statecharts that are named differently than `statechart`.

#### :House: Internal

- [#102](https://github.com/LevelbossMike/ember-statecharts/pull/102) Update ember-cli 3.10.x, xstate, prettier ([@LevelbossMike](https://github.com/levelbossmike))

See [xstate#4.6.0 - release notes](https://github.com/davidkpiano/xstate/releases/tag/v4.6.0) for new xstate features.

#### Committers: 1

- Michael Klein ([@LevelbossMike](https://github.com/LevelbossMike))

## [v0.7.1](https://github.com/LevelbossMike/ember-statecharts/tree/v0.7.1) (2019-04-25)

[Full Changelog](https://github.com/LevelbossMike/ember-statecharts/compare/v0.7.0...v0.7.1)

#### :bug: Bug Fix

- [#82](https://github.com/LevelbossMike/ember-statecharts/pull/82) call willDestroy with correct context ([@pangratz](https://github.com/pangratz))

#### Committers: 1

- Clemens M�ller ([@pangratz](https://github.com/pangratz))

## [v0.7.0](https://github.com/LevelbossMike/ember-statecharts/tree/v0.7.0) (2019-04-19)

[Full Changelog](https://github.com/LevelbossMike/ember-statecharts/compare/v0.6.1...v0.7.0)

#### :boom: Breaking Change - :rocket: Feature / Enhancement

- [#66](https://github.com/LevelbossMike/ember-statecharts/pull/66) Use xstate interpreter ([@LevelbossMike](https://github.com/LevelbossMike))

#### :house: Internal

- [#67](https://github.com/LevelbossMike/ember-statecharts/pull/67) Add prettier ([@LevelbossMike](https://github.com/LevelbossMike))

## [v0.6.1](https://github.com/LevelbossMike/ember-statecharts/tree/v0.6.1) (2018-12-02)

[Full Changelog](https://github.com/LevelbossMike/ember-statecharts/compare/v0.6.0...v0.6.1)

- Update to Ember 3.5 [\#12](https://github.com/LevelbossMike/ember-statecharts/pull/12) ([loganrosen](https://github.com/loganrosen))

## [v0.6.0](https://github.com/LevelbossMike/ember-statecharts/tree/v0.6.0) (2018-11-05)

[Full Changelog](https://github.com/LevelbossMike/ember-statecharts/compare/v0.5.0...v0.6.0)

- Update to xstate 4.0.x [\#11](https://github.com/LevelbossMike/ember-statecharts/pull/11) ([LevelbossMike](https://github.com/levelbossmike))

## [v0.5.0](https://github.com/LevelbossMike/ember-statecharts/tree/v0.5.0) (2018-10-01)

[Full Changelog](https://github.com/LevelbossMike/ember-statecharts/compare/v0.4.0...v0.5.0)

- Get rid of statechart-mixin [\#10](https://github.com/LevelbossMike/ember-statecharts/pull/10) ([LevelbossMike](https://github.com/levelbossmike))

## [v0.4.0](https://github.com/LevelbossMike/ember-statecharts/tree/v0.4.0) (2018-09-24)

[Full Changelog](https://github.com/LevelbossMike/ember-statecharts/compare/v0.3.0...v0.4.0)

- Allow strings in guard conditions [\#9](https://github.com/LevelbossMike/ember-statecharts/pull/9) ([LevelbossMike](https://github.com/levelbossmike))
- Add matcheState and debugState computeds [\#6](https://github.com/LevelbossMike/ember-statecharts/pull/6) ([LevelbossMike](https://github.com/levelbossmike))

## [v0.3.0](https://github.com/LevelbossMike/ember-statecharts/tree/v0.3.0) (2018-09-03)

[Full Changelog](https://github.com/LevelbossMike/ember-statecharts/compare/v0.2.0...v0.3.0)

- Use ember-auto-import to bundle xstate [0c06c5a](https://github.com/LevelbossMike/ember-statecharts/commit/0c06c5a) ([LevelbossMike](https://github.com/levelbossmike))

## [v0.2.0](https://github.com/LevelbossMike/ember-statecharts/tree/v0.2.0) (2018-08-31)

[Full Changelog](https://github.com/LevelbossMike/ember-statecharts/compare/v0.1.0...v0.2.0)

- Ember-cli-update to 3.3.0 [8152d68](https://github.com/LevelbossMike/ember-statecharts/commit/8152d68) ([LevelbossMike](https://github.com/levelbossmike))
- Add ember-cli-update for easier upgrades [1e24188](https://github.com/LevelbossMike/ember-statecharts/commit/1e24188) ([LevelbossMike](https://github.com/levelbossmike))
- Upgrade xstate to 3.3.3 [472e1df](https://github.com/LevelbossMike/ember-statecharts/commit/472e1df) ([LevelbossMike](https://github.com/levelbossmike))

## [v0.1.0](https://github.com/LevelbossMike/ember-statecharts/tree/v0.1.0) (2018-07-05)

[Full Changelog](https://github.com/LevelbossMike/ember-statecharts/compare/v0.1.0-beta.0...v0.1.0)

- no changes since v0.1.0-beta.0

## [v0.1.0-beta.0](https://github.com/LevelbossMike/ember-statecharts/tree/v0.1.0-beta.0) (2018-05-22)

[Full Changelog](https://github.com/LevelbossMike/ember-statecharts/compare/v0.0.2...v0.1.0-beta.0)

- Support passing strings in actions [\#3](https://github.com/LevelbossMike/ember-statecharts/pull/3) ([LevelbossMike](https://github.com/levelbossmike))
- Add test for orthogonal state [ba27022](https://github.com/LevelbossMike/ember-statecharts/commit/ba27022) ([LevelbossMike](https://github.com/levelbossmike))
- \[BREAKING\] Refactor to use [xstate](https://github.com/davidkpiano/xstate) internally [\#2](https://github.com/LevelbossMike/ember-statecharts/pull/2) ([LevelbossMike](https://github.com/levelbossmike))

## [v0.0.2](https://github.com/LevelbossMike/ember-statecharts/tree/v0.0.2) (2018-05-21)

[Full Changelog](https://github.com/LevelbossMike/ember-statecharts/compare/v0.0.1...v0.0.2)

- add nested statecharts [\#1](https://github.com/LevelbossMike/ember-statecharts/pull/1) ([LevelbossMike](https://github.com/levelbossmike))

## [v0.0.1](https://github.com/LevelbossMike/ember-statecharts/tree/v0.0.1) (2018-05-07)

- initial implementation of statechart util and mixin
