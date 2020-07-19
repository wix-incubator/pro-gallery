import i18next from 'i18next';

export default function i18n(locale) {
  void i18next
    .use({
      type: 'backend',
      read: (language, namespace, callback) => {
        // We configure how i18next should fetch a translation resource when it
        // needs it: We use Webpack's dynamic imports to fetch resources without
        // increasing our bundle size.
        //
        // See https://webpack.js.org/guides/code-splitting/#dynamic-imports for
        // more information.
        return import(`./locales/messages_${language}.json`)
          .then((translation) => callback(null, translation))
          .catch((error) => callback(error));
      },
    })
    .init({
      // Initial language
      lng: locale,

      // Fallback language
      fallbackLng: 'en',

      // Don't use a key separator (no support for nested translation objects)
      keySeparator: false,

      interpolation: {
        escapeValue: false, // not needed for react (react already protects from xss)
        prefix: '{',
        suffix: '}',
      },

      // Wait for translation data to be available before rendering a component
      react: {
        wait: true,
      },
    });

  return i18next;
}
