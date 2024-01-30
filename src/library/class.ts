import { getFloat16, setFloat16 } from '@petamoriken/float16'

export class DataViewEX extends DataView {
  getFloat16(byteOffset: number, littleEndian = false) {
    return getFloat16(this, byteOffset, littleEndian)
  }

  setFloat16(byteOffset: number, value: number, littleEndian = false) {
    return setFloat16(this, byteOffset, value, littleEndian)
  }
}
