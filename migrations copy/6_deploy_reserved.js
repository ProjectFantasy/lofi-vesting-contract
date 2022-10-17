const generateMonthlyVestingStages = require('../utils/generate-vesting-stage')
const { BN } = require('openzeppelin-test-helpers')
const Vesting = artifacts.require('Vesting')
const vestingTokenAddr = process.env.VESTING_TOKEN
const beneficiary = '0x2502156C21df7A51f0254f685547Af297E182411'
module.exports = async (deployer, network) => {
  if (network == 'develop') return

  const totalAmount = new BN(50000000)
  const times = new BN(7 * 12)
  const { vestingTimes, vestingAmounts } = await generateMonthlyVestingStages(
    totalAmount,
    times,
    new BN(Math.floor(Date.now() / 1000))
  )

  await deployer.deploy(Vesting, beneficiary, vestingTokenAddr, totalAmount)
  const vestingContract = await Vesting.deployed()
  await vestingContract.pushStages(vestingTimes, vestingAmounts)
}
