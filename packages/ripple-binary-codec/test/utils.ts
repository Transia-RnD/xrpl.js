import { hexToBytes } from '@transia/isomorphic/utils'

export function hexOnly(hex: string): string {
  return hex.replace(/[^a-fA-F0-9]/g, '')
}

export function parseHexOnly(hex: string): Uint8Array {
  return hexToBytes(hexOnly(hex))
}
