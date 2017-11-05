'use strict';

import {CommonItemContainerNotConnected} from './commonItemContainer.js';
import {shallow} from 'enzyme';
import React from 'react';
import {itemActions} from 'photography-client-lib';

class DummyComponent extends React.Component {
  render() {
    return <div className="dummy" />;
  }
}

describe('Common Item Container', () => {
  describe('When creating an item container', () => {
    it('should have a love property', () => {

      const EnhancedComponent = CommonItemContainerNotConnected(DummyComponent);

      const MountedEnhancedComponent = shallow(<EnhancedComponent />);

      expect(MountedEnhancedComponent.prop('love')).toBeDefined();
    });

    it('should change state on toggle love', () => {
      const itemId = 'unique_item_id';
      itemActions.toggleLove(itemId, 'origin', false); //force item 1 to be unloved
      const EnhancedComponent = CommonItemContainerNotConnected(DummyComponent);
      const MountedEnhancedComponent = shallow(<EnhancedComponent photoId={itemId} />);
      expect(itemActions.isLoved(itemId)).toEqual(false); //TODO - move this expect to itemActions
      MountedEnhancedComponent.prop('love').toggleLove();
      expect(MountedEnhancedComponent.state('isLoved')).toEqual(true);
    });

  });

});
