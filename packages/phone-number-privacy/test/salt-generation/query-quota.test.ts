// import fetch, { Response as FetchResponseClass } from 'node-fetch'
// import { getPerformedQueryCount } from '../../src/database/wrappers/account'
import { QueryQuota } from '../../src/salt-generation/query-quota'
// import { getContractKit } from '../../src/web3/contracts'

const ACCOUNT = '0x78dc5D2D739606d31509C31d654056A45185ECb6'
const PHONE_NUMBER = '+1234567890'
const queryQuota: QueryQuota = new QueryQuota()

// jest.mock('node-fetch')
// const mockBlockscoutFetch = fetch as jest.Mock
// const FetchResponse: typeof FetchResponseClass = jest.requireActual('node-fetch').Response

// // jest.mock('../../src/salt-generation/query-quota')
// // const mockIsVerified = isVerified as jest.Mock

// const defaultResponse = {
//   result: [
//     {
//       to: 'recipient',
//       from: ACCOUNT,
//       value: '1',
//       blockNumber: 123,
//       txHash: 'txhash',
//       timestamp: 1,
//     },
//     {
//       from: ACCOUNT,
//       to: 'sender',
//       value: '1',
//       blockNumber: 124,
//       txHash: 'txhash',
//       timestamp: 1,
//     },
//     {
//       from: 'recipient',
//       to: ACCOUNT,
//       value: '1',
//       blockNumber: 125,
//       txHash: 'txhash',
//       timestamp: 1,
//     },
//   ],
// }
// const defaultResponseJson = JSON.stringify(defaultResponse)

// describe(`Retrieve Transaction Count`, () => {
//   beforeEach(() => {
//     jest.clearAllMocks()
//   })
//   it('happy path returns transaction count', async () => {
//     mockBlockscoutFetch.mockImplementation(() => new FetchResponse(defaultResponseJson))
//     expect(await queryQuota.getTransactionCountFromAccount(ACCOUNT)).toEqual(2)
//   })
//   it('network failure returns count of 0', async () => {
//     mockBlockscoutFetch.mockImplementation(() => new FetchResponse(JSON.stringify(null)))
//     expect(await queryQuota.getTransactionCountFromAccount(ACCOUNT)).toEqual(0)
//   })
//   it('network failure returns count of 0', async () => {
//     mockBlockscoutFetch.mockImplementation(() => new FetchResponse(JSON.stringify({ garbage: 2 })))
//     expect(await queryQuota.getTransactionCountFromAccount(ACCOUNT)).toEqual(0)
//   })
// })

describe(`Retrieve Transaction Count`, () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('verified without any transactions', async () => {
    jest.spyOn(queryQuota, 'isVerified').mockResolvedValue(true)
    jest.spyOn(queryQuota, 'getTransactionCountFromAccount').mockResolvedValue(0)
    expect(await queryQuota.getQueryQuota(ACCOUNT, PHONE_NUMBER)).toEqual(32)
  })
  it('verified without transactions', async () => {
    jest.spyOn(queryQuota, 'isVerified').mockResolvedValue(true)
    jest.spyOn(queryQuota, 'getTransactionCountFromAccount').mockResolvedValue(2)
    expect(await queryQuota.getQueryQuota(ACCOUNT, PHONE_NUMBER)).toEqual(36)
  })
  it('unverified', async () => {
    jest.spyOn(queryQuota, 'isVerified').mockResolvedValue(false)
    expect(await queryQuota.getQueryQuota(ACCOUNT, PHONE_NUMBER)).toEqual(2)
  })
})

describe.only(`Assert phone number is verified`, () => {
  it('happy path returns true', async () => {
    // const mockAttestationsWrapperUnverified = {
    //   getAttestationStat: jest.fn(() => ({ completed: 3, total: 3 })),
    // }
    // @ts-ignore Jest mock
    // getContractKit().contracts.getAttestations.mockReturnValue(mockAttestationsWrapperUnverified)
    expect(await queryQuota.isVerified(ACCOUNT, PHONE_NUMBER)).toEqual(true)
  })
})
