import { readUInt16LE, toString } from '../buffer.js'

const gifRegexp = /^GIF8[79]a/

export const GIF = {
  validate (buffer) {
    const signature = toString(buffer, 0, 6)
    return (gifRegexp.test(signature))
  },

  calculate (buffer) {
    return {
      height: readUInt16LE(buffer, 8),
      width: readUInt16LE(buffer, 6)
    }
  }
}
