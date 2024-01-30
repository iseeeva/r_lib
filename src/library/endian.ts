/** Endian Swapper */
export function Endian(Input: Buffer) {
  // Parameter Checks: ///////////////////////////
  if (!Buffer.isBuffer(Input))
    throw new TypeError('The "Input" parameter must be a Buffer.')
  // ////////////////////////////////////////////

  let Value = Input.toString('hex')
  Value = Value.length % 2 ? `0${Value}` : Value
  Value = Value.match(/.{1,2}/g).reverse().flat().join('')
  return Buffer.from(Value, 'hex')
}
