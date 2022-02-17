# Maintenance of the code

## Overall workflow

The typical developer workflow goes as follow:

| Mode                   | Code analysis | Testing                    | Building     | Publishing                        |
| ---------------------- | ------------- | -------------------------- | ------------ | --------------------------------- |
| Checking               | yarn lint     | yarn test or yarn test:cov | yarn build   | yarn ready and yarn release:check |
| Fixing                 | yarn lint:fix | yarn test:fix              | Fix the code | Update dependencies and yarn doc  |
| Continuous integration | yarn lint:ci  | yarn test:ci               | yarn build   | bpub                              |

## Commands

### Run GitHub Actions locally

> Run GitHub Actions inside a docker container

**Motivation:** Test GitHub Actions locally

**When to use it:** When changing github actions

**Run:** `act`

**From package:** [act](https://github.com/nektos/act) of
[brew](https://docs.brew.sh/) : Run GitHub Actions locally

***

### Build the library

> Transpile all the typescript source code to javascript

**Motivation:** ESM library should be written in javascript

**When to use it:** Before building

**Run:** `yarn build`

**From package:** [yarn](https://classic.yarnpkg.com/en/) of
[npm](https://www.npmjs.com/) : Dependency management

***

### Generate the documentation

> Generate the markdown documentation for the typescript project

**Motivation:** Good documentation is essential for developer experience

**When to use it:** Before publishing

**Run:** `yarn doc`

**From package:** [yarn](https://classic.yarnpkg.com/en/) of
[npm](https://www.npmjs.com/) : Dependency management

***

### Update github repository

> Enable useful features for the github project repository

**Motivation:** Create consistent settings

**When to use it:** After creating

**Run:** `yarn github`

**From package:** [gh](https://cli.github.com/) of
[brew](https://docs.brew.sh/) : GitHub CLI brings GitHub to your terminal

***

### Static code analysis for continuous integration

> Find problems in Typescript code

**Motivation:** Make the code more consistent and avoid bugs

**When to use it:** When pushing code to github, before testing

**Run:** `yarn lint:ci`

**From package:** [baldrick](https://github.com/flarebyte/baldrick-dev-ts) of
[npm](https://www.npmjs.com/) : Zero-config CLI for TypeScript package
development

***

### Static code analysis

> Find problems in Typescript code

**Motivation:** Make the code more consistent and avoid bugs

**When to use it:** Before compilation

**Run:** `yarn lint`

**From package:** [baldrick](https://github.com/flarebyte/baldrick-dev-ts) of
[npm](https://www.npmjs.com/) : Zero-config CLI for TypeScript package
development

***

### Fix static code analysis

> Fix problems in Typescript code

**Motivation:** Facilitate routine maintenance of code

**When to use it:** Before compilation

**Run:** `yarn lint:fix`

**From package:** [baldrick](https://github.com/flarebyte/baldrick-dev-ts) of
[npm](https://www.npmjs.com/) : Zero-config CLI for TypeScript package
development

***

### Markdown check

> Checks that the markdown documents follows some consistent guidelines

**Motivation:** Make the markdown documents consistent in style

**When to use it:** Before publishing

**Run:** `yarn md`

**From package:** [yarn](https://classic.yarnpkg.com/en/) of
[npm](https://www.npmjs.com/) : Dependency management

***

### Markdown fix

> Modify the markdown documents to ensure they follow some consistent
> guidelines

**Motivation:** Make the markdown documents consistent in style

**When to use it:** Before publishing

**Run:** `yarn md:fix`

**From package:** [yarn](https://classic.yarnpkg.com/en/) of
[npm](https://www.npmjs.com/) : Dependency management

***

### Clear previous build

> Delete the dist and report folder

**Motivation:** Start from a clean slate

**When to use it:** Before building

**Run:** `yarn prebuild`

**From package:** [yarn](https://classic.yarnpkg.com/en/) of
[npm](https://www.npmjs.com/) : Dependency management

***

### Ready for publishing

> Run a sequence of commands to check that the library is ready to be
> published

**Motivation:** Detect quality flaws before pushing the code

**When to use it:** Before pushing a branch

**Run:** `yarn ready`

**From package:** [yarn](https://classic.yarnpkg.com/en/) of
[npm](https://www.npmjs.com/) : Dependency management

***

### Reset distribution and report folders

> Delete the dist and report folder

**Motivation:** Start from a clean slate

**When to use it:** Before building

**Run:** `yarn reset`

**From package:** [yarn](https://classic.yarnpkg.com/en/) of
[npm](https://www.npmjs.com/) : Dependency management

***

### Unit testing code and coverage for continuous integration

> Test and verify the coverage of the code

**Motivation:** Check that the units of code behave as intended and ensure
that every code branch and function is executed

**When to use it:** When pushing code to github

**Run:** `yarn test:ci`

**From package:** [baldrick](https://github.com/flarebyte/baldrick-dev-ts) of
[npm](https://www.npmjs.com/) : Zero-config CLI for TypeScript package
development

***

### Unit testing

> Run the unit tests

**Motivation:** Check that the units of code behave as intended

**When to use it:** After compilation, before build

**Run:** `yarn test`

**From package:** [baldrick](https://github.com/flarebyte/baldrick-dev-ts) of
[npm](https://www.npmjs.com/) : Zero-config CLI for TypeScript package
development

***

### Unit testing code coverage

> Verify the extent to which the code has been executed. This does not
> include any threshold, but it is recommended to maximize the coverage

**Motivation:** Ensure that every code branch and function is executed

**When to use it:** After compilation, before build

**Run:** `yarn test:cov`

**From package:** [baldrick](https://github.com/flarebyte/baldrick-dev-ts) of
[npm](https://www.npmjs.com/) : Zero-config CLI for TypeScript package
development

***

### Fix unit testing snapshots

> Run the unit tests and update the snapshots

**Motivation:** Facilitate routine maintenance of unit test snapshots

**When to use it:** After compilation, before build

**Run:** `yarn test:fix`

**From package:** [baldrick](https://github.com/flarebyte/baldrick-dev-ts) of
[npm](https://www.npmjs.com/) : Zero-config CLI for TypeScript package
development

***

### Release check

> Checks if a release could be created

**Motivation:** Avoid failing the release

**When to use it:** After publishing

**Run:** `yarn release:check`

**From package:** [baldrick](https://github.com/flarebyte/baldrick-dev-ts) of
[npm](https://www.npmjs.com/) : Zero-config CLI for TypeScript package
development

***

### Release

> Creates a github release

**Motivation:** Save releases in github

**When to use it:** After publishing

**Run:** `bpub`

**From package:** [baldrick](https://github.com/flarebyte/baldrick-dev-ts) of
[npm](https://www.npmjs.com/) : Zero-config CLI for TypeScript package
development

***

### Help for commands

> Summarize all the yarn and shell commands

**Motivation:** Assist the developer in quickly finding commands

**When to use it:** Before running a command

**Run:** `yarn h`

**From package:** [baldrick](https://github.com/flarebyte/baldrick-dev-ts) of
[npm](https://www.npmjs.com/) : Zero-config CLI for TypeScript package
development

***

### Git commit from file

> Git commit a message that has been saved in the .message file

**Motivation:** Quicker commit for pre-defined use cases

**When to use it:** When commit to github

**Run:** `gcf`

**From package:** [zsh](https://www.zsh.org/) of
[brew](https://docs.brew.sh/) : Shell designed for interactive use

***

### Install the local project globally

> Install this local project/script globally on the dev machine for
> development or testing purpose

**Motivation:** Test global project locally before publishing

**When to use it:** When testing locally

**Run:** `yig`

**From package:** [yarn](https://classic.yarnpkg.com/en/) of
[npm](https://www.npmjs.com/) : Dependency management

***

### Normalize the code structure using latest

> Normalize the code structure using baldrick (npx version)

**Motivation:** Create a consistent developer experience

**When to use it:** When changing github actions

**Run:** `yarn norm`

**From package:** [baldrick-ts](https://github.com/flarebyte/baldrick-ts) of
[npm](https://www.npmjs.com/) : Typescript scaffolding assistant

***

### Normalize the code structure

> Normalize the code structure using baldrick (global version)

**Motivation:** Create a consistent developer experience

**When to use it:** When changing github actions

**Run:** `yarn norm:g`

**From package:** [baldrick-ts](https://github.com/flarebyte/baldrick-ts) of
[npm](https://www.npmjs.com/) : Typescript scaffolding assistant

***
