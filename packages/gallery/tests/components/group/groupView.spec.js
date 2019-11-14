import GalleryDriver from '../../drivers/reactDriver';
import { expect } from 'chai';
import GroupView from '../../../src/components/group/groupView';

describe('Group View ', () => {
  let galleryDriver;
  let groupViewProps;

  beforeEach(() => {
    galleryDriver = new GalleryDriver();
    groupViewProps = galleryDriver.props.groupView();
    groupViewProps.items = groupViewProps.items.slice(1, 6);
    Object.assign(groupViewProps, {
      galleryConfig: galleryDriver.galleryConfig,
    });
  });
  it('should init', () => {
    galleryDriver.shallow(GroupView, groupViewProps);
    expect(galleryDriver.find.hook('group-view').length).to.equal(1);
  });
  it('should create item container from dtos', () => {
    const numItems = groupViewProps.items.length;
    galleryDriver.mount(GroupView, groupViewProps);
    expect(galleryDriver.find.hook('item-container').length).to.equal(numItems);
  });
});
