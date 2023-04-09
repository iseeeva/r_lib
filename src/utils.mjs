import { fileURLToPath } from 'url'
import { dirname } from 'path'

/**
 *
 * @param {unknown} value
 * @returns {string}
 */
export const typeOf = value => Object.prototype.toString.call(value).slice(8, -1)

/**
 *
 * @param {Object} object
 * @param {PropertyKey} key
 * @returns {boolean}
 */
export const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key)

/**
 *
 * @param {string} url
 * @returns {string}
 */
export const dirNameFileURL = url => dirname(fileURLToPath(url))

/** @type {(value) => value is Record<PropertyKey, any>} */
export const isPlainObject = value => typeOf(value) === 'Object'

/**
 * @type {(str: string) => string}
 */
export const removeSpaces = str => str.replace(/\s+/, '')
