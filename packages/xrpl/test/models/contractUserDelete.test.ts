import { assert } from 'chai'

import { validate, ValidationError } from '../../src'
import { validateContractUserDelete } from '../../src/models/transactions/contractUserDelete'

/**
 * ContractUserDelete Transaction Verification Testing.
 *
 * Providing runtime verification testing for each specific transaction type.
 */
describe('ContractUserDelete', function () {
  let tx

  beforeEach(function () {
    tx = {
      /* TODO: add sample transaction */
    } as any
  })

  it('verifies valid ContractUserDelete', function () {
    assert.doesNotThrow(() => validateContractUserDelete(tx))
    assert.doesNotThrow(() => validate(tx))
  })

  it('throws w/ missing ComputationAllowance', function () {
    delete tx.ComputationAllowance

    assert.throws(
      () => validateContractUserDelete(tx),
      ValidationError,
      'ContractUserDelete: missing field ComputationAllowance',
    )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractUserDelete: missing field ComputationAllowance',
    )
  })

  it('throws w/ invalid ComputationAllowance', function () {
    tx.ComputationAllowance = 'number'

    assert.throws(
      () => validateContractUserDelete(tx),
      ValidationError,
      'ContractUserDelete: invalid field ComputationAllowance',
    )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractUserDelete: invalid field ComputationAllowance',
    )
  })

  it('throws w/ missing ContractAccount', function () {
    delete tx.ContractAccount

    assert.throws(
      () => validateContractUserDelete(tx),
      ValidationError,
      'ContractUserDelete: missing field ContractAccount',
    )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractUserDelete: missing field ContractAccount',
    )
  })

  it('throws w/ invalid ContractAccount', function () {
    tx.ContractAccount = 123

    assert.throws(
      () => validateContractUserDelete(tx),
      ValidationError,
      'ContractUserDelete: invalid field ContractAccount',
    )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractUserDelete: invalid field ContractAccount',
    )
  })

  it('throws w/ missing FunctionName', function () {
    delete tx.FunctionName

    assert.throws(
      () => validateContractUserDelete(tx),
      ValidationError,
      'ContractUserDelete: missing field FunctionName',
    )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractUserDelete: missing field FunctionName',
    )
  })

  it('throws w/ invalid FunctionName', function () {
    tx.FunctionName = 123

    assert.throws(
      () => validateContractUserDelete(tx),
      ValidationError,
      'ContractUserDelete: invalid field FunctionName',
    )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractUserDelete: invalid field FunctionName',
    )
  })

  it('throws w/ invalid Parameters', function () {
    tx.Parameters =
      /*TODO*/

      assert.throws(
        () => validateContractUserDelete(tx),
        ValidationError,
        'ContractUserDelete: invalid field Parameters',
      )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractUserDelete: invalid field Parameters',
    )
  })
})
