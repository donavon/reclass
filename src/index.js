import React from 'react';

const buildCtx = (that) => {
  const setState = that.setState.bind(that);
  return {
    setState,
    get state() { return that.state; },
    set state(value) { setState(value); },
    get props() { return that.props; },
    get context() { return that.context; },
  };
};

export default (factory) => {
  const Component = class extends React.Component {
    static displayName = factory.name;

    constructor(props) {
      super(props);
      const ctx = buildCtx(this);
      const { render, ...properties } = factory(ctx);
      Object.assign(this, properties);
      this.render = (...futureArgs) => (
        render(this.props, this.state, this.context, ...futureArgs)
      );
    }
  };

  Object.assign(Component, factory);

  return Component;
};
