# React Server Side Rendering Boilerplate ⚛️

Tools like [create-react-app](https://github.com/facebook/create-react-app) have made setting up client-side React apps trivial, but transitioning to SSR is still kind of a pain in the ass. [Next.js](https://nextjs.org) is a powerhouse, and the [Razzle](https://github.com/jaredpalmer/razzle) tool looks like an absolute beast, but sometimes you just want to see the whole enchilada running your app. This is a sample setup for fully featured, server-rendered React applications.

**What's included:**

- Server-side rendering with code splitting (via the excellent [React Loadable](https://github.com/thejameskyle/react-loadable) package)
- Server-side data fetching and client-side hydration
- React Router
- Conditionally load pollyfills -- only ship bloat to outdated browsers
- React Helmet for dynamic manipulation of the document `<head />`
- Dev server with hot reloading styles
- Jest and react-testing-library ready to test the crap out of some stuff
- CSS Modules, Sass, and autoprefixer
- Run-time environment variables
- Node.js clusters for improved performance under load (in production)
- Prettier and ESLint run on commit
- Docker-ized for production like a bawsss

## Initial setup

- `npm install`

## Development

- `npm start`
  - Start the dev server at [http://localhost:3000](http://localhost:3000)
- `npm test`
  - Start `jest` in watch mode

## Production

- `npm run build && npm run start:prod`
  - Bundle the JS and fire up the Express server for production
- `npm run docker`
  - Build and start a local Docker image in production mode (mostly useful for debugging)

## General architecture

This app has two main pieces: the server and the client code.

#### Server (`server/`)

A fairly basic Express application in `server/app.js` handles serving static assets (the generated CSS and JS code in `build/` + anything in `public/` like images and fonts), and sends all other requests to the React application via `server/renderServerSideApp.js`. That function delegates the fetching of server-side data fetching to `server/fetchDataForRender`, and then sends the rendered React application (as a string) injected inside the HTML-ish code in `server/indexHtml.js`.

During development the server code is run with `@babel/register` and middleware is added to the Express app (see `scripts/start`), and in production we bundle the server code to `build/server` and the code in `scripts/startProd` is used to run the server with Node's `cluster` module to take advantage of multiple CPU cores.

#### Client (`src/`)

The entrypoint for the client-side code (`src/index.js`) first checks if the current browser needs to be polyfilled and then defers to `src/main.js` to hydrate the React application. These two files are only ever called on the client, so you can safely reference any browser APIs here without anything fancy. The rest of the client code is a React application -- in this case a super basic UI w/2 routes, but you can safely modify/delete nearly everything inside `src/` and make it your own.

As with all server-rendered React apps you'll want to be cautious of using browser APIs in your components -- they don't exist when rendering on the server and will throw errors unless you handle them gracefully (I've found some success with using `if (typeof myBrowserAPI !== 'undefined') { ... }` checks when necessary, but it feels dirty so I try to avoid when possible). The one exception to this is the `componentDidMount()` method for class components and `useEffect()` & `useLayoutEffect()` hooks, which are only run on the client.

## "How do I ...?"

#### Fetch data on the server before rendering?

_The client-side sample code to handle is a little experimental at the moment._

Sometimes you'll want to make API calls on the server to fetch data **before** rendering the page. In those cases you can use a static `fetchData()` method on any component. That method will be called with the `req` object from express, and it should return a Promise that resolves to an object, which will be merged with other `fetchData()` return values into a single object. That object of server data is injected into the server HTML, added to `window.__SERVER_DATA__`, and used to hydrate the client via the `<ServerDataProvider />` context provider. Components can use the `useServerData()` hook to grab the data object. **IMPORTANT:** Your component must handle the case where the server data property it's reading from is `undefined`.

Check out `src/components/Home.js` for an example.

#### Add Redux?

Adding `redux` takes a few steps, but shouldn't be too painful; start by replacing the `<ServerDataProvider />` with the `<Provider />` from `react-redux` on both the server and the client. You can then pass the `store` as an argument to the static `fetchData()` method (in `server/fetchDataForRender.js`) and dispatch actions inside of `fetchData()`. Finally you'll need to pass the `store`'s current state to the index.html generator function so you can grab it on the client and hydrate the client-side `store`.

## Current Quirks

- There are console message saying "componentWillMount has been renamed, and is not recommended for use." due to the react-loadable package. Hopefully React will support SSR with Suspense soon, but until then react-loadable works great and the console messages should not affect your app.
- This project does not have a webpack configuration that allows for the use of `url-loader` or `file-loader` (so no `import src from 'my-img.svg'`). Instead it relies on serving static assets via the `public/` directory. See `src/components/about/About.js` for a reference on how to work with assets in your app.

## Roadmap

- [ ] Run server via webpack in dev mode so we can use more loaders
- [x] Intelligently resolve CSS modules by looking for a `.module.s?css` file extension
- [ ] Add example app that handles authentication
- [x] Migrate to `react-testing-library` instead of `enzyme`
