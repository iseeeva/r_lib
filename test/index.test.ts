import { describe as Describe, expect as Expect, it as It } from 'vitest'
import { Convert, Endian, HexReader } from '../src/index.js'

Describe('Test Cases', () => {
  It('HexReader', () => {
    const Reader = new HexReader('./test/test.hex')

    const Items = [
      // Float16
      { Value: Reader.read(0, 7).toString(), Expected: 'FLOAT16' },
      { Value: Reader.setOffset(0, 7), Expected: 7 },
      { Value: Reader.read(0, 2, { readAs: 'float16', addPos: true }), Expected: 45.5 },
      { Value: Reader.read(0, 2, { readAs: 'float16', addPos: true, isLittle: true }), Expected: 45.375 },
      // Float32
      { Value: Reader.read(0, 7).toString(), Expected: 'FLOAT32' },
      { Value: Reader.setOffset(0, Reader.getOffset(0) + 7), Expected: 18 },
      { Value: Reader.read(0, 4, { readAs: 'float32', addPos: true }), Expected: 15.5 },
      { Value: Reader.read(0, 4, { readAs: 'float32', addPos: true, isLittle: true }), Expected: 15.375 },
      // Integer
      { Value: Reader.read(0, 7).toString(), Expected: 'INTEGER' },
      { Value: Reader.setOffset(0, Reader.getOffset(0) + 7), Expected: 33 },
      { Value: Reader.read(0, 2, { readAs: 'integer', addPos: true }), Expected: 45 },
      { Value: Reader.read(0, 4, { readAs: 'integer', addPos: true, isLittle: true }), Expected: 15 },
    ]

    Items.forEach((Element) => {
      Expect(typeof Element === 'object').toBe(true)
      Expect(Element.Value).toEqual(Element.Expected)
    })
  })

  It('Endian', () => {
    const Items = [
      // 1 Byte - you know what means ;) (we're fucked)
      { Value: Endian(Buffer.from('7E', 'hex')), Expected: Buffer.from('7E', 'hex') },
      // 2 Byte
      { Value: Endian(Buffer.from('CE1B', 'hex')), Expected: Buffer.from('1BCE', 'hex') },
      { Value: Endian(Buffer.from('232E', 'hex')), Expected: Buffer.from('2E23', 'hex') },
      // 4 Byte
      { Value: Endian(Buffer.from('AF4CE4DE', 'hex')), Expected: Buffer.from('DEE44CAF', 'hex') },
      { Value: Endian(Buffer.from('22F1FD97', 'hex')), Expected: Buffer.from('97FDF122', 'hex') },
      // 8 Byte
      { Value: Endian(Buffer.from('91C565FDB62613A4', 'hex')), Expected: Buffer.from('A41326B6FD65C591', 'hex') },
      { Value: Endian(Buffer.from('CC2A0666724CFC7C', 'hex')), Expected: Buffer.from('7CFC4C7266062ACC', 'hex') },
    ]

    Items.forEach((Element) => {
      Expect(typeof Element === 'object').toBe(true)
      Expect(Element.Value).toEqual(Element.Expected)
    })
  })

  It('Convert', () => {
    const Items = [
      // ====================== Convert.toBuffer ======================
      // Int8
      { Value: Convert.toBuffer(116, 'int8'), Expected: Buffer.from('74', 'hex') },
      { Value: Convert.toBuffer(69, 'int8', { isLittle: true }), Expected: Buffer.from('45', 'hex') },
      // Int16
      { Value: Convert.toBuffer(18158, 'int16'), Expected: Buffer.from('46EE', 'hex') },
      { Value: Convert.toBuffer(8248, 'int16', { isLittle: true }), Expected: Buffer.from('3820', 'hex') },
      // Int32
      { Value: Convert.toBuffer(863894199, 'int32'), Expected: Buffer.from('337DFAB7', 'hex') },
      { Value: Convert.toBuffer(225271883, 'int32', { isLittle: true }), Expected: Buffer.from('4B606D0D', 'hex') },
      // Float16
      { Value: Convert.toBuffer(35.5, 'float16'), Expected: Buffer.from('5070', 'hex') },
      { Value: Convert.toBuffer(5.672, 'float16', { isLittle: true }), Expected: Buffer.from('AC45', 'hex') },
      // Float32
      { Value: Convert.toBuffer(7.5, 'float32'), Expected: Buffer.from('40F00000', 'hex') },
      { Value: Convert.toBuffer(130.375, 'float32', { isLittle: true }), Expected: Buffer.from('00600243', 'hex') },
      // ====================== Convert.toNumber ======================
      // Float16
      { Value: Convert.toNumber(Buffer.from('4C60', 'hex'), 'float16'), Expected: 17.5 },
      { Value: Convert.toNumber(Buffer.from('B454', 'hex'), 'float16', { isLittle: true }), Expected: 75.25 },
      // Float32
      { Value: Convert.toNumber(Buffer.from('42828000', 'hex'), 'float32'), Expected: 65.25 },
      { Value: Convert.toNumber(Buffer.from('0040AF43', 'hex'), 'float32', { isLittle: true }), Expected: 350.5 },
      // Integer
      { Value: Convert.toNumber(Buffer.from('0005ED45', 'hex'), 'integer'), Expected: 388421 },
      { Value: Convert.toNumber(Buffer.from('A7F60600', 'hex'), 'integer', { isLittle: true }), Expected: 456359 },
    ]

    Items.forEach((Element) => {
      Expect(typeof Element === 'object').toBe(true)
      Expect(Element.Value).toEqual(Element.Expected)
    })
  })
})
