import { assert } from 'chai'

import { validate, ValidationError } from '../../src'
import { validateContractClawback } from '../../src/models/transactions/ContractClawback'

/**
 * ContractClawback Transaction Verification Testing.
 *
 * Providing runtime verification testing for each specific transaction type.
 */
describe('ContractClawback', function () {
  let tx

  beforeEach(function () {
    tx = { /* TODO: add sample transaction */ } as any
  })

  it('verifies valid ContractClawback', function () {
    assert.doesNotThrow(() => validateContractClawback(tx))
    assert.doesNotThrow(() => validate(tx))
  })

  it("throws w/ missing Amount", function () {
    delete tx.Amount

    assert.throws(
      () => validateContractClawback(tx),
      ValidationError,
      'ContractClawback: missing field Amount',
    )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractClawback: missing field Amount',
    )
  })

  it('throws w/ invalid Amount', function () {
    tx.Amount = {"currency":"ETH"}

    assert.throws(
      () => validateContractClawback(tx),
      ValidationError,
      'ContractClawback: invalid field Amount',
    )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractClawback: invalid field Amount',
    )
  })

  it('throws w/ invalid ContractAccount', function () {
    tx.ContractAccount = 123

    assert.throws(
      () => validateContractClawback(tx),
      ValidationError,
      'ContractClawback: invalid field ContractAccount',
    )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractClawback: invalid field ContractAccount',
    )
  })
})
