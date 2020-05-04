# Change Log

## [v0.10.0-beta.0](https://github.com/LevelbossMike/ember-statecharts/tree/v0.9.0) (2020-05-04)

This beta release of `ember-statecharts` comes with an improved api to work
with xstate-machines directly - `useMachine`. Please refer to
[#235](https://github.com/LevelbossMike/ember-statecharts/issues/235) for
details about the idea behind `useMachine` and make sure to report any issues
you find.

#### :rocket: Enhancement / Feature
* [#235](https://github.com/LevelbossMike/ember-statecharts/issues/235) Initial
  implementation `useMachine`-api

#### Committers: 1
- Michael Klein ([@LevelbossMike](https://github.com/LevelbossMike))

[Full Changelog](https://github.com/LevelbossMike/ember-statecharts/compare/v0.9.0...v0.10.0-beta.0)

## [v0.9.0](https://github.com/LevelbossMike/ember-statecharts/tree/v0.9.0) (2020-04-09)

[Full Changelog](https://github.com/LevelbossMike/ember-statecharts/compare/v0.8.2...v0.9.0)

#### :house: Internal
* [#217](https://github.com/LevelbossMike/ember-statecharts/pull/217) Update
  docs to Octane
* [#217](https://github.com/LevelbossMike/ember-statecharts/pull/217) Update
  xstate to 4.8.0

See [xstate#4.8.0 - release notes](https://github.com/davidkpiano/xstate/releases/tag/xstate%404.8.0) for new xstate release notes.

#### Committers: 2
- Clemens M�ller ([@pangratz](https://github.com/pangratz))
- Michael Klein ([@LevelbossMike](https://github.com/LevelbossMike))

## [v0.8.2](https://github.com/LevelbossMike/ember-statecharts/tree/v0.8.2) (2019-07-05)

[Full Changelog](https://github.com/LevelbossMike/ember-statecharts/compare/v0.8.1...v0.8.2)

#### :house: Internal
* [c0dec97](https://github.com/LevelbossMike/ember-statecharts/commit/c0dec97c631a8786218731d9b699cfcdd8d3e212) Update xstate to 4.6.4 ([@LevelbossMike](https://github.com/levelbossmike))

See [xstate#4.6.4 - release notes](https://github.com/davidkpiano/xstate/releases/tag/v4.6.4) for new xstate release notes.

#### Committers: 1
- Michael Klein ([@LevelbossMike](https://github.com/LevelbossMike))

## [v0.8.1](https://github.com/LevelbossMike/ember-statecharts/tree/v0.8.1) (2019-07-05)

[Full Changelog](https://github.com/LevelbossMike/ember-statecharts/compare/v0.8.0...v0.8.1)

#### :rocket: Enhancement / Feature
* [#118](https://github.com/LevelbossMike/ember-statecharts/pull/118) Add addon-docs ([@LevelbossMike](https://github.com/levelbossmike))

Finally we have an addon-docs page :rocket:.

#### Committers: 1
- Michael Klein ([@LevelbossMike](https://github.com/LevelbossMike))

## [v0.8.0](https://github.com/LevelbossMike/ember-statecharts/tree/v0.8.0) (2019-06-16)

[Full Changelog](https://github.com/LevelbossMike/ember-statecharts/compare/v0.7.1...v0.8.0)

#### :rocket: Enhancement / Feature
* [dda27d6](https://github.com/LevelbossMike/ember-statecharts/commit/dda27d6d5176d858992d8cae16c590d66c2fb8bf) Improve `matchesState` and `debugState` ([@LevelbossMike](https://github.com/levelbossmike))

`matchesState` and `debugState` now also support statecharts that are named differently than `statechart`.

#### :House: Internal 
* [#102](https://github.com/LevelbossMike/ember-statecharts/pull/102) Update ember-cli 3.10.x, xstate, prettier ([@LevelbossMike](https://github.com/levelbossmike))

See [xstate#4.6.0 - release notes](https://github.com/davidkpiano/xstate/releases/tag/v4.6.0) for new xstate features. 

#### Committers: 1
- Michael Klein ([@LevelbossMike](https://github.com/LevelbossMike))

## [v0.7.1](https://github.com/LevelbossMike/ember-statecharts/tree/v0.7.1) (2019-04-25)

[Full Changelog](https://github.com/LevelbossMike/ember-statecharts/compare/v0.7.0...v0.7.1)

#### :bug: Bug Fix
* [#82](https://github.com/LevelbossMike/ember-statecharts/pull/82) call willDestroy with correct context ([@pangratz](https://github.com/pangratz))

#### Committers: 1
- Clemens M�ller ([@pangratz](https://github.com/pangratz))

## [v0.7.0](https://github.com/LevelbossMike/ember-statecharts/tree/v0.7.0) (2019-04-19)

[Full Changelog](https://github.com/LevelbossMike/ember-statecharts/compare/v0.6.1...v0.7.0)

#### :boom: Breaking Change - :rocket: Feature / Enhancement
* [#66](https://github.com/LevelbossMike/ember-statecharts/pull/66) Use xstate interpreter ([@LevelbossMike](https://github.com/LevelbossMike))

#### :house: Internal
* [#67](https://github.com/LevelbossMike/ember-statecharts/pull/67) Add prettier ([@LevelbossMike](https://github.com/LevelbossMike))

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
