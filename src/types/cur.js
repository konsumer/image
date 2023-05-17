import { ICO } from './ico'
import { readUInt16LE } from '../buffer.js'

const TYPE_CURSOR = 2
export const CUR = {
  validate (buffer) {
    const reserved = readUInt16LE(buffer, 0)
    const imageCount = readUInt16LE(buffer, 4)
    if (reserved !== 0 || imageCount === 0) {
      return false
    }
    const imageType = readUInt16LE(buffer, 2)
    return imageType === TYPE_CURSOR
  },

  calculate (buffer) {
    return ICO.calculate(buffer)
  }
}
