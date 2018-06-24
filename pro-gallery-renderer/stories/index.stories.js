import React from 'react';

import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {linkTo} from '@storybook/addon-links';

import {Button, Welcome} from '@storybook/react/demo';
import {ProGallery} from '../src/index';

storiesOf('Gallery', module)
  .add('Default', () => <ProGallery />)
;
