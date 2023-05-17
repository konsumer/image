# image

Use the minimum amount of data to get info about an image.

These image-types are supported:

- BMP
- CUR
- DDS
- GIF
- ICNS
- ICO
- J2C
- JP2
- JPEG
- KTX
- PNG
- PNM (PAM, PBM, PFM, PGM, PPM)
- PSD
- SVG
- TGA
- TIFF
- WebP

## Features


- You are not locked into nodejs or the browser or anything. This can be used in many environments (node, browser, deno, bun, Cloudflare workers, etc.)
- Grabs the smallest amount of bytes from an image as possible, and get the most info possible. This means it's fast, light, and doesn't take a lot of RAM. 1 byte is enough to basically detect format. 20 bytes is enough to get height/width, color information, and more.
- No external dependencies. Just add [the single file](https://cdn.jsdelivr.net/npm/@konsumer/image/dist/index.mjs) to your project and use it.
- Published as [ESM](https://cdn.jsdelivr.net/npm/@konsumer/image/dist/index.mjs) and [CommonJS](https://cdn.jsdelivr.net/npm/@konsumer/image/dist/index.cjs) module for easy use, everywhere.
- It works with all kinds of things, like `Buffer`, `ArrayBuffer`, `Uint8Array`, or any array of unsigned integers (representing bytes.)
- Use it with `fetch` or your favorite HTTP library.


## Installation

### nodejs / build-system

```sh
npm i @konsumer/image
```


## Usage

There are 3 exported functions:

- `info(bytes)` - synchronous, use bytes to get as much info as possible. [Here](https://codesandbox.io/p/sandbox/mutable-pine-4403q5) is a server-side example that uses it, but it also works in the browser.
- `infoFetch(url)` - asynchronous, calls fetch to download very little data, and gets info. [Here](https://codesandbox.io/p/sandbox/mutable-pine-4403q5) is a server-side demo, and [here](https://codepen.io/konsumer/pen/gOBBYgP?editors=1000) is browser-demo.
- `infoFetchNoCors(url)` - asynchronous, Similar to `infoFetch`, but only for browser. It will get less info, and only supports images that your browser supports, but it can get height/width even when CORS would stop you. [Here](https://codepen.io/konsumer/pen/oNaazaP?editors=1000) is an example usage.


> **Note**: You only really need `info(url)`, and it's the default export, because it detects a URL (string param) and will try to call  `infoFetch(url)` / `infoFetchNoCors(url)`.


### current nodejs / bun

```js
import imagemeta from '@konsumer/image'
console.log(await imagemeta('https://placekitten.com/200/200'))
```

You can see a demo [here](https://codesandbox.io/p/sandbox/mutable-pine-4403q5).


### deno

```js
import imagemeta from 'npm:@konsumer/image'
console.log(await imagemeta('https://placekitten.com/200/200'))
```

### older nodejs

```js
const imagemeta = require('@konsumer/image')

// if your node doesn't have fetch
global.fetch = require('node-fetch')

imagemeta('https://placekitten.com/200/200')
  .then(console.log)
```

### browser-only

```html
<script type=module>
import imagemeta from 'https://cdn.skypack.dev/@konsumer/image'
console.log(await imagemeta('https://placekitten.com/200/200'))
</script>
```

You can see a demo [here](https://codepen.io/konsumer/pen/gOBBYgP?editors=1000).

## TODO

- I need to clean up & normalize the data, and get more info about every format.
- Make a top-level `DataView` and use it for everything (similar to Buffer, no buffer utils needed.) See jpeg for example.
- Also get mime, url, and filesize (on URLS)


## Thanks

- I got a lot of the image byte-parsing stuff from [image-size](https://github.com/image-size/image-size)
- [jpeg-header](https://viereck.ch/jpeg-header/) seemed to be the most reliable JPEG parsing I have found, in JS.
