import React from 'react';
export default function (typeErrors) {
  return <ol>{typeErrors.map(Error)}</ol>;
}

function Error(errObject) {
  // const style = {
  //   height: '100px',
  //   width: '500px',
  // };
  // return <li>{JSON.stringify(errObject, null, 4)} </li>;
  // return <li> {Object.entries(errObject).map(items)}</li>;
  return <li> {errObject.message}</li>;
}
