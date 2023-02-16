import { assert } from 'chai'

import { EscrowCreate } from '../../../src'
import serverUrl from '../serverUrl'
import {
  setupClient,
  teardownClient,
  type XrplIntegrationTestContext,
} from '../setup'
import { testTransaction } from '../utils'

// how long before each test case times out
const TIMEOUT = 20000

describe('EscrowCreate', function () {
  let testContext: XrplIntegrationTestContext

  beforeEach(async () => {
    testContext = await setupClient(serverUrl, true)
  })
  afterEach(async () => teardownClient(testContext))

  it(
    'test xrp',
    async () => {
      // get the most recent close_time from the standalone container for finish after.
      const CLOSE_TIME: number = (
        await testContext.client.request({
          command: 'ledger',
          ledger_index: 'validated',
        })
      ).result.ledger.close_time

      const tx: EscrowCreate = {
        Account: testContext.wallet.classicAddress,
        TransactionType: 'EscrowCreate',
        Amount: '10000',
        Destination: testContext.destination.classicAddress,
        FinishAfter: CLOSE_TIME + 2,
      }

      await testTransaction(testContext.client, tx, testContext.wallet)

      // check that the object was actually created
      assert.equal(
        (
          await testContext.client.request({
            command: 'account_objects',
            account: testContext.wallet.classicAddress,
          })
        ).result.account_objects.length,
        2,
      )
    },
    TIMEOUT,
  )

  it(
    'test token',
    async () => {
      // get the most recent close_time from the standalone container for finish after.
      const CLOSE_TIME: number = (
        await testContext.client.request({
          command: 'ledger',
          ledger_index: 'validated',
        })
      ).result.ledger.close_time

      const tx: EscrowCreate = {
        Account: testContext.wallet.classicAddress,
        TransactionType: 'EscrowCreate',
        Amount: {
          currency: 'USD',
          issuer: testContext.gateway.classicAddress,
          value: '100',
        },
        Destination: testContext.destination.classicAddress,
        FinishAfter: CLOSE_TIME + 2,
      }

      await testTransaction(testContext.client, tx, testContext.wallet)

      // check that the object was actually created
      assert.equal(
        (
          await testContext.client.request({
            command: 'account_objects',
            account: testContext.wallet.classicAddress,
          })
        ).result.account_objects.length,
        2,
      )
    },
    TIMEOUT,
  )
})
