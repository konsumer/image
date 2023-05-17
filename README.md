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

- You are not locked into nodejs or the browser or anyhting. This can be used in many environments (node, browser, deno, bun, Cloudflare workers, etc.)
- Grabs the smallest amount of bytes from an image as possible, and get the most info possible. This means it's fast, light, and doesn't take a lot of RAM. 1 byte is enough to basically detect format. 20 bytes is enough to get height/width, color information, and more.
- It will progressively load more data, if it gets more bytes. Example: without access to the header + `tRNS` chunk in an indexed PNG, it cannot fully detect if it has an alpha channel, but other fields will be available, even without the whole file loaded, and even 100 bytes or so is enough to fully detect alpha-channel.
- It works with all kinds of things, like `Buffer`, `ArrayBuffer`, `Uint8Array`, a plain string or array of integers.
- Use it with `fetch` or your favorite HTTP library.


## Installation

### nodejs / build-system

```sh
npm i @konsumer/image
```


## Usage

There are 2 exported functions:

- `infoFetch(url)` - asynchronous, calls fetch to download very little data, and gets info
- `info(bytes)` - synchronous, use bytes to get as much info as possible

### current nodejs / bun

```js
import { infoFetch } from '@konsumer/image'
console.log(await infoFetch('https://placekitten.com/200/200'))
```

### deno

```js
import { infoFetch } from 'npm:@konsumer/image'
console.log(await infoFetch('https://placekitten.com/200/200'))
```

### older nodejs

```js
const imagemeta = require('@konsumer/image')

// if your node doesn't have fetch
global.fetch = require('node-fetch')

imagemeta.infoFetch('https://placekitten.com/200/200')
  .then(info => console.log(info))
```

### browser-only

```html
<script type=module>
import { infoFetch } from 'https://cdn.skypack.dev/@konsumer/image'
console.log(await infoFetch('https://placekitten.com/200/200'))
</script>
```

You can see an example [here](https://codepen.io/konsumer/pen/gOBBYgP?editors=1000).

## TODO

- I need to clean up & normalize the data, and get more info about every format.


## Thanks

- I got a lot of the byte-parsing from [image-size](https://github.com/image-size/image-size)
- [jpeg-header](https://viereck.ch/jpeg-header/) seemed to be the most reliable JPEG parsing I have found, in JS.