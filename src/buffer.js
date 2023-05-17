// re-implement node's Buffer functions (mostly from feross's buffer)
export const readUInt16BE = (buffer, offset = 0) => ((buffer[offset] << 8) | buffer[offset + 1])

export const readUInt16LE = (offset) => {
  offset = offset >>> 0
  return this[offset] | (this[offset + 1] << 8)
}

export const readUInt32BE = (buffer, offset = 0) => (buffer[offset] * 0x1000000) +
    ((buffer[offset + 1] << 16) |
    (buffer[offset + 2] << 8) |
    buffer[offset + 3])

export const readUInt32LE = (offset) => {
  offset = offset >>> 0
  return ((this[offset]) |
            (this[offset + 1] << 8) |
            (this[offset + 2] << 16)) +
            (this[offset + 3] * 0x1000000)
}

export const readUInt8 = (buffer, offset) => buffer[offset >>> 0]

export const toString = (buf, start, end) => String.fromCharCode(...buf.slice(start, end))
