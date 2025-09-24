import { assert } from 'chai'

import { validate, ValidationError } from '../../src'
import { validateContractCreate } from '../../src/models/transactions/ContractCreate'

/**
 * ContractCreate Transaction Verification Testing.
 *
 * Providing runtime verification testing for each specific transaction type.
 */
describe('ContractCreate', function () {
  let tx

  beforeEach(function () {
    tx = { /* TODO: add sample transaction */ } as any
  })

  it('verifies valid ContractCreate', function () {
    assert.doesNotThrow(() => validateContractCreate(tx))
    assert.doesNotThrow(() => validate(tx))
  })

  it('throws w/ invalid ContractCode', function () {
    tx.ContractCode = 123

    assert.throws(
      () => validateContractCreate(tx),
      ValidationError,
      'ContractCreate: invalid field ContractCode',
    )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractCreate: invalid field ContractCode',
    )
  })

  it('throws w/ invalid ContractHash', function () {
    tx.ContractHash = 123

    assert.throws(
      () => validateContractCreate(tx),
      ValidationError,
      'ContractCreate: invalid field ContractHash',
    )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractCreate: invalid field ContractHash',
    )
  })

  it('throws w/ invalid Functions', function () {
    tx.Functions = /*TODO*/

    assert.throws(
      () => validateContractCreate(tx),
      ValidationError,
      'ContractCreate: invalid field Functions',
    )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractCreate: invalid field Functions',
    )
  })

  it('throws w/ invalid InstanceParameters', function () {
    tx.InstanceParameters = /*TODO*/

    assert.throws(
      () => validateContractCreate(tx),
      ValidationError,
      'ContractCreate: invalid field InstanceParameters',
    )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractCreate: invalid field InstanceParameters',
    )
  })

  it('throws w/ invalid InstanceParameterValues', function () {
    tx.InstanceParameterValues = /*TODO*/

    assert.throws(
      () => validateContractCreate(tx),
      ValidationError,
      'ContractCreate: invalid field InstanceParameterValues',
    )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractCreate: invalid field InstanceParameterValues',
    )
  })

  it('throws w/ invalid URI', function () {
    tx.URI = 123

    assert.throws(
      () => validateContractCreate(tx),
      ValidationError,
      'ContractCreate: invalid field URI',
    )
    assert.throws(
      () => validate(tx),
      ValidationError,
      'ContractCreate: invalid field URI',
    )
  })
})
