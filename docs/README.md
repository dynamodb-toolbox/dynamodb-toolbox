# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ npm install
```

### Local Development

```
$ npm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

### Security notes

`npm audit` reports a set of `high` advisories that all trace to a single leaf
dependency: [`image-size`](https://github.com/advisories/GHSA-w3rx-r6r6-pgpr)
(build-time DoS via infinite loops in the ICNS/JXL/HEIF parsers). These cascade
up the tree (`@docusaurus/mdx-loader` → plugins/themes → `@docusaurus/core`).

They are **not currently fixable by upgrading**: the advisory range is
`<=2.0.2`, `2.0.2` is the latest published version (every earlier version is
also in range), and even Docusaurus `canary` still pins `image-size@^2.0.2`.
The advisory is build-time only — `image-size` runs during the build on this
repo's own trusted images and never ships to the browser — so it is not
exploitable here.

Revisit and drop this note once `image-size` publishes a patched release (or
Docusaurus swaps the library).
