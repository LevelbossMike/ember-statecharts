# Introduction

`ember-statecharts` has been created to **address many of the difficulties** of client-side
application development. Even with an ambitious framework like `Ember.js`
<strong>client-side application development can get very complex</strong> and through many years
of experience we identified several reasons for this being the case:

* **client-side apps are stateful** - client side apps are a system that allows users
to request data from someplace and manipulate it entirely on the user's client device.
Application developers' job is to manage the ui-state created by the user interacting
with the requested data in their applications and make sure to always display
the correct representation of that state to their users.

* This representation of client-side state has to **react continiously to internal and external events**:

  * __Internal events__ - events triggered by the user like clicks, text input etc.
  * __External events__ - events triggered by the outside like server responses,
    web-socket push-events or timers firing.

* **Modeling this behavior is very complex if not done explicitly**. The usual way to
develop client-side applications though is implicit. Developers usually develop
code in an ad-hoc fashion by setting properties based on `actions` on components
and other objects that can hold state. This implicit modeling breaks down fast
even for medium level complexity. Components that implement their behavior
implicitly are hard to reason about, hard to maintain and hard to extend.

* **Discussing behavior is very difficult with other stakeholders**. There's no shared
language between developers, designers and other stakeholders like product-owners.
Thus **a lot of requirements are left unidentified in the requirements phase** of a
development iteration - _loading-states_ are often forgottten and nobody on the team really
can answer the questions how the application should behave when certain events have
happened in the application lifecylce - _"What happens when the the user looses the
server connection during upload?"_ and similiar are questions that come up during
development but not before. This leads to **frustration on teams and missed deadlines**
because so much of the implicit requirements have not been accounted for during planing
phase.

## Statecharts to the rescue
The creators of `ember-statecharts` argue that a way to deal with the difficulties
of  client-side application development is to **use `statecharts` to model your application's behaviors explicitly**:

* The literature has been conclusive in that dynamic **complex behavior is best modeled
as a set of states that react to events** - statecharts are a way of modeling
behavior explicitly in a scalable way even for the most complex behaviors. [Harel 87]

"The behavior of a reactive system is really the set of allowed sequences of
input and output events, conditions, and actions, perhaps with some additional
information such as timing constraints" [Harel 87]

* **Statecharts can be modeled explicitly and are executable**.  Instead of relying
on implicit state management you _model_ behavior as a executable statechart configuration
that makes it is impossible for your application to behave in an unexpected way.

* **With Statecharts it is easy to understand and change existing behavior**. Statecharts are easy
to reason about, refine and maintain because states in statecharts can be extended and nested.

* In addition to explicitly modeling behavior **statecharts can be used to visualize
modeled behavior** and can thus be used to close a gap in client-side-application development
today where it is hard to discuss application behavior with other stakeholders of the application.
Statecharts can be used as an **easy to understand shared language between stakeholders** -
designers, product-owners and developers.

* statecharts can be used as a **modeling tool** in the requirements phase, as an **implementation tool**
in the coding phase and as a debugging and **documentation tool** in the production phase of your application.


## Documenting behavior

Modeling your application behavior explicitly via `ember-statecharts` will give you documenation
of your application behavior for free. Statecharts can be visualized via the [statechart-editor](/editor)
and you will have an easier time to understand components and user-flows by looking at them.

**Visalizing statecharts also gives you the opportunity to communicate about behavior
with other stakeholders** - designers, product-owners and fellow developers. Because you
are modeling behavior explicitly with an executable statechart in your code there is
now **always up-to-date documentation** of how components and other parts of your app behave.

You can step through your behavior with the bundled [statechart-editor](/editor) and have discussions
about how your application behaves based on a visual language that everyone understands.

## ember-statecharts vs. ember-concurrency

**`ember-statecharts` is not a contender to `ember-concurrency`**. Both addons can be used
in combination. `ember-concurrency` gives you a clean api to handle async interactions in
your code and will handle cleanup when components are destroyed. After modeling
the states in your components explicitly for some time you might even come to the conclusion
that the reason why `ember-concurrency` is so great is that it models async interactions
explicitly. But async interactions with apis are not the only complex reactive behavior you will
want to model in your applications explicitly. If you want to model a complex sign-up flow for example
it might include async interaction with your backend api but you will still want to model
the rest of the sign-up flow explicitly and `ember-statecharts` will help you with that.
You can see examples of how to use `ember-concurrency` and `ember-statecharts` in combination in the [quickstart](/docs/quickstart).
