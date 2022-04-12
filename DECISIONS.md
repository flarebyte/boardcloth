# Decisions

## Manage asynchronous tasks

-   SHOULD-HAVE.
-   Deciders: Olivier
-   Created: March 2022

### Context and Problem Statement

The UI will trigger multiple kind of asynchronous tasks that could fail.
Standardizing the approach for asynchronous tasks could streamline the
implementation of these tasks.

### Decision Drivers

-   Visibility about which task have succeeded or failed.
-   An event driven approach where the same event may trigger different
    tasks.
-   Compatibility with Elm ports.
-   Capability to retry a failed task.
-   Capability to time-out a task.
-   Capability to throttle a task.
-   Recording and playing back of events.

### Considered Options

-   Observables for JavaScript
-   Promise queue with concurrency control
-   Reactive Extensions For JavaScript

### Decision Outcome

Chosen option: "Reactive Extensions For JavaScript", because it support
current but also future needs in a consistent manner.

#### Positive Consequences

-   Huge flexibility in term of managing tasks and events.
-   A reference in the area of pure reactive programming.

#### Negative Consequences

-   Steep learning curve and new way of thinking.
-   The code may end up been tightly coupled to this library for a long
    time.

### Pros and Cons of the Options

#### Observables for JavaScript

Observables for JavaScript
[zen-observable](https://github.com/zenparsing/zen-observable)

-   Reference for a concept that may become part of
    [javascript](https://github.com/tc39/proposal-observable)
-   Pros:
    -   Fairly simple, with a small learning curve.
    -   May be become part of javascript
-   Cons:
    -   No support for advanced cases such as throttling, time-out, retry

#### Promise queue with concurrency control

[Promise queue with concurrency
control](https://github.com/sindresorhus/p-queue)

-   Pros:

    -   Support for rate-limiting async (or sync) operations

-   Cons:
    -   It is a queue not a topic, so you cannot subscribe multiple times.
    -   No filtering optionss

#### Reactive Extensions For JavaScript

RxJS, [Reactive Extensions For
JavaScript](https://github.com/ReactiveX/rxjs), is a library for reactive
programming using Observables, to make it easier to compose asynchronous or
callback-based code.

-   Pros:

    -   Follow the Observable Spec Proposal to the observable.
    -   Mature library that is a reference in the field of Reactive
        programming.
    -   Ability to produce values using pure functions.
    -   Multicast an event to multiple Observers.
    -   [Advanced scheduling](https://rxjs.dev/guide/scheduler) (time-based,
        priority-based, after another task)

-   Cons:
    -   Steep learning curve.
    -   Medium weight library.
    -   Initially designed with Java in mind.

# Document size

-   Status: proposed
-   Deciders: Olivier
-   Created: April 2022

## Context and Problem Statement

A user will be working alone or collaboratively on a document. This document
could be of any size, but the size will impact the technology that will be
required.

## Decision Drivers

-   Possibility of working offline.
-   Complexity of the solution.
-   Range of business features offered by the solution.

## Considered Options

-   Document would fit in memory
-   Document may not fit in memory

## Decision Outcome

Chosen option: "Document would fit in memory ", because it simplifies the
design.

### Positive Consequences

-   A version of the application that works offline is then possible.
-   Simpler design.

### Negative Consequences

-   This will restrict the size of documents.

### Mitigations

-   Group of documents could be assembled to create a larger document.

## Pros and Cons of the Options

### Document would fit in memory

Any document will fit in memory

-   Good, because:
    -   basic data structures are sufficient to store the document.
    -   enable more processing and capabilities on the client side (ex: search
        ..)
    -   Many features can be available offline.
-   Bad, because:
    -   some complex documents will not be supported: a chapter may be
        supported but probably not a book.
    -   documents with embedded media will not be supported.

***

### Document may not fit in memory

Any document would not automatically fit in memory

-   Good, because:
    -   it will make it possible to work on very long document or even on news
        stream.
-   Bad, because:
    -   complex algorithms are required to manage caching and the refreshing of
        cache.
    -   it assumes that the user is always online.
    -   it require backend services from the start, and regular synchronization
        with these services.

***

# History and undo

-   Status: proposed
-   Deciders: Olivier

## Context and Problem Statement

When updating a field, the previous value in the field could be stored in a
history log. This history could be available for information, or potentially
for rolling back a field value to a previous value (undo).

## Decision Drivers

-   Cost/benefits of the solution.

## Considered Options

-   Manage history locally
-   Manage history remotely

## Decision Outcome

Chosen option: "Manage history remotely", because it simplifies the design.

### Positive Consequences

-   The client does not deal with the complexity of history directly.

### Negative Consequences

-   Intermediate history is not supported.
-   it is no longer a personal history but a collective history

## Pros and Cons of the Options

### Manage history locally

Manage the history along side the current document

-   Good, because:
    -   everything can work offline
    -   may make `undo` easier to implement
-   Bad, because:
    -   history increases the size of the content to store offline.
    -   may lead to a more complex implementation.

***

### Manage history remotely

Management the history of a field remotely

-   Good, because:
    -   lighter approach of the client side.
    -   lighter content to store on the client side.
    -   more advanced technology available on the server side (ex: db).
-   Bad, because:
    -   require a request for read and write to the history

***

# Record status

-   Status: proposed
-   Deciders: Olivier

## Context and Problem Statement

Messages and records will typically vary between different status.
For example, a record may go from `draft` to `published`.
A record could have multiple status at once. For example, `published` and
`archived` and `remotely-updated`. A status may also represent a transient
state, for example the current hash value that could be used to compare with
an remote hash value.

Note: status may not be the best name to represent all these cases, but in
some ways, we want to represent a transient state for a record.

## Decision Drivers

-   Facilitate future synchronization with multiple users.
-   Feedback to the user (or developer) when something goes wrong.
-   Make it easier to act on failure (ex: retry, message, ...)

## Considered Options

-   status stored along side record
-   status stored separately

## Decision Outcome

Chosen option: "status stored separately", because

### Positive Consequences

-   centralize the way to manage status
-   the model for status can easily evolve
-   the status information does not have to be stored in the record, which
    is great (hopefully) for transient information.

### Negative Consequences

-   more effort upfront.

## Pros and Cons of the Options

### status stored along side record

The status is stored as a field (or several fields) as part of the record.

-   Good, because:
    -   it simplifies the model. One model to rule them all.
-   Bad, because:
    -   some transient information may be stored with the records, and may be
        later seen as noise later on.
    -   transient concerns may be hard coded in the model while still be
        different for different types of records.
    -   if the the model for the status evolves, old records may have to be
        upgraded.

***

### status stored separately

The status for the record is stored separately and map against an id.

-   Good, because:
    -   the model for the status can evolve independently from the model of the
        record.
    -   centralize the way to deal with status.
    -   the status could be used to indicate remote changes. For instance, when
        a field is updated remotely but not yet locally.
-   Bad, because:
    -   require to design a solution for status early on.

***

# Content relationships and dependencies

-   Status: proposed
-   Deciders: Olivier

## Context and Problem Statement

A document can contain sections and multiple documents can be related.
Formalizing these relationships early may bring some benefits but also many
challenges.

## Decision Drivers

-   Cost benefits of the solution.

## Considered Options

-   No standardized dependencies
-   Dependencies between a document and its children
-   Dependencies between documents
-   Documents share relationships with children

## Decision Outcome

Chosen option: "Dependencies between a document and its children" and
"Documents share relationships with children", because of the flexibility of
the solution. For offline work, sharing records is probably not too relevant
but it may become for collaborative work. We may want to identify a record as
shareable or not.

### Positive Consequences

-   we can notify documents when a child is updated remotely.

### Negative Consequences

-   most of this work is mostly needed for collaboration, and would not be
    required for just an offline solution.

## Pros and Cons of the Options

### No standardized dependencies

There are no formal representation of dependencies between documents and
records

-   Good, because:
    -   decisions about relationships is postponed until the problem is well
        understood.
-   Bad, because:
    -   the lack of standard approach may lead to more complicated solution.

***

### Dependencies between a document and its children

There are formal dependencies between a document and its children.
For instance, a spreadsheet and the rows.

-   Good, because:
    -   this relationship is expected, and will require some effort at some
        point in time.
    -   could make it easier to update the parent when the child is updated.
-   Bad, because:
    -   not all children may be of the same type, and this may require a
        different behaviour.
    -   a child may have children of its own, and it may matter.

***

### Dependencies between documents

There are formal dependencies between different documents.
For example, a book may be composed of several chapters.

-   Good, because:
    -   more advanced documents could be managed.
-   Bad, because:
    -   a user is not interested in a list of documents, but rather in the more
        complex document (ex: book), and this is a document that should have a
        specific structure and requirements.

***

### Documents share relationships with children

Multiple documents can share the same children records. In other words, the
same record may be shared by multiple documents.

-   Good, because:
    -   common records can be updated in one place.
    -   possible to create documents that represent the assembly between
        several live documents.
-   Bad, because:
    -   more relevant for collaborative work where we have a backend server.
    -   increase the complexity
