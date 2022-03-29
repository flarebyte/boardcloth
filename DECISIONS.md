# Decisions

## Manage asynchronous tasks

* SHOULD-HAVE.
* Deciders: Olivier
* Created: March 2022

### Context and Problem Statement

The UI will trigger multiple kind of asynchronous tasks that could fail. 
Standardizing the approach for asynchronous tasks could streamline the implementation of these tasks.

### Decision Drivers

* Visibility about which task have succeeded or failed.
* An event driven approach where the same event may trigger different tasks.
* Compatibility with Elm ports.
* Capability to retry a failed task.
* Capability to time-out a task.
* Capability to throttle a task.
* Recording and playing back of events.


### Considered Options
* Observables for JavaScript
* Promise queue with concurrency control
* Reactive Extensions For JavaScript

### Decision Outcome

Chosen option: "Reactive Extensions For JavaScript", because it support current but also future needs in a consistent manner. 

#### Positive Consequences

* Huge flexibility in term of managing tasks and events.
* A reference in the area of pure reactive programming.

#### Negative Consequences

* Steep learning curve and new way of thinking.
* The code may end up been tightly coupled to this library for a long time.

### Pros and Cons of the Options

#### Observables for JavaScript

Observables for JavaScript [zen-observable](https://github.com/zenparsing/zen-observable)

* Reference for a concept that may become part of [javascript](https://github.com/tc39/proposal-observable)
* Pros: 
    * Fairly simple, with a small learning curve.
    * May be become part of javascript
* Cons:
    * No support for advanced cases such as throttling, time-out, retry

#### Promise queue with concurrency control

[Promise queue with concurrency control](https://github.com/sindresorhus/p-queue)

* Pros:
    * Support for rate-limiting async (or sync) operations

* Cons:
    * It is a queue not a topic, so you cannot subscribe multiple times.
    * No filtering optionss


#### Reactive Extensions For JavaScript

RxJS, [Reactive Extensions For JavaScript](https://github.com/ReactiveX/rxjs), is a library for reactive programming using Observables, to make it easier to compose asynchronous or callback-based code.

* Pros:
    * Follow the Observable Spec Proposal to the observable.
    * Mature library that is a reference in the field of Reactive programming.
    * Ability to produce values using pure functions.
    * Multicast an event to multiple Observers.
    * [Advanced scheduling](https://rxjs.dev/guide/scheduler) (time-based, priority-based, after another task)

* Cons:
    * Steep learning curve.
    * Medium weight library.
    * Initially designed with Java in mind.
