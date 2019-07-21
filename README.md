# TypeScript API Boilerplate

![](https://img.shields.io/gitlab/pipeline/ProFL/ts-api-boilerplate/develop.svg)

Table of Contents

<!-- TOC -->

- [TypeScript API Boilerplate](#typescript-api-boilerplate)
  - [Who is this for](#who-is-this-for)
    - [Building blocks](#building-blocks)
  - [How to use](#how-to-use)
    - [Useful commands](#useful-commands)
    - [File structure](#file-structure)
    - [Controller Decorators](#controller-decorators)

<!-- /TOC -->

This project stands to be a ready to use TypeScript boilerplate
for an API project, ready with an ORM and a pre-configured development environment as well as a kick-off docker setup.

## Who is this for

This project is meant to be used by experienced Node.js developers who have gotten fed up of writing repetitive code, or for beginner developers who want to take a look on how to solve this kind of problem in Node.js with TypeScript and so on.

### Building blocks

In this section I will give my 2 cents on why I choose many of the components of this project, maybe this will help you decide whether this is the right boilerplate for you or not.

- [ ] TODO: Rant about my own choices

## How to use

This guide will not cover the very basic, so seek other resources if you ever feel at lost, some external references will be made.

For starters, take a look at [TypeORM](https://typeorm.io/#/)'s documentation as it is the ORM of this project and also a CLI provider for ORM related operations. Also, if you're new to [TypeScript](https://www.typescriptlang.org/samples/index.html), you might want to check their docs.

This project is also setup to use with [Docker](https://docs.docker.com/get-started/) and [yarn](https://yarnpkg.com/lang/en/docs/getting-started/) package manager, read something about these guys too.

You'll also notice the structure is strongly inspired by many of the popular MVC frameworks out there, and might also notice they're all pretty similar among each other, and that is good, standards are good, they make life easier ~~most of the time~~. This boilerplate in particular has no "V"iew component, but it can easily be added and if necessary I would recommend using [pug](https://pugjs.org/api/getting-started.html). Although this boilerplate is more directed towards APIs to use with standalone frontends, at the very least, some fine tuning should be made on passport to adjust to monolithic MVC needs.

### Useful commands

- [ ] TODO: Explain some of the useful commands from `package.json`

### File structure

- [ ] TODO: Explain the file structure

### Controller Decorators

- [ ] TODO: Explain the decorators wrote to be used with this boilerplate and how to use them
