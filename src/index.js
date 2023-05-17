import { typeHandlers } from './types.js'
import detector from './detector.js'

// get info about an image
export function info (buffer) {
  // handle strings
  if (typeof buffer === 'string') {
    buffer = new TextEncoder().encode(buffer)
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

export default info
