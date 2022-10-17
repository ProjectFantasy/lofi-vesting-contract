require('dotenv').config()
const HDWalletProvider = require('@truffle/hdwallet-provider')

module.exports = {
  mocha: {
    enableTimeouts: false,
    before_timeout: 120000, // Here is 2min but can be whatever timeout is suitable for you.
  },
  networks: {
    develop: {
      host: '127.0.0.1', // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: '*', // Any network (default: none),
    },
    bsc_testnet: {
      provider: () => {
        return new HDWalletProvider({
          privateKeys: [process.env.TESTNET_DEPLOYER_PRIVATE_KEY],
          providerOrUrl: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
        })
      },
      network_id: 97,
      gas: 8000000,
      gasPrice: 25000000000,
    },

    bsc_mainnet: {
      provider: () => {
        return new HDWalletProvider({
          privateKeys: [process.env.MAINNET_DEPLOYER_PRIVATE_KEY],
          providerOrUrl: `https://speedy-nodes-nyc.moralis.io/880a370e3e7e01538eaef7d3/bsc/mainnet`,
        })
      },
      network_id: 56,
      gas: 8000000,
      gasPrice: 6000000000,
    },
  },
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    bscscan: process.env.ETHERSCAN_API_KEY,
  },
  // Configure your compilers
  compilers: {
    solc: {
      version: '0.8.17',
      docker: true,
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
}
