import React from 'react';
import { render } from 'react-testing-library';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import i18n from '../__mocks__/i18n';

describe('App', () => {
  it('renders a title correctly', () => {
    const { getByTestId } = render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>,
    );

    expect(getByTestId('app-title').textContent).toBe('app.title');
  });
});
