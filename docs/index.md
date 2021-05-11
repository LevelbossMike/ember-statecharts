# Introduction

<div class="my-6 font-serif prose">
<blockquote class="mb-4">
  <div class="relative mx-4 text-serif text-large-1">
    {{svg-jar "quote" class="absolute top-0 left-0 w-12 h-12 text-gray-200 opacity-80 transform -translate-x-3 -translate-y-4"}}
    <div class="relative my-5 lg:text-lg">
      <span>
        There are three things that are certain with any software development
        project:
      </span>
      <ol>
        <li>
          A complete and consistent set of requirements will not be captured
          before the design and coding starts.
        </li>
        <li>
          The requirements will change during the lifetime of the project.
        </li>
        <li>
          The user interface is more likely to change than any other part of the
          system.
        </li>
      </ol>
    </div>
  </div>
  <div class="flex ml-12 -mt-3">
    <div class="text-grey-light">–</div>
    <a href="#horrocks" class="ml-2 md__a">Ian Horrocks, Constructing the User Interface with Statecharts</a>
  </div>
</blockquote>
</div>

`ember-statecharts` has been created to **address many of the difficulties** of client-side application development. Even with an ambitious framework like `Ember.js`, <strong>client-side application development can get very complex</strong> and there are several reasons for this being the case:

* **client-side apps are stateful** - client-side apps are a system that allows users to request data from someplace and manipulate it entirely on the user's client device. Application developers' job is to manage the UI-state created by the user interacting with the requested data in their applications and make sure to always display the correct representation of that state to their users.

* **We are building complex reactive systems** because the representation of client-side state has to **react continuously to internal and external events**:

  * __Internal events__ - events triggered by the user like clicks, text input etc.
  * __External events__ - events triggered by the outside like server responses, web-socket push-events or timers firing.

* **Modeling this behavior is very complex if not done explicitly**. The usual way to develop client-side applications though is implicit. Developers usually develop code in an ad-hoc fashion by setting properties based on `actions` on components and other objects that can hold state. This implicit modeling breaks down fast even for medium-level complexity. Components that implement their behavior implicitly are hard to reason about, hard to maintain, and hard to extend. [[Horrocks 99]](#horrocks)

* **Discussing behavior is very difficult with other stakeholders**. There's no shared language between developers, designers, and other stakeholders like product owners. Thus **a lot of requirements are left unidentified in the requirements phase** of a development iteration - _loading-states_ are often forgotten and nobody on the team really can answer questions about how the application should behave when certain events have happened in the application lifecycle - _"What happens when the user loses the server connection during upload?"_ and similar are questions that come up during development but not before. This leads to **frustration on teams and missed deadlines** because so much of the implicit requirements have not been accounted for during the planning phase.

## Statecharts to the rescue
A way to deal with the difficulties of  client-side application development is to **use `statecharts` to model your application's behaviors explicitly**:

* The literature has been conclusive in that dynamic **complex behavior is best modeled as a set of states that react to events** - statecharts are a way of modeling behavior explicitly in a scalable way even for the most complex behaviors. [[Harel 87]](#harel)

<div class="font-serif prose">
<blockquote class="mb-4">
    <div class="relative mx-4 text-serif text-large-1">
    {{svg-jar "quote" class="absolute top-0 left-0 w-12 h-12 text-gray-200 opacity-80 transform -translate-x-3 -translate-y-4"}}
    <div class="relative my-5 lg:text-lg">
      The behavior of a reactive system is really the set of allowed sequences of
      input and output events, conditions, and actions, perhaps with some additional
      information such as timing constraints.
    </div>
  </div>
  <div class="flex ml-12 -mt-3">
    <div class="text-grey-light">–</div>
    <a href="#harel" class="ml-2 md__a">David Harel, Statecharts: a visual formalism for complex systems</a>
  </div>
</blockquote>
</div>

* **Statecharts can be modeled explicitly and are executable**.  Instead of relying on implicit state management, you _model_ behavior as an executable statechart configuration that makes it impossible for your application to behave in unexpected ways.

* **With Statecharts it is easy to understand and change existing behavior**. Statecharts are easy to reason about, refine and maintain because states in statecharts can be extended and nested.

* In addition to explicitly modeling behavior **statecharts can be used to visualize modeled behavior** and can thus be used to close a gap in client-side application development today where it is hard to discuss application behavior with other stakeholders. Statecharts can be used as an **easy-to-understand shared language between stakeholders** - designers, product owners, and developers.

* Statecharts can be used as a **modeling tool** in the requirements phase, as an **implementation tool** in the coding phase, and as a debugging and **documentation tool** in the production phase of your application.


## Documenting behavior

Modeling your application behavior explicitly via `ember-statecharts` will give you documentation
of your application behavior for free. Statecharts can be visualized via the [XState-visualizer](https://xstate.js.org/viz/)
and you will have an easier time understanding components and user-flows by looking at them.

<div class="my-12 prose">
  <figure>
    <iframe
      src="https://xstate.js.org/viz/?gist=1b7e330cb49ccc3367b293651fa89377&embed=1"
      class="w-full my-12 border h-128 rounded-md prose"
    >
    </iframe>
    <figcaption>
      <span class="align-middle">An example of a statechart modeling button behavior in the </span>
      <a
        href='https://xstate.js.org/viz/'
        target='_blank'
        rel='noopener noreferrer'
        class="hover:text-gray-700"
      >
        {{svg-jar
          'xstate'
          class='inline w-16 h-8 align-middle fill-current'
        }}
        <span class="align-middle">visualizer</span>
      </a>
    </figcaption>
  </figure>
</div>

**Visualizing statecharts also allows you to communicate about behavior
with other stakeholders** - designers, product owners, and fellow developers. Because you
are modeling behavior explicitly with an executable statechart in your code there is
now **always up-to-date documentation** of how components and other parts of your app behave.

You can step through your behavior with the [XState-visualizer](https://xstate.js.org/viz/) and have discussions
about how your application behaves based on a visual language that everyone understands.

## Powered by XState

`ember-statecharts` provides a small Ember.js-specific wrapper around the fabulous
and widely-used [XState](https://xstate.js.org/docs/)-library. All of the  powerful
features of `XState` are supported. The purpose of `ember-statecharts` is to
make it easy to use `XState` in an Ember.js application without having
to write the same boilerplate code over and over again.

## ember-statecharts vs. ember-concurrency

**`ember-statecharts` is not a contender to `ember-concurrency`**. Both addons can be used
in combination. `ember-concurrency` gives you a clean API to handle async interactions in
your code and will handle cleanup when components are destroyed. After modeling
the states in your components explicitly for some time you might even come to the conclusion
that the reason why `ember-concurrency` is so great is that it models async interactions
explicitly. But async interactions with APIs are not the only complex reactive behavior you will
want to model in your applications explicitly. If you want to model a complex sign-up flow for example
it might include async interaction with your backend API but you will still want to model
the rest of the sign-up flow explicitly and `ember-statecharts` will help you with that.
You can see examples of how to use `ember-concurrency` and `ember-statecharts` in combination in the [tutorial](/docs/tutorial).

## References

[<a name="harel">[Harel 87]</a> D. Harel, Statecharts: a visual formalism for complex systems, Science of Computer Programming, Volume 8, Issue 3, June 1987, Pages 231-274](https://www.sciencedirect.com/science/article/pii/0167642387900359)

[<a name="horrocks">[Horrocks 99]</a> I. Horrocks, Constructing the User Interface with Statecharts, Addison-Wesley, 1999](https://books.google.no/books/about/Constructing_the_User_Interface_with_Sta.html?id=-9VQAAAAMAAJ&redir_esc=y&hl=en)
