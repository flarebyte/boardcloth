# Technical Design

> Guide for the implementation, including detailed design, priorities,
> coding conventions, and testing

-   We aim to be reactive by using "Reactive Extensions For JavaScript".
    This library is meant to be the flip side of the "Elm" coin.
-   A document should fit in memory. This way a version of the application
    that works offline is possible.
-   Status for a record is stored separately because this way the model for
    status can contain transient information and easily evolve without
    polluting the persistent model.
-   Formal dependencies between a document and its children so we could
    update the parent when the child is updated.
-   A child record is identified by a composed id (ex: x,y) because the id
    is more predictable
    and this is useful for collaboration.
-   A list of results is represented as a "batch of messages", because it
    looks like it will keep
    the model and the algorithms simpler.
-   Keep all the plugins in this project because the project is very
    experimental and we are not too sure yet of the best approaches.

## Code structure

-   **src**: Typescript source code

-   **test**: Jest unit tests

-   **dist**: Temporary folder for building distribution code

-   **report**: Temporary folder for reporting; usually for continuous
    integration

-   **.github**: Folder for github pipeline

-   **.vscode**: Folder for visual code snippets

## Useful links

-   Guideline for [Clean Code in
    Typescript](https://labs42io.github.io/clean-code-typescript/)

-   [Supporting node.js ESM](https://the-guild.dev/blog/support-nodejs-esm)
