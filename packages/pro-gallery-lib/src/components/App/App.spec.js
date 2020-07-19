import React, { Suspense } from 'react';
import { render, waitForElement } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import i18n from '../__mocks__/i18n';

describe('App', () => {
  it('renders a title correctly', async () => {
    const { getByTestId } = render(
      <Suspense fallback={'...loading'}>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </Suspense>,
    );

    await waitForElement(() => getByTestId('app-title'));

    expect(getByTestId('app-title')).not.toBeNull();
  });
});
