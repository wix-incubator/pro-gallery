import { INPUT_TYPES } from './utils/constants';
import { always } from './utils/utils';

export default {
  title: 'Love button',
  description: `Choose whether you want to show love button or not. Can be set in all layouts.
  Triggers the "LOVE_BUTTON_CLICKED" event.
  Notice that the consumer has to handle the event triggered by this button.
  You can use the eventListener property of the ProGallery to listen to this event and create your own implementation.`,
  isRelevant: always,
  type: INPUT_TYPES.BOOLEAN,
  default: false,
}