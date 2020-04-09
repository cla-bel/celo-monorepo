import { AttestationsWrapper } from '@celo/contractkit/lib/wrappers/Attestations'
import fetch from 'node-fetch'
import config from '../config'
import { getPerformedQueryCount } from '../database/wrappers/account'
import { getContractKit } from '../web3/contracts'

export class QueryQuota {
  /*
   * Returns how many queries the account can make based on the
   * calculated query quota and the number of queries already performed.
   */
  async getRemainingQueryCount(account: string, phoneNumber: string) {
    const queryQuota = await this.getQueryQuota(account, phoneNumber)
    const performedQueryCount = await getPerformedQueryCount(account).catch((reason) => {
      // TODO [amyslawson] think of failure case here
      console.error(reason)
      return 0
    })
    return queryQuota - performedQueryCount
  }

  /*
   * Calculates how many queries the caller has unlocked based on the algorithm
   * unverifiedQueryCount + verifiedQueryCount + (queryPerTransaction * transactionCount)
   */
  async getQueryQuota(account: string, phoneNumber: string) {
    let queryQuota = config.salt.unverifiedQueryMax
    if (await this.isVerified(account, phoneNumber)) {
      queryQuota += config.salt.additionalVerifiedQueryMax
      const transactionCount = await this.getTransactionCountFromAccount(account)
      queryQuota += config.salt.queryPerTransaction * transactionCount
    }
    return queryQuota
  }

  async isVerified(account: string, phoneNumber: string): Promise<boolean> {
    const attestationsWrapper: AttestationsWrapper = await getContractKit().contracts.getAttestations()
    const attestationStats = await attestationsWrapper.getAttestationStat(phoneNumber, account)
    const numAttestationsCompleted = attestationStats.completed
    const numAttestationsRemaining =
      config.attestations.numberAttestationsRequired - numAttestationsCompleted
    return numAttestationsRemaining <= 0
  }

  async getTransactionCountFromAccount(account: string): Promise<number> {
    const t = await getContractKit().web3.eth.getTransaction(account)
    // TODO [amyslawson] consider adding retry
    const transactionUrl = `${config.blockchain.blockscout}/api?module=account&action=tokentx&address=${account}`
    const resp = await fetch(transactionUrl)
    const jsonResp = await resp.json()
    if (jsonResp == null || jsonResp.result == null) {
      console.error(`Failed to get valid response for ${transactionUrl}`)
      return 0
    }
    console.log('***COMPARE: ' + jsonResp.result.length + ' ANNNND ' + t)
    return jsonResp.result.filter((transaction: any) => transaction.from === account).length
  }
}
