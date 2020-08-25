# [0.12.0](https://github.com/LevelbossMike/ember-statecharts/compare/v0.11.0...v0.12.0) (2020-08-25)

# [0.11.0](https://github.com/LevelbossMike/ember-statecharts/compare/v0.9.0...v0.11.0) (2020-07-04)


### Bug Fixes

* `or` not working with new `matchesState` ([2168822](https://github.com/LevelbossMike/ember-statecharts/commit/2168822e0e26ca90971bf57f9fc6ee942126eeb5))
* allow interpreter options to be passed to override devTool / other things if desired (except the clock) ([997bc9e](https://github.com/LevelbossMike/ember-statecharts/commit/997bc9e1a97c2999168ae7f1be3402a7ebbce4bd))
* check for passed in machine ([ce31e89](https://github.com/LevelbossMike/ember-statecharts/commit/ce31e8916f391452d43909628d391cf94460d446))
* handle machine creation in useMachine function ([22e35b8](https://github.com/LevelbossMike/ember-statecharts/commit/22e35b8475f2bd0d65427ff788aec4a8c5196fb9))
* Update CHANGELOG.md v0.10.0-beta.0 ([2060e40](https://github.com/LevelbossMike/ember-statecharts/commit/2060e40aa457e594b5f973510c4dd8def8192490))


### Features

* add `.update`-hook for handling usable updates ([fd31747](https://github.com/LevelbossMike/ember-statecharts/commit/fd317472dcff8de372fe5657b6105378b1c04351))
* Add type definitions ([4329796](https://github.com/LevelbossMike/ember-statecharts/commit/4329796c1e75c62a99ae2934d76e87d1d4f490c4))
* expose interpreted machine service ([8065939](https://github.com/LevelbossMike/ember-statecharts/commit/80659398462068d6f209afa2e74412936408e0b7))
* implement `useMachine` ([d7ce532](https://github.com/LevelbossMike/ember-statecharts/commit/d7ce5327d511aa26db9d8ea3a688c60ea4118721))
* support machine configs ([59ff076](https://github.com/LevelbossMike/ember-statecharts/commit/59ff0761813616f047bbefcbddf1540bd9801ae6))
* warn about usable-updates on args/state changes ([d278f97](https://github.com/LevelbossMike/ember-statecharts/commit/d278f976eecbec6e147cf430bf31045bd0643904))

# [0.10.0](https://github.com/LevelbossMike/ember-statecharts/compare/v0.10.0-beta.1...v0.10.0) (2020-06-10)


### Bug Fixes

* `or` not working with new `matchesState` ([118e163](https://github.com/LevelbossMike/ember-statecharts/commit/118e16328f7da96704dc29faab7636841d7c4f2b))

# [0.10.0-beta.1](https://github.com/LevelbossMike/ember-statecharts/compare/v0.9.0...v0.10.0-beta.1) (2020-06-04)


### Bug Fixes

* allow interpreter options to be passed to override devTool / other things if desired (except the clock) ([0fa019a](https://github.com/LevelbossMike/ember-statecharts/commit/0fa019aa545c712c5f2d3e16e2673d443215e6d4))
* check for passed in machine ([2cf1c0f](https://github.com/LevelbossMike/ember-statecharts/commit/2cf1c0fe7f8080a83ccdc835359605e5ebcd9829))
* handle machine creation in useMachine function ([96769be](https://github.com/LevelbossMike/ember-statecharts/commit/96769be9bfae30ee8f1ba32250abf719e5b93b80))
* Update CHANGELOG.md v0.10.0-beta.0 ([84cb5b0](https://github.com/LevelbossMike/ember-statecharts/commit/84cb5b0d1e5804074e28eefef65732fab58d7c4b))


### Features

* Add type definitions ([15569b7](https://github.com/LevelbossMike/ember-statecharts/commit/15569b70169bee6052a5084cab3529ed44114924))
* expose interpreted machine service ([6c63289](https://github.com/LevelbossMike/ember-statecharts/commit/6c63289551d10cb8db3ce957f8ece50d5fc2dd36))
* implement `useMachine` ([b4b2155](https://github.com/LevelbossMike/ember-statecharts/commit/b4b2155dcf453f0f01597232ce845e73aa708c03))
* support machine configs ([c9c471c](https://github.com/LevelbossMike/ember-statecharts/commit/c9c471cd43762fa7f90d28cbfe54f2080b316c5b))
* warn about usable-updates on args/state changes ([85cd021](https://github.com/LevelbossMike/ember-statecharts/commit/85cd021380b89b023ebf5fa8d099c3830b36a0a9))

# Change Log

## [v0.10.0-beta.0](https://github.com/LevelbossMike/ember-statecharts/tree/v0.10.0-beta.0) (2020-05-04)

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
