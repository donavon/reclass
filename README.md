# reclass

[![Build Status](https://travis-ci.org/donavon/reclass.svg?branch=master)](https://travis-ci.org/donavon/reclass)
[![npm version](https://img.shields.io/npm/v/reclass.svg)](https://www.npmjs.com/package/reclass)
[![Coverage Status](https://coveralls.io/repos/github/donavon/reclass/badge.svg?branch=master)](https://coveralls.io/github/donavon/reclass?branch=master)

TL;DR

* Write React stateful components without worrying about `this` or binding methods.
* No more `this.myMethod = this.myMethod.bind(this);`. Whatz!?
* Write your methods using ES6 "fat arrow" functions.
* A no-frill/smaller footprint alternative to
[recompose](https://github.com/acdlite/recompose).

## Install
```bash
$ npm i --save reclass
```

## Usage

```js
import React from 'react';
import reclass from 'reclass';

const MyComponent = (ctx) => {
  const { setState } = ctx;

  const clickHandler = () => {
    setState({...});
  };

  const render = (props, state, context) => (
    ...
    <RenderSomething onClick={clickHandler} />
  );

  return {
    state: {...},
    render,
  };
};

export default reclass(MyComponent);
```

Let's break it down...

First of all, you write your stateful component as a simple JavaScript function and NOT an ES6 class.
This function is responsible for doing a few things:

- Accepts a `ctx` context object as an argument (see explaination of `ctx` below).

  ```js
  const MyComponent = (ctx) => {
  ```

- Returns a `properties` object which defines your component. At a minimun, you'll probably want to return a `render` function and a `state` object that represents your component's initial state.

  ```js
  return { // Return initial state and public methods
    state: {...}, // Initial state
    render,
  };
  ```

- Exposes optional static `propTypes` and `defaultProps` properties.

  ```js
  MyComponent.propTypes = {
    ...
  };

  MyComponent.defaultProps = {
    ...
  };
  ```

Before you export your component, you wrap it using `reclass`.
```js
export default reclass(MyComponent);
```

### The `ctx` argument

You will be passed a `ctx` object with the following properties and methods:

- **setState** - This is the same `setState` that you are used to, but you can forget the `this`.

  >💡 Pro Tip: Destructure `setState` for ease of use.

  Example:
  ```js
  const MyComponent = (ctx) => {
    const { setState } = ctx;
    ...
    setState({ partial });
  ```

- **state** - A getter/setter for `state`. As a getter, this is same as `this.state`.
Note that both `props` are `state` and passed to `render`,
so, depending on your applications you may not need to access these from `ctx` directly.

  >💡 Pro Tip: With `reclass`, you can set `state` directly without consequence. You can use this instead of calling `setState`.

  Example:
  ```js
  const MyComponent = (ctx) => {
    ...
    ctx.state = { partial }; // same as setState({ partial });
  ```

- **props** - A getter for `props`.

- **context** - A getter for `context`.

## render

In all likelihood, you will have a `render` method.
`render` works exactly as you might expect, except that you are passed
`props`, `state`, and `context`.

>💡 Pro Tip: You can destructure `props`, `state`, and `context` inline as parameters.

Example:
```js
const render = ({ someProp }, { someStateValue }) => (
  ...
);
```

You will also notice that your `render` method (all methods for that fact)
can be written in ES6 "fat arrow" style.

## Example

Below is an example of a 'Greeter' component written using `reclass`.
You can see it running live on
[CodeSandbox](https://codesandbox.io/s/DRz5p2W8y).

```js
import React from 'react';
import PropTypes from 'prop-types';
import reclass from 'reclass';
import GreeterView from './GreeterView';

const Greeter = (ctx) => {
  const changeName = (name) => {
    ctx.state = { name };
  };

  const render = ({ greeting }, { name }) => (
    <GreeterView
      greeting={greeting}
      name={name}
      onNameChange={changeName}
    />
  );

  return {
    state: { name: 'John' }, // Initial state
    render,
  };
};

Greeter.propTypes = {
  greeting: PropTypes.string,
};

Greeter.defaultProps = {
  greeting: '',
};

export default reclass(Greeter);
```

## Really?

OK. Adding all of that code in a closure doesn't come without a price.
It can use more memory than class-based components where methods are on the prototype
and not on each class instance. There are a few things that make this moot.

If you have a component that has hundreds or even thousands of instances, this will be a factor.
But if you have only a few instances, or even a single instance, this isn't a concern.

In any case, I suggest that you follow the
[Single Responsibility Principle](https://en.wikipedia.org/wiki/Single_responsibility_principle) and break out
the rendering responsibility from the state management responsibility.
Rendering, therefore, can he handled in a
stateless functional component. See an example of this
[here](https://codesandbox.io/s/DRz5p2W8y).
