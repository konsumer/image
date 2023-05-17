import { readUInt32LE, toString } from '../buffer.js'

const SIGNATURE = 'KTX 11'

export const KTX = {
  validate (buffer) {
    return SIGNATURE === toString(buffer, 1, 7)
  },

  calculate (buffer) {
    return {
      height: readUInt32LE(buffer, 40),
      width: readUInt32LE(buffer, 36)
    }
  }
}
