import path from 'path'
import { HexReader, endian, readAs } from '../src/lib/r_lib.mjs'
import { dirNameFileURL } from '../src/utils.mjs'
const __dirname = dirNameFileURL(import.meta.url)

const Test = {
  /**
   * HexReader: Hex Reading Class
   */
  HexReader: null,

  /**
   * Endian: Value Swapper Function
   */
  Endian: null,

  /**
   * ReadAs: Value Converter Function
   */
  ReadAs: null,
}

//#region HexReader Test Cases
Test.HexReader = (function () {
  console.log('\n[HexReader Test Cases]')

  const Reader = new HexReader(path.join(__dirname, 'test.hex'))
  const ReaderTypes = {
    readAs(Type) {
      return ['INTEGER', 'FLOAT32', 'FLOAT16'].includes(Type)
    },
    setOffset(Type) {
      return ['RESET'].includes(Type)
    },
  }

  const ReaderArray = [
    { Type: 'INTEGER', Value: Reader.Read(0, 4, { add_pos: true, readAs: 'integer', swap_endian: true }), Expected: 89 },
    { Type: 'INTEGER', Value: Reader.Read(0, 4, { add_pos: true, readAs: 'integer', swap_endian: false }), Expected: 8169 },
    { Type: 'FLOAT32', Value: parseFloat(Reader.Read(0, 4, { add_pos: true, readAs: 'float32', swap_endian: false }).toFixed(3)), Expected: 5.300 },
    { Type: 'FLOAT16', Value: Reader.Read(0, 2, { add_pos: true, readAs: 'float16', swap_endian: false }), Expected: 78.5 },
    { Type: 'RESET', Value: Reader.setOffset(0, 0), Expected: 0 },
    { Type: 'INTEGER', Value: Reader.Read(0, 4, { add_pos: true, readAs: 'integer', swap_endian: true }), Expected: 89 },
    { Type: 'RESET', Value: Reader.setOffset(0, 12), Expected: 12 },
    { Type: 'FLOAT16', Value: Reader.Read(0, 2, { add_pos: true, readAs: 'float16', swap_endian: false }), Expected: 78.5 },
  ]

  ReaderArray.forEach((Element) => {
    if (typeof Element === 'object' && ReaderTypes.readAs(Element.Type))
      console.log(Element.Type, Element.Value, Element.Value === Element.Expected ? 'PASS' : 'FAILED')
    else if (ReaderTypes.setOffset(Element.Type))
      console.log('OFFSET SETTING', Element.Value)
    else
      throw new TypeError('Invalid Element Type')
  })
}())
//#endregion

//#region Endian Test Cases
Test.Endian = (function () {
  console.log('\n[Endian Test Cases]')

  const Fixed = (Input) => { return (Input).toString('hex').toUpperCase() }
  const EndianArray = [
    { Value: Fixed(endian(Buffer.from('5C2A6E8E', 'hex'))), Expected: Fixed(Buffer.from('8E6E2A5C', 'hex')) },
    { Value: Fixed(endian(Buffer.from('B18AC80D', 'hex'))), Expected: Fixed(Buffer.from('0DC88AB1', 'hex')) },
    { Value: Fixed(endian(Buffer.from('4A1C0A5B4F397300', 'hex'))), Expected: Fixed(Buffer.from('0073394F5B0A1C4A', 'hex')) },
  ]

  EndianArray.forEach((Element) => {
    if (typeof Element === 'object')
      console.log(Element.Value, Element.Value === Element.Expected ? 'PASS' : 'FAILED')
    else
      throw new TypeError('Invalid Element Type')
  })
}())
//#endregion

//#region ReadAs Test Cases
Test.ReadAs = (function () {
  console.log('\n[ReadAs Test Cases]')

  const ReadAsTypes = (Type) => { return ['INT8_HEX', 'INT16_HEX', 'INT32_HEX', 'FLOAT_HEX'].includes(Type) }

  const Fixed = (Input) => { return (Input).toString('hex').toUpperCase() }
  const ReadAsArray = [
    { Type: 'FLOAT_HEX', Value: Fixed(readAs(75432456, 'float_hex', { swap_endian: true })), Expected: Fixed(Buffer.from('41E08F4C', 'hex')) },
    { Type: 'INT32_HEX', Value: Fixed(readAs(961501962, 'int32_hex', { swap_endian: true })), Expected: Fixed(Buffer.from('0A5B4F39', 'hex')) },
    { Type: 'INT16_HEX', Value: Fixed(readAs(46852, 'int16_hex', { swap_endian: false })), Expected: Fixed(Buffer.from('B704', 'hex')) },
    { Type: 'INT8_HEX', Value: Fixed(readAs(231, 'int8_hex')), Expected: Fixed(Buffer.from('E7', 'hex')) },
  ]

  ReadAsArray.forEach((Element) => {
    if (typeof Element === 'object' && ReadAsTypes(Element.Type))
      console.log(Element.Type, Element.Value, Element.Value === Element.Expected ? 'PASS' : 'FAILED')
    else
      throw new TypeError('Invalid Element Type')
  })
}())
//#endregion
