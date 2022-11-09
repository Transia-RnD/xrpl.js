import { ValidationError } from '../../errors'

import { AMM_MAX_TRADING_FEE } from './AMMCreate'
import { BaseTransaction, validateBaseTransaction } from './common'

/**
 * AMMVote is used for submitting a vote for the trading fee of an AMM Instance.
 *
 * Any XRPL account that holds LPToken for an AMM instance may submit this
 * transaction to vote for the trading fee for that instance.
 */
export interface AMMVote extends BaseTransaction {
  TransactionType: 'AMMVote'

  /**
   * A hash that uniquely identifies the AMM instance. This field is required.
   */
  AMMID: string

  /**
   * Specifies the fee, in basis point.
   * Valid values for this field are between 0 and 65000 inclusive.
   * A value of 1 is equivalent to 1/10 bps or 0.001%, allowing trading fee
   * between 0% and 65%. This field is required.
   */
  TradingFee: number
}

/**
 * Verify the form and type of an AMMVote at runtime.
 *
 * @param tx - An AMMVote Transaction.
 * @throws When the AMMVote is Malformed.
 */
export function validateAMMVote(tx: Record<string, unknown>): void {
  validateBaseTransaction(tx)

  if (tx.AMMID == null) {
    throw new ValidationError('AMMVote: missing field AMMID')
  }

  if (typeof tx.AMMID !== 'string') {
    throw new ValidationError('AMMVote: AMMID must be a string')
  }

  if (tx.TradingFee == null) {
    throw new ValidationError('AMMVote: missing field TradingFee')
  }

  if (typeof tx.TradingFee !== 'number') {
    throw new ValidationError('AMMVote: TradingFee must be a number')
  }

  if (tx.TradingFee < 0 || tx.TradingFee > AMM_MAX_TRADING_FEE) {
    throw new ValidationError(
      `AMMVote: TradingFee must be between 0 and ${AMM_MAX_TRADING_FEE}`,
    )
  }
}
