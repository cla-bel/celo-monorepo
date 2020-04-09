import { newKit } from '@celo/contractkit'
import config from '../../config'

export const getContractKit = () => {
  console.log('*Mock Contract Kit')
  throw new Error()
  // return newKit(config.blockchain.provider)
}
