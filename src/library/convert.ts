import type * as Types from '../types/library.js'
import { DataViewEX } from './class.js'
import { Endian } from './endian.js'

/** Converter Class */
export class Convert {
  /**
   * Converts a number value to a Buffer based on the specified type.
   * @param Value - The number value to be converted to a Buffer.
   * @param Type - The type of conversion to be applied.
   * @param Options - Optional parameters.
   */
  static toBuffer(Value: number, Type: Types.Read.Number, Options?: { isLittle?: boolean }): Buffer {
    // Parameter Checks: ///////////////////////////
    if (typeof Value !== 'number')
      throw new TypeError('The "Value" parameter must be a number.')

    if (typeof Type !== 'string')
      throw new TypeError('The "Type" parameter must be a string.')
    // ////////////////////////////////////////////

    function BufferFromView(View: DataViewEX, Length: number): Buffer {
      const Buf = Buffer.alloc(Length)

      for (let i = 0; i < Length; i++)
        Buf.writeUInt8(View.getUint8(i), i)

      return !Options?.isLittle ? Buf : Endian(Buf)
    }

    let View: DataViewEX
    switch (Type) {
      case 'int8':
        View = new DataViewEX(new ArrayBuffer(1))
        View.setInt8(0, Value)
        return BufferFromView(View, 1)
      case 'int16':
        View = new DataViewEX(new ArrayBuffer(2))
        View.setInt16(0, Value)
        return BufferFromView(View, 2)
      case 'int32':
        View = new DataViewEX(new ArrayBuffer(4))
        View.setInt32(0, Value)
        return BufferFromView(View, 4)
      case 'float16':
        View = new DataViewEX(new ArrayBuffer(2))
        View.setFloat16(0, Value)
        return BufferFromView(View, 2)
      case 'float32':
        View = new DataViewEX(new ArrayBuffer(4))
        View.setFloat32(0, Value)
        return BufferFromView(View, 4)
      default:
        throw new Error(`${Type} is an unknown conversion`)
    }
  }

  /**
   * Converts a Buffer value to a number based on the specified type.
   * @param Value - The Buffer value to be converted to a number.
   * @param Type - The type of conversion to be applied.
   * @param Options - Optional parameters.
   */
  static toNumber(Value: Buffer, Type: Types.Read.Buffer, Options?: { isLittle?: boolean }): number {
    // Parameter Checks: ///////////////////////////
    if (!Buffer.isBuffer(Value))
      throw new TypeError('The "Value" parameter must be a Buffer.')

    if (typeof Type !== 'string')
      throw new TypeError('The "Type" parameter must be a string.')
    // ////////////////////////////////////////////

    const Data = !Options?.isLittle ? Value : Endian(Value)

    let View: DataViewEX
    switch (Type) {
      case 'float16':
        View = new DataViewEX(new ArrayBuffer(2))
        View.setUint16(0, parseInt(Data.toString('hex'), 16))
        return View.getFloat16(0)
      case 'float32':
        View = new DataViewEX(new ArrayBuffer(4))
        View.setUint32(0, parseInt(Data.toString('hex'), 16))
        return View.getFloat32(0)
      case 'integer':
        return parseInt(Data.toString('hex'), 16)
      default:
        throw new Error(`${Type} is an unknown conversion`)
    }
  }
}
