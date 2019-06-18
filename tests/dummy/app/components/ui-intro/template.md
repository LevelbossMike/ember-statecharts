# Motivation

`ember-statecharts` provides an easy way to use <strong>statecharts</strong> in ember applications. 
This is especially useful in `Ember.Component`-architecture but can be used across all layers of your application - e.g. when implementing global application state backed by an `Ember.Service` that needs to switch your application into a specifc mode based on data that your application receives via push events.

By using <strong>statecharts</strong> you can improve your development workflow in multiple ways:

* <strong>Model behavior explicitly.</strong> Instead of relying on implicit states that you manage by setting properties on your objects you will model your behavior as a set of explicit `state`s that handle events. 
* <strong>Create robust applications that won't break.</strong> Because behavior is only executed when a given state understands an event that is being triggered it is impossible to trigger invalid or unexpected application behavior.
* <strong>Refactor and refine with confidence.</strong> Application flows modeled with statecharts are easy to change without the risk of breaking existing behavior.
* <strong>Document behavior.</strong> Because statecharts can be visualized you finally have a way of communicating about application behavior with stakeholders that don't have a programming background. It will also help fellow developers to reason about behavior in your application.
* <strong>Identify missing requirements.</strong> Because you make use of a visual language that describes behavior it gets very easy to identify holes in requirement documents.