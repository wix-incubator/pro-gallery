import React, { ComponentType } from 'react';

export type GetProps<T extends ComponentType<any>> = T extends ComponentType<
  infer P
>
  ? P
  : never;

export function reactLazy<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): T {
  const load = () => factory().then(({ default: Component }) => Component);
  return class ReactLazyComponent extends React.Component<GetProps<T>> {
    static displayName = 'ReactLazyComponent';
    static ComponentPromise: Promise<T>;
    static Component: T;
    componentDidMount() {
      if (!ReactLazyComponent.ComponentPromise) {
        ReactLazyComponent.ComponentPromise = load();
      }
      const promise = ReactLazyComponent.ComponentPromise;
      promise.then((Component) => {
        ReactLazyComponent.Component = Component;
        this.forceUpdate();
      });
    }
    render() {
      const Component = ReactLazyComponent.Component;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return Component ? <Component {...this.props} /> : null;
    }
  } as unknown as T;
}
