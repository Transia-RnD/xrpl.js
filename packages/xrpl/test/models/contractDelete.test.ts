import { assert } from 'chai'

import { validate, ValidationError } from '../../src'
import { validateContractDelete } from '../../src/models/transactions/ContractDelete'

/**
 * ContractDelete Transaction Verification Testing.
 *
 * Providing runtime verification testing for each specific transaction type.
 */
describe('ContractDelete', function () {
  let tx

  beforeEach(function () {
    tx = { /* TODO: add sample transaction */ } as any
  })

  it('verifies valid ContractDelete', function () {
    assert.doesNotThrow(() => validateContractDelete(tx))
    assert.doesNotThrow(() => validate(tx))
  })

  it("throws w/ missing ContractAccount", function () {
    delete tx.ContractAccount

    assert.throws(
      () => validateContractDelete(tx),
      ValidationError,
      'ContractDelete: missing field ContractAccount',
    )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractDelete: missing field ContractAccount',
    )
  })

  it('throws w/ invalid ContractAccount', function () {
    tx.ContractAccount = 123

    assert.throws(
      () => validateContractDelete(tx),
      ValidationError,
      'ContractDelete: invalid field ContractAccount',
    )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractDelete: invalid field ContractAccount',
    )
  })
})
