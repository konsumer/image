import { toString, readUInt32BE, readUInt8 } from '../buffer.js'

const pngSignature = 'PNG\r\n\x1a\n'
const pngImageHeaderChunkName = 'IHDR'

// Used to detect "fried" png's: http://www.jongware.com/pngdefry.html
const pngFriedChunkName = 'CgBI'

// get all byte-chunks, by type
export function getPNGChunks (imageData, startAddress = 0) {
  const chunks = []
  let address = startAddress + 0
  try {
    while (address < imageData.length) {
      const length = readUInt32BE(imageData, address)
      let data = new Uint8Array()
      if (length > 0) {
        data = imageData.slice(address + 8, address + 8 + length)
      }
      chunks.push({
        address,
        length,
        type: toString(imageData, address + 4, address + 8),
        data,
        crc: readUInt32BE(imageData, address + 8 + length)
      })
      address += (8 + length + 4)
    }
  } catch (e) {}
  return chunks
}

export const PNG = {
  validate (buffer) {
    if (pngSignature === toString(buffer, 1, 8)) {
      let chunkName = toString(buffer, 12, 16)
      if (chunkName === pngFriedChunkName) {
        chunkName = toString(buffer, 28, 32)
      }
      if (chunkName !== pngImageHeaderChunkName) {
        throw new TypeError('Invalid PNG')
      }
      return true
    }
    return false
  },

  calculate (buffer) {
    const chunks = getPNGChunks(buffer, toString(buffer, 12, 16) === pngFriedChunkName ? 24 : 8)
    const ihdr = chunks[0].data

    const out = {}
    out.width = readUInt32BE(ihdr, 0)
    out.height = readUInt32BE(ihdr, 4)
    out.bitDepth = readUInt8(ihdr, 8)
    out.colorType = readUInt8(ihdr, 9)
    out.compressionMethod = readUInt8(ihdr, 10)
    out.filterMethod = readUInt8(ihdr, 11)
    out.interlaceMethod = readUInt8(ihdr, 12)
    out.alpha = ((out.colorType & 4) === 4) || !!chunks.find(c => c.type === 'tRNS')
    return out
  }
}
