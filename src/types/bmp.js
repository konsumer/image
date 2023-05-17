import { readUInt32LE, toString } from '../buffer.js'

export const BMP = {
  validate (buffer) {
    return (toString(buffer, 0, 2) === 'BM')
  },

  calculate (buffer) {
    return {
      height: Math.abs(buffer.readInt32LE(22)),
      width: readUInt32LE(buffer, 18)
    }
  }
}
