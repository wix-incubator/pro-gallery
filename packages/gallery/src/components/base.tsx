import React from 'react';
import { GalleryProps } from 'pro-gallery-lib';

export interface ProGalleryContext extends GalleryProps {
  galleryStructure: any;
  containerRef: HTMLDivElement;
}

export const ProGalleryContext = React.createContext<ProGalleryContext>(
  undefined as any
);

abstract class ProGalleryBaseComponent<
  Props,
  State,
  AdditionalProps extends Record<string, any> = Record<string, any>
> extends React.Component<Props, State> {
  static contextType = ProGalleryContext;
  declare context: ProGalleryContext;

  protected abstract mapProGalleryContextToProps(
    context: ProGalleryContext
  ): AdditionalProps;

  private eventListeners = new Map<string, ((data: any) => void)[]>();
  protected overrideContext(context: ProGalleryContext): ProGalleryContext {
    return context;
  }

  private overrideContextBase() {
    const context = this.overrideContext
      ? this.overrideContext(this.context)
      : this.context;
    const onEventsListener = (event: string, data: any) => {
      if (context.eventsListener) {
        context.eventsListener(event, data);
      }
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        listeners.forEach((listener) => listener(data));
      }
    };
    return {
      ...context,
      eventsListener: onEventsListener,
    };
  }

  protected get compProps(): Props & AdditionalProps {
    return {
      ...this.props,
      ...this.mapProGalleryContextToProps(this.context),
    };
  }

  protected call(event: string, data: any[]): void {
    if (this.context.eventsListener) {
      this.context.eventsListener(event, data);
    }
  }

  protected bind(event: string, listener: (args: any[]) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)?.push(listener);
  }

  abstract renderComponent(): JSX.Element;

  render() {
    return (
      <ProGalleryContext.Provider value={this.overrideContextBase()}>
        {this.renderComponent()}
      </ProGalleryContext.Provider>
    );
  }
}

export default ProGalleryBaseComponent;
