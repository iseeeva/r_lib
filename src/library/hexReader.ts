import fs from 'fs'
import path from 'path'
import type * as Types from '../types/library.js'
import { Endian } from './endian.js'
import { Convert } from './convert.js'

/** Hex Reading Class */
export class HexReader {
  private Config = {
    Read: {
      File: { Name: '', Stream: 0 },
      Posses: [] as number[],
    },
  }

  constructor(File: string) {
    if (fs.existsSync(File)) {
      this.Config.Read.File = {
        Name: path.basename(File),
        Stream: fs.openSync(File, 'r'),
      }
    }
    else { throw new Error(`${File} does not exist`) }
  }

  /**
   * Reading Method
   * @param ID - Position ID of the offset.
   * @param Length - Length of data to read.
   * @param Options - Optional parameters.
   */
  read(ID: number, Length: number, Options?: { isLittle?: boolean; addPos?: boolean; readAs?: never }): Buffer
  read(ID: number, Length: number, Options?: { isLittle?: boolean; addPos?: boolean; readAs?: Types.Read.Buffer }): number
  read(ID: number, Length: number, Options?: { isLittle?: boolean; addPos?: boolean; readAs?: never | Types.Read.Buffer }): Buffer | number {
    // Parameter Checks: ///////////////////////////
    if (typeof ID !== 'number')
      throw new TypeError('The "ID" parameter must be a number.')

    if (typeof Length !== 'number')
      throw new TypeError('The "Length" parameter must be a number.')
    // ////////////////////////////////////////////

    // Okunan Alan?
    let Data = Buffer.alloc(Length, 0)

    try {
      fs.readSync(this.Config.Read.File.Stream, Data, 0, Length, this.Config.Read.Posses[ID])
    }
    catch (e) {
      throw new Error(`Error on trying to read "${this.Config.Read.File.Name}": ${e.message}`)
    }

    if (typeof this.Config.Read.Posses[ID] !== 'number')
      this.setOffset(ID, 0)

    if (typeof Options === 'object') {
      if (Options?.addPos === true)
        this.Config.Read.Posses[ID] += Length

      if (Options?.isLittle === true)
        Data = Endian(Data)

      if (Options?.readAs)
        return Convert.toNumber(Data, Options.readAs)
    }

    return Data
  }

  /**
   * Get Offset with Position ID
   * @param ID - Position ID of the offset.
   */
  getOffset(ID: never): number[]
  getOffset(ID: number): number
  getOffset(ID: never | number): number[] | number {
    if (ID == null)
      return this.Config.Read.Posses

    if (typeof ID === 'number') {
      if (typeof this.Config.Read.Posses[ID] === 'number')
        return this.Config.Read.Posses[ID]
      else
        throw new Error(`${ID}, Position ID not allocated yet`)
    }
    else { throw new TypeError('The "ID" parameter must be a number.') }
  }

  /**
   * Set Offset with Position ID
   * @param ID - Position ID of the offset.
   * @param Value - Value for the new offset.
   */
  setOffset(ID: number, Value: number): number {
    // Parameter Checks: ///////////////////////////
    if (typeof ID !== 'number')
      throw new TypeError('The "ID" parameter must be a number.')

    if (typeof Value !== 'number')
      throw new TypeError('The "Value" parameter must be a number.')
    // ////////////////////////////////////////////

    return (this.Config.Read.Posses[ID] = Value)
  }
}
