import { assert } from 'chai'

import { validate, ValidationError } from '../../src'
import { validateContractCall } from '../../src/models/transactions/contractCall'

/**
 * ContractCall Transaction Verification Testing.
 *
 * Providing runtime verification testing for each specific transaction type.
 */
describe('ContractCall', function () {
  let tx

  beforeEach(function () {
    tx = {
      /* TODO: add sample transaction */
    } as any
  })

  it('verifies valid ContractCall', function () {
    assert.doesNotThrow(() => validateContractCall(tx))
    assert.doesNotThrow(() => validate(tx))
  })

  it('throws w/ missing ComputationAllowance', function () {
    delete tx.ComputationAllowance

    assert.throws(
      () => validateContractCall(tx),
      ValidationError,
      'ContractCall: missing field ComputationAllowance',
    )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractCall: missing field ComputationAllowance',
    )
  })

  it('throws w/ invalid ComputationAllowance', function () {
    tx.ComputationAllowance = 'number'

    assert.throws(
      () => validateContractCall(tx),
      ValidationError,
      'ContractCall: invalid field ComputationAllowance',
    )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractCall: invalid field ComputationAllowance',
    )
  })

  it('throws w/ missing ContractAccount', function () {
    delete tx.ContractAccount

    assert.throws(
      () => validateContractCall(tx),
      ValidationError,
      'ContractCall: missing field ContractAccount',
    )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractCall: missing field ContractAccount',
    )
  })

  it('throws w/ invalid ContractAccount', function () {
    tx.ContractAccount = 123

    assert.throws(
      () => validateContractCall(tx),
      ValidationError,
      'ContractCall: invalid field ContractAccount',
    )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractCall: invalid field ContractAccount',
    )
  })

  it('throws w/ missing FunctionName', function () {
    delete tx.FunctionName

    assert.throws(
      () => validateContractCall(tx),
      ValidationError,
      'ContractCall: missing field FunctionName',
    )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractCall: missing field FunctionName',
    )
  })

  it('throws w/ invalid FunctionName', function () {
    tx.FunctionName = 123

    assert.throws(
      () => validateContractCall(tx),
      ValidationError,
      'ContractCall: invalid field FunctionName',
    )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractCall: invalid field FunctionName',
    )
  })

  it('throws w/ invalid Parameters', function () {
    tx.Parameters =
      /*TODO*/

      assert.throws(
        () => validateContractCall(tx),
        ValidationError,
        'ContractCall: invalid field Parameters',
      )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractCall: invalid field Parameters',
    )
  })
})
