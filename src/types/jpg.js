import { toString, readUInt32BE, readUInt8 } from '../buffer.js'

export const JPG = {
  validate (buffer) {
    return buffer[0] == 0xff && buffer[1] === 0xd8
  },

  calculate (bytes) {
    // jpeg-header.js:
    // Author: Thomas Lochmatter, thomas.lochmatter@viereck.ch
    // Go through all markers
    let pos = 2
    const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
    while (pos + 4 < bytes.byteLength) {
    // Scan for the next start marker (if the image is corrupt, this marker may not be where it is expected)
      if (bytes[pos] != 0xff) {
        pos += 1
        continue
      }

      const type = bytes[pos + 1]

      // Short marker
      pos += 2
      if (bytes[pos] == 0xff) continue

      // SOFn marker
      const length = dv.getUint16(pos)
      if (pos + length > bytes.byteLength) return
      if (length >= 7 && (type == 0xc0 || type == 0xc2)) {
        const data = {}
        data.progressive = type == 0xc2
        data.bitDepth = bytes[pos + 2]
        data.height = dv.getUint16(pos + 3)
        data.width = dv.getUint16(pos + 5)
        data.components = bytes[pos + 7]
        return data
      }

      // Other marker
      pos += length
    }
  }
}
