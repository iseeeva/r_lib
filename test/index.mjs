import path from 'path'
import { HexReader } from '../src/lib/r_lib.mjs'
import { dirNameFileURL } from '../src/utils.mjs'

const __dirname = dirNameFileURL(import.meta.url)

const Reader = new HexReader(path.join(__dirname, 'test.hex'))

console.log([
  { Current: Reader.getOffset(0), Type: 'integer', Value: Reader.Read(0, 4, { add_pos: true, readAs: 'integer', swap_endian: true }), Expected: 89 },
  { Current: Reader.getOffset(0), Type: 'integer', Value: Reader.Read(0, 4, { add_pos: true, readAs: 'integer', swap_endian: false }), Expected: 8169 },
  { Current: Reader.getOffset(0), Type: 'float32', Value: Reader.Read(0, 4, { add_pos: true, readAs: 'float32', swap_endian: false }), Expected: 5.300 },
  { Current: Reader.getOffset(0), Type: 'float16', Value: Reader.Read(0, 2, { add_pos: true, readAs: 'float16', swap_endian: false }), Expected: 78.5 },
  `Offset Reset, ${Reader.setOffset(0, 0)}`,
  { Current: Reader.getOffset(0), Type: 'integer', Value: Reader.Read(0, 4, { add_pos: true, readAs: 'integer', swap_endian: true }), Expected: 89 },
  `Offset Reset, ${Reader.setOffset(0, 12)}`,
  { Current: Reader.getOffset(0), Type: 'float16', Value: Reader.Read(0, 2, { add_pos: true, readAs: 'float16', swap_endian: false }), Expected: 78.5 },
])
