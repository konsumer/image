import { toString, readUInt32BE, readUInt8 } from '../buffer.js'

export const JPG = {
  validate (buffer) {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff && (buffer[3] === 0xdb || (buffer[3] >= 0xe0 && buffer[3] <= 0xef))
  },

  calculate (buffer) {
    const { data, ...j } = readJpegHeader(buffer)
    return j
  }
}

// jpeg-header.js:
// Author: Thomas Lochmatter, thomas.lochmatter@viereck.ch
// License: MIT

// Returns an object with the width and height of the JPEG image stored in bytes, or null if the bytes do not represent a JPEG image.
function readJpegHeader (bytes) {
  // JPEG magick
  if (bytes[0] != 0xff) return
  if (bytes[1] != 0xd8) return

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

// Returns an object with the width and height of the JPEG file. Small chunks of the file are read until the header is found.
// If the file cannot be read, or does not contain a JPEG image, the function return null.
function readJpegHeaderFromFile (file, handler) {
  let pos = 0

  // Reads a byte sequence of length bytes starting at pos. It should not hurt to read small byte ranges, since the operating system most likely caches pages of 4096+ bytes.
  function read (length, next) {
    const fileReader = new FileReader()
    fileReader.onloadend = done
    fileReader.readAsArrayBuffer(file.slice(pos, pos + length))

    function done () {
      if (!fileReader.result || fileReader.result.byteLength < 1) return handler()
      next(new Uint8Array(fileReader.result))
    }
  }

  // Start
  read(2, checkMagick)

  // JPEG magick
  function checkMagick (bytes) {
    if (bytes[0] != 0xff) return handler()
    if (bytes[1] != 0xd8) return handler()
    pos += 2
    read(4, startMarker)
  }

  // Marker
  function startMarker (bytes) {
    if (bytes[0] != 0xff) return scanFF(bytes)

    // Short marker
    pos += 2
    if (bytes[2] == 0xff) return read(4, startMarker)

    // SOFn marker
    const type = bytes[1]
    const length = bytes[2] * 256 + bytes[3]
    if (length >= 6 && (type == 0xc0 || type == 0xc2)) {
      pos += 2
      return read(6, header)
    }

    // Other marker
    pos += length
    read(4, startMarker)

    // Marker with the header information we are looking for
    function header (bytes) {
      const data = {}
      data.progressive = type == 0xc2
      data.bitDepth = bytes[0]
      data.height = bytes[1] * 256 + bytes[2]
      data.width = bytes[3] * 256 + bytes[4]
      data.components = bytes[5]
      return handler(data)
    }
  }

  // Scans for the next start marker (if the image is corrupt, this marker may not be where it is expected)
  function scanFF (bytes) {
    for (var i = 0; i < bytes.length; i++) {
      if (bytes[i] != 0xff) continue
      pos += i
      console.log(file.name + ' is contains extra data before the segment starting at position ' + pos + '.')
      return read(4, startMarker)
    }

    pos += i
    read(4096, scanFF)
  }
}
