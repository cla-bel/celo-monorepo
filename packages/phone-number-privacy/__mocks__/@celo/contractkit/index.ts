import Web3 from 'web3'

const Attestations = {
  getAttestationStat: jest.fn(),
}

const web3 = new Web3()

const kit = {
  contracts: {
    getAttestations: jest.fn(async () => Attestations),
  },
  registry: {
    addressFor: async () => 1000,
  },
  web3,
}

export const newKit = () => kit

export enum CeloContract {
  Attestations = 'Attestations',
}
