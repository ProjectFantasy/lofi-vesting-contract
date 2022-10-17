const { BN } = require('openzeppelin-test-helpers')
const Vesting = artifacts.require('Vesting')
const vestingTokenAddr = process.env.VESTING_TOKEN
const beneficiary = '0x773de06482c778c351F0cfa4Be37b6Be9BFd4CA1'
module.exports = async (deployer, network) => {
  if (network == 'develop') return
  const totalAmount = new BN(300000000)

  await deployer.deploy(Vesting, beneficiary, vestingTokenAddr, totalAmount)
  await Vesting.deployed()
}
