import { assert } from 'chai'

import { XChainCreateBridge } from '../../../src'
import serverUrl from '../serverUrl'
import {
  setupClient,
  teardownClient,
  type XrplIntegrationTestContext,
} from '../setup'
import { GENESIS_ACCOUNT, testTransaction } from '../utils'

// how long before each test case times out
const TIMEOUT = 20000

describe('XChainCreateBridge', function () {
  let testContext: XrplIntegrationTestContext

  beforeEach(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterEach(async () => teardownClient(testContext))

  it(
    'base',
    async () => {
      const tx: XChainCreateBridge = {
        TransactionType: 'XChainCreateBridge',
        Account: testContext.wallet.classicAddress,
        XChainBridge: {
          LockingChainDoor: testContext.wallet.classicAddress,
          LockingChainIssue: { currency: 'XAH' },
          IssuingChainDoor: GENESIS_ACCOUNT,
          IssuingChainIssue: { currency: 'XAH' },
        },
        SignatureReward: '200',
        MinAccountCreateAmount: '10000000',
      }

      await testTransaction(testContext.client, tx, testContext.wallet)

      // confirm that the transaction actually went through
      const accountObjectsResponse = await testContext.client.request({
        command: 'account_objects',
        account: testContext.wallet.classicAddress,
        type: 'bridge',
      })
      assert.lengthOf(
        accountObjectsResponse.result.account_objects,
        1,
        'Should be exactly one bridge owned by the account',
      )
    },
    TIMEOUT,
  )
})
