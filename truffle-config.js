require('dotenv').config()
const HDWalletProvider = require('@truffle/hdwallet-provider')

module.exports = {
  mocha: {
    enableTimeouts: false,
    before_timeout: 120000, // Here is 2min but can be whatever timeout is suitable for you.
  },
  networks: {
    development: {
      host: '127.0.0.1', // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: '*', // Any network (default: none),
    },
    eth_testnet: {
      provider: () => {
        return new HDWalletProvider(
          process.env.TESTNET_DEPLOYER_PRIVATE_KEY,
          `wss://rinkeby.infura.io/ws/v3/${process.env.INFURA_KEY}`
        )
      },
      network_id: 4,
      gas: 8000000,
      gasPrice: 2000000000,
    },
    bsc_testnet: {
      provider: () => {
        return new HDWalletProvider({
          privateKeys: [process.env.TESTNET_DEPLOYER_PRIVATE_KEY],
          providerOrUrl: `https://speedy-nodes-nyc.moralis.io/880a370e3e7e01538eaef7d3/bsc/testnet`,
        })
      },
      network_id: 97,
      gas: 8000000,
      gasPrice: 25000000000,
    },
    avax_testnet: {
      provider: () => {
        return new HDWalletProvider({
          privateKeys: [process.env.TESTNET_DEPLOYER_PRIVATE_KEY],
          providerOrUrl: `https://api.avax-test.network/ext/bc/C/rpc`,
        })
      },
      network_id: 43113,
      gas: 8000000,
      gasPrice: 25000000000,
    },
    fantom_testnet: {
      provider: () => {
        return new HDWalletProvider({
          privateKeys: [process.env.TESTNET_DEPLOYER_PRIVATE_KEY],
          providerOrUrl: `https://rpc.testnet.fantom.network`,
        })
      },
      network_id: 4002,
      gas: 8000000,
      gasPrice: 210000000000,
    },
    polygon_testnet: {
      provider: () => {
        return new HDWalletProvider({
          privateKeys: [process.env.TESTNET_DEPLOYER_PRIVATE_KEY],
          providerOrUrl: `https://speedy-nodes-nyc.moralis.io/33b0b3ae95d96e05c5a42a77/polygon/mumbai`,
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
      gasPrice: 55000000000,
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
    avax_mainnet: {
      provider: () => {
        return new HDWalletProvider({
          privateKeys: [process.env.MAINNET_DEPLOYER_PRIVATE_KEY],
          providerOrUrl: `https://api.avax.network/ext/bc/C/rpc`,
        })
      },
      network_id: 43114,
      gas: 8000000,
      gasPrice: 50000000000,
    },
    fantom_mainnet: {
      provider: () => {
        return new HDWalletProvider({
          privateKeys: [process.env.MAINNET_DEPLOYER_PRIVATE_KEY],
          providerOrUrl: `https://rpc.ftm.tools`,
        })
      },
      network_id: 250,
      gas: 8000000,
      gasPrice: 360000000000,
    },
    polygon_mainnet: {
      provider: () => {
        return new HDWalletProvider({
          privateKeys: [process.env.MAINNET_DEPLOYER_PRIVATE_KEY],
          providerOrUrl: `https://polygon-rpc.com`,
        })
      },
      network_id: 137,
      gas: 8000000,
      gasPrice: 60000000000,
    },
  },
  plugins: ['truffle-plugin-verify'],
  api_keys: {
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
