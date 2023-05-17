import { typeHandlers } from './types.js'
import detector from './detector.js'

// get info about an image
export function info (buffer, options) {
  // handle strings = URL
  if (typeof buffer === 'string') {
    try {
      return infoFetch(buffer, options)
    } catch (e) {
      return infoFetchNoCors(buffer)
    }
  }

  // handle plain arrays
  if (!buffer.buffer) {
    buffer = new Uint8Array(buffer)
  }

  const type = detector(buffer)

  let i = {}
  if (type && typeHandlers[type]) {
    i = typeHandlers[type].calculate(buffer)
  }

  return { type, ...i }
}

// get info about a remote image from the first chunk
export async function infoFetch (url, options) {
  const { value } = await fetch(url, options).then(r => r.body).then(b => b.getReader().read())
  return info(value)
}

// get size-info about a remote image from an image tag (browser-only)
export async function infoFetchNoCors (url) {
  return new Promise((resolve, reject) => {
    let image
    if (url instanceof Image) {
      image = url
      if (image.complete) {
        return resolve({
          width: image.naturalWidth,
          height: image.naturalHeight,
          url: image.src
        })
      }
    } else {
      image = new Image()
      image.src = url
    }

    image.addEventListener('load', () => {
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
        url: image.src
      })
    })

    image.addEventListener('error', (event) => {
      const e = new Error('The image failed to load.')
      e.url = url
      e.event = event
      reject(e)
    })
  })
}

export default info
