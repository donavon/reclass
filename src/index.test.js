import reclass from './';

let myComponentProps;
let myComponentState;
let myComponentContext;
let ctx;
const state = { foo: 'bar' };

const MyComponent = (that) => {
  ctx = that;

  return {
    state,
    render: (renderProps, renderState, renderContext) => {
      myComponentProps = renderProps;
      myComponentState = renderState;
      myComponentContext = renderContext;
      return null;
    },
  };
};

describe('reclass', () => {
  test('is a function', () => {
    expect(typeof reclass).toBe('function');
  });
  describe('when passed a component', () => {
    const Reclassed = reclass(MyComponent);
    test('returns a class', () => {
      expect(typeof Reclassed).toBe('function');
    });
    describe('that when instanciated with MyComponent', () => {
      const props = {};
      const context = {};
      const instance = new Reclassed(props, context);
      test('returns an instance', () => {
        expect(typeof instance).toBe('object');
      });
      // test('with the ', () => {
      //   expect(instance).toEqual(keys);
      // });
      describe('MyComponent is called with ctx', () => {
        test('ctx is an object', () => {
          expect(typeof ctx).toBe('object');
        });
        test('with a "setState" function', () => {
          expect('setState' in ctx).toBe(true);
          expect(typeof ctx.setState).toBe('function');
        });
        test('with a "props" getter', () => {
          expect('props' in ctx).toBe(true);
          expect(ctx.props).toBe(props);
        });
        test('with a "state" getter', () => {
          expect('state' in ctx).toBe(true);
          expect(ctx.state).toBe(state);
        });
        test('with a "state" setter', () => {
          // NOTE this produces a warning and is a noop
          // eslint-disable-next-line no-console
          console.log('*** IGNORE the following error. It is expected. ***');
          ctx.state = { foo: 'baz' };
          expect(ctx.state).toBe(state);
        });
        test('with a "context" getter', () => {
          expect('context' in ctx).toBe(true);
          expect(ctx.context).toBe(context);
        });
      });
      describe('with a "context" property', () => {
        test('equal to that sent to the constructor', () => {
          expect('context' in instance).toBe(true);
          expect(instance.context).toBe(context);
        });
      });
      describe('with a "props" property', () => {
        test('equal to that sent to the constructor', () => {
          expect('context' in instance).toBe(true);
          expect(instance.props).toBe(props);
        });
      });
      describe('with a "refs" property', () => {
        test('that is an object', () => {
          expect('refs' in instance).toBe(true);
          expect(typeof instance.refs).toBe('object');
        });
      });
      describe('with a "render" key', () => {
        test('that is a function', () => {
          expect('render' in instance).toBe(true);
          expect(typeof instance.render).toBe('function');
        });
        const output = instance.render();
        describe('when called', () => {
          test('it returns rendered output of wrapped component', () => {
            expect(output).toBe(null);
          });
          test('it passes "props" to wrapped component', () => {
            expect(myComponentProps).toBe(props);
          });
          test('it passes "state" to wrapped component', () => {
            expect(myComponentState).toBe(state);
          });
          test('it passes "context" to wrapped component', () => {
            expect(myComponentContext).toBe(context);
          });
        });
      });
      describe('with a "updater" key', () => {
        test('that is an object', () => {
          expect('updater' in instance).toBe(true);
          expect(typeof instance.updater).toBe('object');
        });
      });
    });
  });
});
