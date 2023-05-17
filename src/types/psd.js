import { toString, readUInt32BE } from '../buffer.js'

export const PSD = {
  validate (buffer) {
    return (toString(buffer, 0, 4) === '8BPS')
  },

  calculate (buffer) {
    return {
      height: readUInt32BE(buffer, 14),
      width: readUInt32BE(buffer, 18)
    }
  }
}
