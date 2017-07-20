import React from 'react';

const buildCtx = (that) => {
  const setState = that.setState.bind(that);
  const ctx = {
    setState,
  };

  Object.defineProperties(ctx, {
    state: {
      get: () => that.state,
      set: setState,
    },
    props: {
      get: () => that.props,
    },
    context: {
      get: () => that.context,
    },
  });

  return ctx;
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
