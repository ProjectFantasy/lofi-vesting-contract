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
    goerli: {
      provider: () =>
        new HDWalletProvider({
          privateKeys: [process.env.TESTNET_DEPLOYER_PRIVATE_KEY],
          providerOrUrl: `https://rpc.ankr.com/eth_goerli`,
        }),
      network_id: 5,
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
    polygon_testnet: {
      provider: () => {
        return new HDWalletProvider({
          privateKeys: [process.env.TESTNET_DEPLOYER_PRIVATE_KEY],
          providerOrUrl: `https://rpc-mumbai.matic.today`,
        })
      },
      network_id: 80001,
      gas: 8000000,
      gasPrice: 2000000000,
    },
    eth_mainnet: {
      provider: () => {
        return new HDWalletProvider(
          process.env.MAINNET_DEPLOYER_PRIVATE_KEY,
          `wss://mainnet.infura.io/ws/v3/${process.env.INFURA_KEY}`
        )
      },
      network_id: 1,
      gas: 8000000,
      gasPrice: 17000000000,
    },
  },
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    // bscscan: process.env.ETHERSCAN_API_KEY,
    etherscan: process.env.ETHERSCAN_API_KEY,
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
