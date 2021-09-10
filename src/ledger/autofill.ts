import BigNumber from 'bignumber.js'
import { xAddressToClassicAddress, isValidXAddress } from 'ripple-address-codec'

import type { Client } from '..'
import { ValidationError } from '../common/errors'
import { AccountInfoRequest, LedgerRequest } from '../models/methods'
import { Transaction } from '../models/transactions'
import { setTransactionFlagsToNumber } from '../models/utils'
import { xrpToDrops } from '../utils'

// 20 drops
const LEDGER_OFFSET = 20
// 5 XRP
const ACCOUNT_DELETE_FEE = 5000000
interface ClassicAccountAndTag {
  classicAccount: string
  tag: number | false | undefined
}

/**
 * Autofills fields in a transaction.
 *
 * @param client - A client.
 * @param tx - A transaction to autofill fields.
 * @param signersCount - The expected number of signers for this transaction. Used for multisign.
 * @returns An autofilled transaction.
 */
async function autofill(
  client: Client,
  tx: Transaction,
  signersCount?: number,
): Promise<Transaction> {
  setValidAddresses(tx)

  setTransactionFlagsToNumber(tx)

  const promises: Array<Promise<void>> = []
  if (tx.Sequence == null) {
    promises.push(setNextValidSequenceNumber(client, tx))
  }
  if (tx.Fee == null) {
    promises.push(calculateFeePerTransactionType(client, tx, signersCount))
  }
  if (tx.LastLedgerSequence == null) {
    promises.push(setLatestValidatedLedgerSequence(client, tx))
  }

  return Promise.all(promises).then(() => tx)
}

function setValidAddresses(tx: Transaction): void {
  validateAccountAddress(tx, 'Account', 'SourceTag')
  // eslint-disable-next-line @typescript-eslint/dot-notation -- Destination can exist on Transaction
  if (tx['Destination'] != null) {
    validateAccountAddress(tx, 'Destination', 'DestinationTag')
  }

  // DepositPreauth:
  convertToClassicAddress(tx, 'Authorize')
  convertToClassicAddress(tx, 'Unauthorize')
  // EscrowCancel, EscrowFinish:
  convertToClassicAddress(tx, 'Owner')
  // SetRegularKey:
  convertToClassicAddress(tx, 'RegularKey')
}

function validateAccountAddress(
  tx: Transaction,
  accountField: string,
  tagField: string,
): void {
  // if X-address is given, convert it to classic address
  const { classicAccount, tag } = getClassicAccountAndTag(tx[accountField])
  // eslint-disable-next-line no-param-reassign -- param reassign is safe
  tx[accountField] = classicAccount

  if (tag != null && tag !== false) {
    if (tx[tagField] && tx[tagField] !== tag) {
      throw new ValidationError(
        `The ${tagField}, if present, must match the tag of the ${accountField} X-address`,
      )
    }
    // eslint-disable-next-line no-param-reassign -- param reassign is safe
    tx[tagField] = tag
  }
}

function getClassicAccountAndTag(
  Account: string,
  expectedTag?: number,
): ClassicAccountAndTag {
  if (isValidXAddress(Account)) {
    const classic = xAddressToClassicAddress(Account)
    if (expectedTag != null && classic.tag !== expectedTag) {
      throw new ValidationError(
        'address includes a tag that does not match the tag specified in the transaction',
      )
    }
    return {
      classicAccount: classic.classicAddress,
      tag: classic.tag,
    }
  }
  return {
    classicAccount: Account,
    tag: expectedTag,
  }
}

function convertToClassicAddress(tx: Transaction, fieldName: string): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- assignment is safe
  const account = tx[fieldName]
  if (typeof account === 'string') {
    const { classicAccount } = getClassicAccountAndTag(account)
    // eslint-disable-next-line no-param-reassign -- param reassign is safe
    tx[fieldName] = classicAccount
  }
}

async function setNextValidSequenceNumber(
  client: Client,
  tx: Transaction,
): Promise<void> {
  const request: AccountInfoRequest = {
    command: 'account_info',
    account: tx.Account,
  }
  const data = await client.request(request)
  // eslint-disable-next-line no-param-reassign, require-atomic-updates -- param reassign is safe with no race condition
  tx.Sequence = data.result.account_data.Sequence
}

async function calculateFeePerTransactionType(
  client: Client,
  tx: Transaction,
  signersCount = 0,
): Promise<void> {
  // netFee is usually 0.00001 XRP (10 drops)
  const netFeeXRP: string = await client.getFee()
  const netFeeDrops: string = xrpToDrops(netFeeXRP)
  let baseFee: BigNumber = new BigNumber(netFeeDrops)

  // EscrowFinish Transaction with Fulfillment
  if (tx.TransactionType === 'EscrowFinish' && tx.Fulfillment != null) {
    const fulfillmentBytesSize: number = Math.ceil(tx.Fulfillment.length / 2)
    // 10 drops × (33 + (Fulfillment size in bytes / 16))
    const product = new BigNumber(
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- expected use of magic numbers
      scaleValue(netFeeDrops, 33 + fulfillmentBytesSize / 16),
    )
    baseFee = product.dp(0, BigNumber.ROUND_CEIL)
  }

  // AccountDelete Transaction
  if (tx.TransactionType === 'AccountDelete') {
    baseFee = new BigNumber(ACCOUNT_DELETE_FEE)
  }

  // Multi-signed Transaction
  // 10 drops × (1 + Number of Signatures Provided)
  if (signersCount > 0) {
    baseFee = BigNumber.sum(baseFee, scaleValue(netFeeDrops, 1 + signersCount))
  }

  const maxFeeDrops = xrpToDrops(client.maxFeeXRP)
  const totalFee =
    tx.TransactionType === 'AccountDelete'
      ? baseFee
      : BigNumber.min(baseFee, maxFeeDrops)

  // Round up baseFee and return it as a string
  // eslint-disable-next-line no-param-reassign, @typescript-eslint/no-magic-numbers -- param reassign is safe, base 10 magic num
  tx.Fee = totalFee.dp(0, BigNumber.ROUND_CEIL).toString(10)
}

function scaleValue(value, multiplier): string {
  return new BigNumber(value).times(multiplier).toString()
}

async function setLatestValidatedLedgerSequence(
  client: Client,
  tx: Transaction,
): Promise<void> {
  const request: LedgerRequest = {
    command: 'ledger',
    ledger_index: 'validated',
  }
  const data = await client.request(request)
  const ledgerSequence = data.result.ledger_index
  // eslint-disable-next-line no-param-reassign -- param reassign is safe
  tx.LastLedgerSequence = ledgerSequence + LEDGER_OFFSET
}

export default autofill