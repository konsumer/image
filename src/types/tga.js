import { readUInt16LE } from '../buffer.js'

export const TGA = {
  validate (buffer) {
    return readUInt16LE(buffer, 0) === 0 && readUInt16LE(buffer, 4) === 0
  },

  calculate (buffer) {
    return {
      height: readUInt16LE(buffer, 14),
      width: readUInt16LE(buffer, 12)
    }
  }
}
