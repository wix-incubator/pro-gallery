import React from 'react';
export default function(typeErrors) {
      return (
        <h1>
        {typeErrors.map(Error)}
        </h1>
      )
}

function Error(errObject) {
      const style = {
        height: '100px',
        width: '500px',
      }
	return (
		<div style={style}>{JSON.stringify(errObject, null, 4)} </div>
	)
}
