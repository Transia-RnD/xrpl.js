import { assert } from 'chai'

import { validate, ValidationError } from '../../src'
import { validateContractModify } from '../../src/models/transactions/ContractModify'

/**
 * ContractModify Transaction Verification Testing.
 *
 * Providing runtime verification testing for each specific transaction type.
 */
describe('ContractModify', function () {
  let tx

  beforeEach(function () {
    tx = { /* TODO: add sample transaction */ } as any
  })

  it('verifies valid ContractModify', function () {
    assert.doesNotThrow(() => validateContractModify(tx))
    assert.doesNotThrow(() => validate(tx))
  })

  it('throws w/ invalid ContractAccount', function () {
    tx.ContractAccount = 123

    assert.throws(
      () => validateContractModify(tx),
      ValidationError,
      'ContractModify: invalid field ContractAccount',
    )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractModify: invalid field ContractAccount',
    )
  })

  it('throws w/ invalid ContractCode', function () {
    tx.ContractCode = 123

    assert.throws(
      () => validateContractModify(tx),
      ValidationError,
      'ContractModify: invalid field ContractCode',
    )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractModify: invalid field ContractCode',
    )
  })

  it('throws w/ invalid ContractHash', function () {
    tx.ContractHash = 123

    assert.throws(
      () => validateContractModify(tx),
      ValidationError,
      'ContractModify: invalid field ContractHash',
    )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractModify: invalid field ContractHash',
    )
  })

  it('throws w/ invalid Functions', function () {
    tx.Functions = /*TODO*/

    assert.throws(
      () => validateContractModify(tx),
      ValidationError,
      'ContractModify: invalid field Functions',
    )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractModify: invalid field Functions',
    )
  })

  it('throws w/ invalid InstanceParameters', function () {
    tx.InstanceParameters = /*TODO*/

    assert.throws(
      () => validateContractModify(tx),
      ValidationError,
      'ContractModify: invalid field InstanceParameters',
    )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractModify: invalid field InstanceParameters',
    )
  })

  it('throws w/ invalid InstanceParameterValues', function () {
    tx.InstanceParameterValues = /*TODO*/

    assert.throws(
      () => validateContractModify(tx),
      ValidationError,
      'ContractModify: invalid field InstanceParameterValues',
    )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractModify: invalid field InstanceParameterValues',
    )
  })

  it('throws w/ invalid URI', function () {
    tx.URI = 123

    assert.throws(
      () => validateContractModify(tx),
      ValidationError,
      'ContractModify: invalid field URI',
    )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractModify: invalid field URI',
    )
  })
})
