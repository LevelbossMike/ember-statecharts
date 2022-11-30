---
'ember-statecharts': patch
---

[#392 Avoid changing state property](https://github.com/LevelbossMike/ember-statecharts/pull/392) - [miguelcobain](https://github.com/miguelcobain)

Make sure to only update the resources `state`-property when the state actually changed. This makes sure
we don't trigger reactive getters unnecessarily.

See [Xstate-Transitions docs](https://xstate.js.org/docs/guides/interpretation.html#transitions) for reference.
