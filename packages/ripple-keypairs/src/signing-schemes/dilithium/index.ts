import { ml_dsa44 } from '@noble/post-quantum/ml-dsa.js'
import { bytesToHex } from '@xrplf/isomorphic/utils'
import Sha512 from '../../utils/Sha512'

import type { HexString, SigningScheme } from '../../types'
import assert from '../../utils/assert'

const dilithium: SigningScheme = {
  deriveKeypair(entropy: Uint8Array): {
    privateKey: string
    publicKey: string
  } {
    const rawPrivateKey = Sha512.half(entropy)
    const keys = ml_dsa44.keygen(rawPrivateKey)
    const privateKey = bytesToHex(keys.secretKey)
    const publicKey = bytesToHex(keys.publicKey)
    return { privateKey, publicKey }
  },

  sign(message: Uint8Array, privateKey: HexString): string {
    assert.ok(message instanceof Uint8Array, 'message must be array of octets')
    assert.ok(
      privateKey.length === 5120,
      'private key must be 2560 bytes including prefix',
    )
    return bytesToHex(
      ml_dsa44.sign(Uint8Array.from(Buffer.from(privateKey, 'hex')), message),
    )
  },

  verify(
    message: Uint8Array,
    signature: HexString,
    publicKey: string,
  ): boolean {
    // Unlikely to be triggered as these are internal and guarded by getAlgorithmFromKey
    assert.ok(
      publicKey.length === 2624,
      'public key must be 1312 bytes including prefix',
    )
    return ml_dsa44.verify(
      Uint8Array.from(Buffer.from(publicKey, 'hex')),
      message,
      Uint8Array.from(Buffer.from(signature, 'hex')),
    )
  },
}

export default dilithium
