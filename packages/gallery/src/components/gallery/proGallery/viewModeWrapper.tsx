import React from 'react';
import { GalleryProps, utils, viewModeWrapper } from 'pro-gallery-lib';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const ViewModeWrapperHOC = <Props extends GalleryProps>(WrappedComponent: React.ComponentClass<Props>) => {
  return class ViewModeWrapperHOC extends React.Component<Props> {
    constructor(props) {
      super(props);
      this.initViewModeWrapper(props);
    }
    initViewModeWrapper(props: Props) {
      if (typeof props.viewMode !== 'undefined') {
        viewModeWrapper.setViewMode(props.viewMode);
      }
      if (typeof props.deviceType !== 'undefined' && viewModeWrapper._deviceType !== props.deviceType) {
        utils.dumpCache();
        viewModeWrapper.setDeviceType(props.deviceType);
      }
    }
    updateViewModeWrapper(nextProps: Props) {
      if (this.props.viewMode !== nextProps.viewMode) {
        utils.dumpCache();
        viewModeWrapper.setViewMode(nextProps.viewMode);
      }
      if (this.props.deviceType !== nextProps.deviceType) {
        utils.dumpCache();
        viewModeWrapper.setDeviceType(nextProps.deviceType);
      }
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
      this.updateViewModeWrapper(nextProps);
    }
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
};
