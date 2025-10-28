import { XrplError } from '../errors'
import { Parameter, InstanceParameter } from '../models/common'

function isHex(value: string): boolean {
  return /^[0-9A-F]+$/iu.test(value)
}

function hexValue(value: string): string {
  return Buffer.from(value, 'utf8').toString('hex').toUpperCase()
}

/**
 * Convert each Parameter.ParameterName in the provided array to an uppercase hexadecimal string
 * if it is not already a hex string.
 *
 * @param data - Array of Parameter objects to normalize.
 * @returns A new array of Parameter objects with ParameterName values in uppercase hex.
 * @throws {XrplError} If a Parameter is not an object or if ParameterName is not a string.
 */
export function hexParameters(data: Parameter[]): Parameter[] {
  const hookParameters: Parameter[] = []
  for (const paramMap of data) {
    if (typeof paramMap.Parameter !== 'object') {
      throw new XrplError('hexParameters: Parameter must be an object')
    }

    if (typeof paramMap.Parameter.ParameterName !== 'string') {
      throw new XrplError('hexParameters: ParameterName must be a string')
    }
    let parameterName = paramMap.Parameter.ParameterName
    if (!isHex(parameterName)) {
      parameterName = hexValue(parameterName)
    }

    hookParameters.push({
      Parameter: {
        ...paramMap.Parameter,
        ParameterName: parameterName,
      },
    })
  }
  return hookParameters
}

/**
 * Convert each InstanceParameter.ParameterName in the provided array to an uppercase hexadecimal string
 * if it is not already a hex string.
 *
 * @param data - Array of InstanceParameter objects to normalize.
 * @returns A new array of InstanceParameter objects with ParameterName values in uppercase hex.
 * @throws {XrplError} If an InstanceParameter is not an object or if ParameterName is not a string.
 */
export function hexInstanceParameters(
  data: InstanceParameter[],
): InstanceParameter[] {
  const hookParameters: InstanceParameter[] = []
  for (const paramMap of data) {
    if (typeof paramMap.InstanceParameter !== 'object') {
      throw new XrplError(
        'hexInstanceParameters: InstanceParameter must be an object',
      )
    }

    if (typeof paramMap.InstanceParameter.ParameterName !== 'string') {
      throw new XrplError(
        'hexInstanceParameters: ParameterName must be a string',
      )
    }
    let parameterName = paramMap.InstanceParameter.ParameterName
    if (!isHex(parameterName)) {
      parameterName = hexValue(parameterName)
    }

    hookParameters.push({
      InstanceParameter: {
        ...paramMap.InstanceParameter,
        ParameterName: parameterName,
      },
    })
  }
  return hookParameters
}
