import { getAppEnv } from '../config/env';

const env = getAppEnv();
const { NODE_ENV, PUBLIC_URL = '' } = env.raw;

let assetManifest;
if (NODE_ENV === 'production') {
  assetManifest = require('../build/asset-manifest.json');
} else {
  assetManifest = {
    'main.js': '/main.bundle.js'
  };
}

const prefetchStyleLinks = bundles => {
  if (NODE_ENV !== 'production') {
    return '';
  }

  const assetFilePaths = Object.keys(assetManifest)
    .filter(
      file =>
        file !== 'main.css' &&
        file.match(/\.css$/) &&
        !bundles.find(b => b.publicPath === assetManifest[file])
    )
    .map(cssFile => `${PUBLIC_URL}${assetManifest[cssFile]}`);

  return assetFilePaths
    .map(
      cssFilePath => `<link rel="prefetch" as="style" href="${cssFilePath}">`
    )
    .join('');
};

const cssLinks = bundles => {
  if (NODE_ENV !== 'production') {
    return '';
  }

  const mainCSS = assetManifest['main.css'];
  const bundleFilePaths = bundles
    .filter(bundle => bundle.file.match(/\.css$/))
    .map(cssBundle => `${PUBLIC_URL}/${cssBundle.file}`);

  return [mainCSS, ...bundleFilePaths]
    .map(cssFilePath => `<link rel="stylesheet" href="${cssFilePath}">`)
    .join('');
};

const preloadScripts = bundles => {
  const mainJS = assetManifest['main.js'];
  const bundleFilePaths = bundles
    .filter(bundle => bundle.file.match(/\.js$/))
    .map(jsBundle => `${PUBLIC_URL}/${jsBundle.file}`);

  return [...bundleFilePaths, mainJS]
    .map(jsFilePath => `<link rel="preload" as="script" href="${jsFilePath}">`)
    .join('');
};

const jsScripts = bundles => {
  const mainJS = assetManifest['main.js'];
  const bundleFilePaths = bundles
    .filter(bundle => bundle.file.match(/\.js$/))
    .map(jsBundle => `${PUBLIC_URL}/${jsBundle.file}`);

  return [...bundleFilePaths, mainJS]
    .map(
      jsFilePath =>
        `<script type="text/javascript" src="${jsFilePath}" defer></script>`
    )
    .join('');
};

export const indexHtml = ({ helmet, serverData, markup, bundles }) => {
  const htmlAttrs = helmet.htmlAttributes.toString();
  const bodyAttrs = helmet.bodyAttributes.toString();

  return `
    <!doctype html>
    <html lang="en" ${htmlAttrs}>
      <head>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}

        ${preloadScripts(bundles)}
        ${prefetchStyleLinks(bundles)}
        ${helmet.link.toString()}
        ${cssLinks(bundles)}
        ${helmet.style.toString()}

        ${helmet.noscript.toString()}
        ${helmet.script.toString()}
        ${jsScripts(bundles)}
      </head>
      <body ${bodyAttrs}>
        <div id="root">${markup}</div>

        <script>
          window.process = ${env.forIndexHtml};
          window.__SERVER_DATA__ = ${JSON.stringify(serverData)}
          window.__ASSET_MANIFEST__ = ${JSON.stringify(assetManifest)}
        </script>
      </body>
    </html>
  `;
};
