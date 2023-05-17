import { toString, readUInt } from '../buffer.js'

// based on http://www.compix.com/fileformattif.htm
// TO-DO: support big-endian as well

// TIFF values seem to be messed up on Big-Endian, this helps
function readValue (buffer, isBigEndian) {
  const low = readUInt(buffer, 16, 8, isBigEndian)
  const high = readUInt(buffer, 16, 10, isBigEndian)
  return (high << 16) + low
}

// move to the next tag
function nextTag (buffer) {
  if (buffer.length > 24) {
    return buffer.slice(12)
  }
}

// Extract IFD tags from TIFF metadata
function extractTags (buffer, isBigEndian) {
  const tags = {}

  let temp = buffer
  while (temp && temp.length) {
    const code = readUInt(temp, 16, 0, isBigEndian)
    const type = readUInt(temp, 16, 2, isBigEndian)
    const length = readUInt(temp, 32, 4, isBigEndian)

    // 0 means end of IFD
    if (code === 0) {
      break
    } else {
      // 256 is width, 257 is height
      // if (code === 256 || code === 257) {
      if (length === 1 && (type === 3 || type === 4)) {
        tags[code] = readValue(temp, isBigEndian)
      }

      // move to the next tag
      temp = nextTag(temp)
    }
  }

  return tags
}

// Test if the TIFF is Big Endian or Little Endian
function determineEndianness (buffer) {
  const signature = toString(buffer, 0, 2)
  if (signature === 'II') {
    return 'LE'
  } else if (signature === 'MM') {
    return 'BE'
  }
}

const signatures = [
  // '492049', // currently not supported
  '49492a00', // Little endian
  '4d4d002a' // Big Endian
  // '4d4d002a', // BigTIFF > 4GB. currently not supported
]

export const TIFF = {
  validate (buffer) {
    return signatures.includes(buffer.toString('hex', 0, 4))
  },

  calculate (buffer) {
    // Determine BE/LE
    const isBigEndian = determineEndianness(buffer) === 'BE'

    // extract the tags from the IFD
    const tags = extractTags(buffer, isBigEndian)

    const width = tags[256]
    const height = tags[257]

    if (!width || !height) {
      throw new TypeError('Invalid Tiff. Missing tags')
    }

    return { height, width }
  }
}
