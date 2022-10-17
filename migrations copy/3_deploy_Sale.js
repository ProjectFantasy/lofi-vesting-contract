const { generateMonthlyVestingStagesInWei } = require('../utils/generate-vesting-stage')
const { BN } = require('openzeppelin-test-helpers')
const Vesting = artifacts.require('Vesting')
const vestingTokenAddr = process.env.VESTING_TOKEN
const beneficiary = '0x709b0042ecC2AF0cb90dbeE73B7ab9054A9879F1'
module.exports = async (deployer, network) => {
  if (network == 'develop') return

  const totalAmount = new BN(100000000)
  const times = new BN(1 * 12)
  const { vestingTimes, vestingAmounts } = await generateMonthlyVestingStagesInWei(
    totalAmount,
    times,
    new BN(Math.floor(Date.now() / 1000))
  )

  await deployer.deploy(Vesting, beneficiary, vestingTokenAddr, totalAmount)
  const vestingContract = await Vesting.deployed()
  await vestingContract.pushStages(vestingTimes, vestingAmounts)
}
