# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [5.1.0] - 2019-09-03

### Changed

- Use a `<Head />` component to set document head data via react-helmet instead of writing it directly in `<App />` using a separate JSON-like file.
- Update dependencies.

## [5.0.1] - 2019-07-17

### Fixed

- Production builds only load necessary code-split (ie css-modules) CSS files instead of all of them.

### Security

## [5.0.0] - 2019-06-16

### Added

- `react-testing-library` replaces `enzyme`

### Removed

- `enzyme`

### Changed

- The `<ServerDataProvider />` context provider wrapper accepts a prop called `value` instead of `serverCache`. Internally, it's context value is now just called `data` vs `dataCache`.

### Fixed

- Jest config no longer runs in a "node" environment

### Security

## [4.1.0] - 2019-06-16

### Added

- Resolve CSS modules by looking for `.module.s?css` file extension

### Changed

- Client-side webpack config for dev and prod combined into a factory function

## [4.0.1] - 2019-06-15

### Added

### Changed

- Upgraded `css-loader` to v3 and change webpack config options
- Dependencies updated

### Fixed

- The correct route is now rendered on the server (I forgot to pass the URL to react router :facepalm:)

## [4.0.0] - 2019-06-09

### Added

- CHANGELOG.md :grin:
- Client-side data hydration setup using React context
- Sample todo application
- Sample API module for making HTTP requests

### Changed

- Fetch data while rendering on the server from any component in the tree
- Ignore `node_modules` when watching files with chokidar during development
- ESLint config now uses [`eslint-config-react-app`](https://github.com/facebook/create-react-app/tree/master/packages/eslint-config-react-app)
- Jest config moved out of `package.json` to `jest.config.js`
- Dependencies updated to latest version
- README updates

### Removed

- `redux` and `react-redux` were removed and replaced with React context

# Template

## [1.0.0] - 2019-06-09

### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security
