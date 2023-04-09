import { getFloat16, setFloat16 } from '@petamoriken/float16'

// Class & Function Library //

export class DataViewEX extends DataView {
  /**
   * @param {number} byteOffset
   */
  getFloat16(byteOffset, littleEndian = false) {
    return getFloat16(this, byteOffset, littleEndian)
  }

  /**
   * @param {number} byteOffset
   * @param {number} value
   * @param {boolean} littleEndian
   */
  setFloat16(byteOffset, value, littleEndian = false) {
    return setFloat16(this, byteOffset, value, littleEndian)
  }
}
