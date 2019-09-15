// We can use "process.env.VAR_NAME" on both the server and the client.
// See config/env.js and server/indexHtml.js
export function imagePath(assetName) {
  return `${process.env.PUBLIC_URL}/images/${assetName}`;
}
