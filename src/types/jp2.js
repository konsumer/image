import { readUInt32LE, readUInt32BE, readUInt8, toString } from '../buffer.js'

const BoxTypes = {
  ftyp: '66747970',
  ihdr: '69686472',
  jp2h: '6a703268',
  jp__: '6a502020',
  rreq: '72726571',
  xml_: '786d6c20'
}

const calculateRREQLength = (box) => {
  const unit = readUInt8(box, 0)
  let offset = 1 + (2 * unit)
  const numStdFlags = readUInt16BE(box, offset)
  const flagsLength = numStdFlags * (2 + unit)
  offset = offset + 2 + flagsLength
  const numVendorFeatures = readUInt16BE(box, offset)
  const featuresLength = numVendorFeatures * (16 + unit)
  return offset + 2 + featuresLength
}

const parseIHDR = (box) => {
  return {
    height: readUInt32BE(box, 4),
    width: readUInt32BE(box, 8)
  }
}

export const JP2 = {
  validate (buffer) {
    const signature = buffer.toString('hex', 4, 8)
    const signatureLength = readUInt32BE(buffer, 0)
    if (signature !== BoxTypes.jp__ || signatureLength < 1) {
      return false
    }

    const ftypeBoxStart = signatureLength + 4
    const ftypBoxLength = readUInt32BE(buffer, signatureLength)
    const ftypBox = buffer.slice(ftypeBoxStart, ftypeBoxStart + ftypBoxLength)
    return ftypBox.toString('hex', 0, 4) === BoxTypes.ftyp
  },

  calculate (buffer) {
    const signatureLength = readUInt32BE(buffer, 0)
    const ftypBoxLength = readUInt16BE(buffer, signatureLength + 2)
    let offset = signatureLength + 4 + ftypBoxLength
    const nextBoxType = buffer.toString('hex', offset, offset + 4)
    switch (nextBoxType) {
      case BoxTypes.rreq:
        // WHAT ARE THESE 4 BYTES?????
        // eslint-disable-next-line no-case-declarations
        const MAGIC = 4
        offset = offset + 4 + MAGIC + calculateRREQLength(buffer.slice(offset + 4))
        return parseIHDR(buffer.slice(offset + 8, offset + 24))
      case BoxTypes.jp2h :
        return parseIHDR(buffer.slice(offset + 8, offset + 24))
      default:
        throw new TypeError('Unsupported header found: ' + toString(buffer, offset, offset + 4))
    }
  }
}
