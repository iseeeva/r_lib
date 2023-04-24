import * as fs from 'fs'
import _ from 'lodash-es'
import { hasOwn, isPlainObject } from '../utils.mjs'
import { DataViewEX } from './c_lib.mjs'

// Hex Reading Library by iseeeva //

export class HexReader {
  constructor(Filename) {
    /**
     * Config of Read Method
     */
    const Config = {
      Read: {
        File: { Name: '', Stream: 0 },
        Posses: [], // scan posses array
      },
    }

    /**
     * Hex Reader Method
     * @param {number} PosID Position ID of Reading Offset
     * @param {number} ReadTo Read to Position
     * @param {{swap_endian: boolean,add_pos: boolean,readAs: string}} Options Function Options
     * @returns
     */
    this.Read = function (PosID, ReadTo, Options) {
      // Okunan Alan?
      let ReadBuff = Buffer.alloc(ReadTo, 0)

      if (typeof Config.Read.Posses[PosID] !== 'number')
        Config.Read.Posses[PosID] = 0

      try {
        if (Config.Read.File.Name !== Filename) {
          fs.closeSync(Config.Read.File.Stream)
          Config.Read.File.Stream = fs.openSync(Filename, 'r')
          Config.Read.File.Name = Filename
        }
        fs.readSync(Config.Read.File.Stream, ReadBuff, 0, ReadTo, Config.Read.Posses[PosID])
      }
      catch (e) {
        throw new Error(`${Filename} cant be opened`)
      }

      if (isPlainObject(Options)) {
        if (hasOwn(Options, 'add_pos') && Options.add_pos === true)
          Config.Read.Posses[PosID] += ReadTo

        if (hasOwn(Options, 'swap_endian') && Options.swap_endian === true)
          ReadBuff = endian(ReadBuff)

        if (hasOwn(Options, 'readAs') && typeof Options.readAs === 'string')
          return readAs(Options.readAs)
      }

      function readAs(type) {
        let ocean = null; let view
        if (Buffer.isBuffer(ReadBuff)) {
          switch (type) {
            case 'float32':
              view = new DataViewEX(new ArrayBuffer(4))
              view.setUint32(0, parseInt(ReadBuff.toString('hex'), 16))
              ocean = view.getFloat32(0)
              return ocean
            case 'float16':
              view = new DataViewEX(new ArrayBuffer(2))
              view.setUint16(0, parseInt(ReadBuff.toString('hex'), 16))
              ocean = view.getFloat16(0)
              return ocean
            case 'integer':
              ocean = parseInt(ReadBuff.toString('hex'), 16)
              return ocean
            default:
              throw new Error(`${type} is unknown for readAs`)
          }
        }
        else {
          throw new TypeError('no method defined for the type of this value')
        }
      }
      return ReadBuff
    }

    /**
     * Get Offset with Position ID
     * @param {number} PosID Position ID of Offset
     * @returns {Array|number}
     */
    this.getOffset = function (PosID) {
      if (PosID == null) { return Config.Read.Posses }
      else if (typeof PosID === 'number') {
        if (typeof Config.Read.Posses[PosID] !== 'number')
          Config.Read.Posses[PosID] = 0
        return Config.Read.Posses[PosID]
      }
      else { throw new TypeError('The PosID must be a number') }
    }

    /**
     * Set Offset with Position ID
     * @param {number} PosID Position ID of Offset
     * @param {number} value New Offset Value
     */
    this.setOffset = function (PosID, value) {
      if (typeof PosID === 'number' && typeof value === 'number') {
        if (typeof Config.Read.Posses[PosID] !== 'number')
          Config.Read.Posses[PosID] = 0

        Config.Read.Posses[PosID] = value
        return true
      }
      else {
        throw new TypeError('The PosID and value must be a number')
      }
    }
  }
}

/**
 * Endian Swapping Function
 * @param {Buffer} Input Input Buffer
 * @returns {Buffer} Swapped Buffer
 */
export function endian(Input) {
  if (Buffer.isBuffer(Input)) {
    Input = Input.toString('hex')
    Input = Input.length % 2 ? `0${Input}` : Input
    Input = _.chunk(Input, 2).reverse().flat().join('')
    return Buffer.from(Input, 'hex')
  }
  else {
    throw new TypeError('Input must be a Buffer')
  }
}

/**
 * Value Converter Function
 * @param {number} value
 * @param {string} type
 * @param {{swap_endian:boolean}} options
 * @returns Buffer
 */
export function readAs(value, type, options) {
  const getHex = i => (`00${i.toString(16)}`).slice(-2)
  let ocean = null; let view

  if (typeof value === 'number') {
    switch (type) {
      case 'int8_hex': // Integer 8 to Hex Buffer
        view = new DataViewEX(new ArrayBuffer(1))
        view.setInt8(0, value)
        ocean = Buffer.from(Array.from({ length: 1 }, (_, i) => getHex(view.getUint8(i))).join(''), 'hex')
        break
      case 'int16_hex': // Integer 16 to Hex Buffer
        view = new DataViewEX(new ArrayBuffer(2))
        view.setInt16(0, value)
        ocean = Buffer.from(Array.from({ length: 2 }, (_, i) => getHex(view.getUint8(i))).join(''), 'hex')
        break
      case 'int32_hex': // Integer 32 to Hex Buffer
        view = new DataViewEX(new ArrayBuffer(4))
        view.setInt32(0, value)
        ocean = Buffer.from(Array.from({ length: 4 }, (_, i) => getHex(view.getUint8(i))).join(''), 'hex')
        break
      case 'float_hex': // Float32 to Hex Buffer
        view = new DataViewEX(new ArrayBuffer(4))
        view.setFloat32(0, value)
        ocean = Buffer.from(Array.from({ length: 4 }, (_, i) => getHex(view.getUint8(i))).join(''), 'hex')
        break
      default:
        throw new Error(`${type} is unknown for readAs`)
    }
  }
  else {
    throw new TypeError('no method defined for the type of this value')
  }

  if (isPlainObject(options)) {
    if (hasOwn(options, 'swap_endian') && options.swap_endian === true)
      ocean = endian(ocean)
  }

  return ocean
}
