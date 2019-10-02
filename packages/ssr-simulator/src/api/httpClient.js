import fetch from 'isomorphic-unfetch';

export function httpClient(baseURL) {
  return {
    get: (path, options) => {
      return fetch(baseURL + path, options).then(res => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }

        return res.json();
      });
    },

    post: (path, body, options = {}) => {
      return fetch(baseURL + path, {
        ...options,
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      }).then(res => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }

        return res.json();
      });
    }
  };
}
