import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Love button',
  description: `Choose to show love (heart) button. Can be set in all layouts.
  Triggers the "LOVE_BUTTON_CLICKED" event.
  Note that the consumer has to handle the event triggered by this button.
  You can use the eventListener property of the ProGallery to listen to this event and create your own implementation.`,
  isRelevant: () => true,
  type: INPUT_TYPES.BOOLEAN,
  default: false,
}