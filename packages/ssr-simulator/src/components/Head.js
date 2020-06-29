import React from 'react';
import { Helmet } from 'react-helmet';

const Head = () => {
  return (
    <Helmet>
      <title>Pro Gallery SSR Simulator</title>

      <meta charSet="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="description"
        content="Boilerplate for React apps with routing & server side rendering"
      />

      <link
        rel="shortcut icon"
        href={`${process.env.PUBLIC_URL}/favicon.ico?v1`}
      />

      <link
        rel="stylesheet"
        href="https://static.parastorage.com/services/pro-gallery-santa-wrapper/1.507.0/viewer.css"
      />

      <link rel="stylesheet" href="https://localhost:3200/viewer.css" />
    </Helmet>
  );
};

export default Head;
