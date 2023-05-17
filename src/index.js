import { typeHandlers } from './types.js'
import detector from './detector.js'

// get info about an image
export function info (buffer) {
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
